import { CheckCircle2, Download, MonitorSmartphone, Share, Smartphone } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

type Platform = 'android' | 'ios-safari' | 'standalone' | 'desktop';

const partnershipEmail = '2064747320@qq.com';

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
      <div className="rounded-[8px] border border-white/80 bg-white/[0.92] p-4 shadow-card backdrop-blur sm:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between sm:gap-5">
          <div>
            <p className="text-xs font-bold text-summer-blue sm:text-sm">PWA App</p>
            <h2 className="text-2xl font-black sm:text-4xl">添加到主屏幕</h2>
            <p className="mt-2 max-w-2xl text-xs font-medium leading-5 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">
              把 World Cup 2026 放到你的手机桌面，像 App 一样查看世界杯赛程。
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-[#172033] text-white shadow-glow sm:h-16 sm:w-16">
            <MonitorSmartphone size={24} className="sm:size-[30px]" />
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_0.9fr] sm:mt-6">
          <div className="rounded-[8px] bg-slate-50 p-3 sm:p-4">
            <button
              type="button"
              onClick={install}
              disabled={installed || platform === 'standalone'}
              className="mb-3 inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-[8px] bg-[#172033] px-4 py-2 text-xs font-black text-white transition hover:bg-summer-blue disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 sm:mb-4 sm:min-h-12 sm:gap-2 sm:text-sm"
            >
              <Download size={16} className="sm:size-[18px]" />
              下载到桌面 / 添加到主屏幕
            </button>
            {notice && (
              <p className="mb-3 rounded-[8px] border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-800 sm:mb-4 sm:text-sm sm:leading-6">
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

          <div className="space-y-3 sm:space-y-4">
            <div className="rounded-[8px] border border-slate-100 bg-white p-3 sm:p-4">
              <h3 className="text-sm font-black sm:text-base">添加后可以做什么</h3>
              <div className="mt-2 space-y-2 text-xs font-medium leading-5 text-slate-600 sm:mt-3 sm:space-y-3 sm:text-sm sm:leading-6">
                <p>1. 从手机桌面直接打开赛程。</p>
                <p>2. 使用独立窗口浏览，减少浏览器干扰。</p>
                <p>3. 更快查看下一场比赛、北京时间和晋级路径。</p>
              </div>
            </div>

            <div className="rounded-[8px] border border-slate-200 bg-slate-50 p-3 sm:p-4">
              <h3 className="text-sm font-black sm:text-base">观赛伙伴位预留</h3>
              <p className="mt-1.5 text-xs font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">
                未来可能开放少量与世界杯观赛相关的合作内容（如观赛工具、球迷活动信息等），用于支持本站持续维护与数据更新。
              </p>
              <p className="mt-1.5 text-xs font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">
                当前仅作展示位预留，不影响赛程、晋级树与官方来源信息的正常使用。
              </p>
              <a
                href={`mailto:${partnershipEmail}?subject=World%20Cup%202026%20合作联系`}
                className="mt-3 inline-flex min-h-9 items-center justify-center rounded-[8px] border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-summer-sky hover:text-summer-blue sm:min-h-10 sm:px-3 sm:py-2 sm:text-sm"
              >
                合作联系：{partnershipEmail}
              </a>
            </div>
          </div>
        </div>

        {platform === 'ios-safari' && (
          <div className="mt-4 rounded-[8px] border border-summer-sky/30 bg-[#f4fbff] p-3 sm:p-4">
            <h3 className="text-sm font-black sm:text-base">iPhone 添加步骤</h3>
            <ol className="mt-2 space-y-1.5 text-xs font-medium leading-5 text-slate-600 sm:mt-3 sm:space-y-2 sm:text-sm sm:leading-6">
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
    <div className="flex gap-2 sm:gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-summer-lime text-[#17331d] sm:h-11 sm:w-11">
        {icon}
      </span>
      <div>
        <h3 className="text-sm font-black sm:text-base">{title}</h3>
        <p className="mt-1 text-xs font-medium leading-5 text-slate-600 sm:text-sm sm:leading-6">{text}</p>
      </div>
    </div>
  );
}
