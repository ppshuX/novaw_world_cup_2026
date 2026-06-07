import { Mail } from 'lucide-react';

const feedbackEmail = '2064747320@qq.com';

export function Footer() {
  return (
    <footer className="border-t border-white/70 bg-white/[0.78] px-4 py-6 backdrop-blur sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 text-xs font-medium text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:text-sm">
        <p className="font-black text-summer-ink text-sm sm:text-base">
          World Cup 2026
          <span className="ml-2 rounded-[6px] bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 sm:px-2 sm:py-0.5 sm:text-xs">V1.0</span>
        </p>
        <a
          href={`mailto:${feedbackEmail}`}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-[8px] bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-summer-lime hover:text-[#17331d] sm:min-h-10 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
        >
          <Mail size={14} className="sm:size-[16px]" />
          数据反馈：{feedbackEmail}
        </a>
      </div>
      <p className="mx-auto mt-3 max-w-7xl text-[11px] leading-5 text-slate-500 sm:text-xs">
        如发现赛程、北京时间、球队、场馆或晋级信息有误，欢迎反馈：
        <a href={`mailto:${feedbackEmail}`} className="font-bold text-summer-blue hover:underline">
          {feedbackEmail}
        </a>
      </p>
    </footer>
  );
}
