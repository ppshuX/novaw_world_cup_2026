import { Check, Copy, Download, QrCode } from 'lucide-react';
import { useCallback, useState } from 'react';

export function SaveSitePage() {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const handleSaveImage = useCallback(() => {
    const a = document.createElement('a');
    a.href = '/images/QR.png';
    a.download = '世界杯赛程2026-QR.png';
    a.click();
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-red-100/60 bg-[#fffcf9] shadow-card">
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="mb-2 flex items-center gap-2">
            <QrCode size={18} className="text-red-500" />
            <h2 className="text-base font-bold text-red-900/80">保存本站</h2>
          </div>
          <p className="text-sm text-red-400/70">复制链接或截图二维码，随时打开。</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 px-5 pb-4">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200/60 bg-white px-4 py-2.5 text-sm font-semibold text-red-800/80 transition hover:bg-red-50/50 active:scale-[0.97]"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            {copied ? '已复制' : '复制链接'}
          </button>
          <button
            type="button"
            onClick={() => setShowQR((v) => !v)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition active:scale-[0.97] ${
              showQR
                ? 'border-red-400 bg-red-500 text-white shadow-sm'
                : 'border-red-200/60 bg-white text-red-800/80 hover:bg-red-50/50'
            }`}
          >
            <QrCode size={16} />
            二维码
          </button>
        </div>

        {/* QR Code */}
        {showQR && (
          <div className="flex flex-col items-center gap-3 px-5 pb-5">
            <div className="rounded-xl border border-red-100/40 bg-white p-3 shadow-sm">
              <img
                src="/images/QR.png"
                alt="站点二维码"
                className="h-48 w-48 rounded-lg object-contain"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveImage}
              className="flex items-center gap-1.5 text-xs font-medium text-red-400 transition hover:text-red-600"
            >
              <Download size={14} />
              保存图片
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
