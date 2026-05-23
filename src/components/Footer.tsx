import { Mail } from 'lucide-react';

const feedbackEmail = '2064747320@qq.com';

export function Footer() {
  return (
    <footer className="border-t border-white/70 bg-white/[0.78] px-4 py-8 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 text-sm font-medium text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-black text-summer-ink">
          World Cup 2026
          <span className="ml-2 rounded-[6px] bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">V1.0</span>
        </p>
        <a
          href={`mailto:${feedbackEmail}`}
          className="inline-flex min-h-10 items-center gap-2 rounded-[8px] bg-slate-100 px-3 py-2 font-bold text-slate-700 transition hover:bg-summer-lime hover:text-[#17331d]"
        >
          <Mail size={16} />
          数据反馈：{feedbackEmail}
        </a>
      </div>
      <p className="mx-auto mt-3 max-w-7xl text-xs leading-5 text-slate-500">
        如发现赛程、北京时间、球队、场馆或晋级信息有误，欢迎反馈：
        <a href={`mailto:${feedbackEmail}`} className="font-bold text-summer-blue hover:underline">
          {feedbackEmail}
        </a>
      </p>
    </footer>
  );
}
