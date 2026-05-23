import { CheckCircle2, Download, MonitorSmartphone, Share, Smartphone } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

type Platform = 'android' | 'ios-safari' | 'standalone' | 'desktop';

export function InstallPage() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [notice, setNotice] = useState('');

  const platform = useMemo<Platform>(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone));
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isStandalone) return 'standalone';
    if (isIOS && isSafari) return 'ios-safari';
    if (isAndroid) return 'android';
    return 'desktop';
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) {
      setNotice(getUnavailableMessage(platform));
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setNotice(choice.outcome === 'accepted' ? '已开始添加到主屏幕。' : '你取消了添加操作，可以稍后再试。');
    setInstallPrompt(null);
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-[8px] border border-white/80 bg-white/[0.92] p-5 shadow-card backdrop-blur sm:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-summer-blue">PWA App</p>
            <h2 className="text-3xl font-black sm:text-4xl">添加到主屏幕</h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600 sm:text-base sm:leading-7">
              把 World Cup 2026 放到你的手机桌面，像 App 一样查看世界杯赛程。
            </p>
          </div>
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[8px] bg-[#172033] text-white shadow-glow">
            <MonitorSmartphone size={30} />
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[8px] bg-slate-50 p-4">
            <button
              type="button"
              onClick={install}
              disabled={installed || platform === 'standalone'}
              className="mb-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-[#172033] px-4 py-2 text-sm font-black text-white transition hover:bg-summer-blue disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
            >
              <Download size={18} />
              下载到桌面 / 添加到主屏幕
            </button>
            {notice && (
              <p className="mb-4 rounded-[8px] border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold leading-6 text-amber-800">
                {notice}
              </p>
            )}

            {installed || platform === 'standalone' ? (
              <StatusCard
                icon={<CheckCircle2 size={22} />}
                title="已经像 App 一样运行"
                text="你当前正在独立窗口中打开网站，可以从桌面快速进入赛程。"
              />
            ) : platform === 'android' ? (
              installPrompt ? (
                <div>
                  <StatusCard
                    icon={<Smartphone size={22} />}
                    title="当前浏览器支持安装"
                    text="点击下方按钮后，浏览器会显示官方添加到主屏幕提示。"
                  />
                </div>
              ) : (
                <StatusCard
                  icon={<Smartphone size={22} />}
                  title="等待浏览器安装提示"
                  text="请使用 Android Chrome / Edge 打开。若按钮暂未出现，请稍后重试，或从浏览器菜单选择添加到主屏幕。"
                />
              )
            ) : platform === 'ios-safari' ? (
              <StatusCard
                icon={<Share size={22} />}
                title="iPhone / iPad 需要手动添加"
                text="在 Safari 中点击“分享”按钮，然后选择“添加到主屏幕”。iOS 不支持网页主动弹出安装按钮。"
              />
            ) : (
              <StatusCard
                icon={<MonitorSmartphone size={22} />}
                title="移动端体验更完整"
                text="在手机 Chrome、Edge 或 iPhone Safari 中打开本站，即可添加到主屏幕。桌面浏览器也可以在地址栏或菜单中安装。"
              />
            )}
          </div>

          <div className="rounded-[8px] border border-slate-100 bg-white p-4">
            <h3 className="font-black">添加后可以做什么</h3>
            <div className="mt-3 space-y-3 text-sm font-medium leading-6 text-slate-600">
              <p>1. 从手机桌面直接打开赛程。</p>
              <p>2. 使用独立窗口浏览，减少浏览器干扰。</p>
              <p>3. 更快查看下一场比赛、北京时间和晋级路径。</p>
            </div>
          </div>
        </div>

        {platform === 'ios-safari' && (
          <div className="mt-4 rounded-[8px] border border-summer-sky/30 bg-[#f4fbff] p-4">
            <h3 className="font-black">iPhone 添加步骤</h3>
            <ol className="mt-3 space-y-2 text-sm font-medium leading-6 text-slate-600">
              <li>1. 确认当前使用 Safari 打开。</li>
              <li>2. 点击底部工具栏的“分享”按钮。</li>
              <li>3. 选择“添加到主屏幕”。</li>
              <li>4. 返回桌面，即可像 App 一样打开。</li>
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

function getUnavailableMessage(platform: Platform) {
  if (platform === 'ios-safari') {
    return 'iPhone / iPad 不能由网页直接弹出安装框，请在 Safari 中点击“分享”，再选择“添加到主屏幕”。';
  }

  if (platform === 'android') {
    return '当前浏览器暂未开放安装提示。请确认使用 Android Chrome / Edge，并在 HTTPS 正式网址中打开；也可以从浏览器菜单选择“添加到主屏幕”。';
  }

  if (platform === 'standalone') {
    return '当前已经是桌面 App 模式，无需重复添加。';
  }

  return '当前浏览器暂时不能直接触发添加。请在手机 Chrome / Edge 或 iPhone Safari 中打开，或使用浏览器菜单里的安装/添加到主屏幕选项。';
}

function StatusCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-summer-lime text-[#17331d]">
        {icon}
      </span>
      <div>
        <h3 className="font-black">{title}</h3>
        <p className="mt-1 text-sm font-medium leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}
