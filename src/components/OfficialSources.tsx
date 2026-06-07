import { ArrowUpRight, Link2, Mail } from 'lucide-react';
import { getOfficialSources } from '../services/worldCupData';
import { matches } from '../data/matches';

const feedbackEmail = '2064747320@qq.com';

const sortedUpdatedDates = matches
  .map((match) => match.lastUpdated)
  .filter(Boolean)
  .sort();

const latestDataUpdate = sortedUpdatedDates[sortedUpdatedDates.length - 1] ?? '待更新';

export function OfficialSources() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-[8px] border border-white/80 bg-white/[0.92] p-5 shadow-sm backdrop-blur">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold text-summer-blue">Official Sources</p>
            <h2 className="text-xl font-black sm:text-3xl">官方数据入口</h2>
          </div>
          <p className="max-w-xl text-sm font-medium leading-6 text-slate-600">
            本项目为个人学习与公开展示项目，赛程数据由本地人工维护，主要参考 FIFA 官方页面。
          </p>
        </div>

        <div className="mb-4 rounded-[8px] bg-slate-50 p-3 text-xs font-medium leading-5 text-slate-600 sm:p-4 sm:text-sm sm:leading-6">
          数据更新时间：{latestDataUpdate}。赛程对阵和时间将根据 FIFA 官方赛程人工维护；比分、结果和晋级情况将在比赛进行后更新。
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {getOfficialSources().map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-[8px] border border-slate-100 bg-slate-50 p-3 transition hover:-translate-y-0.5 hover:border-summer-sky hover:bg-white hover:shadow-card sm:p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4 sm:gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-summer-blue text-white sm:h-10 sm:w-10">
                  <Link2 size={16} className="sm:size-[18px]" />
                </span>
                <span className="rounded-[6px] bg-summer-lime px-1.5 py-0.5 text-[10px] font-black text-[#17331d] sm:px-2 sm:py-1 sm:text-xs">
                  {source.tag}
                </span>
              </div>
              <h3 className="flex items-start justify-between gap-2 text-base font-black sm:text-lg">
                <span>{source.title}</span>
                <ArrowUpRight size={16} className="mt-0.5 shrink-0 text-slate-400 transition group-hover:text-summer-blue sm:size-[18px]" />
              </h3>
              <p className="mt-1.5 text-xs font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">{source.description}</p>
            </a>
          ))}
        </div>

        <div className="mt-4 rounded-[8px] border border-summer-sky/30 bg-[#f4fbff] p-3 sm:p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-summer-blue text-white sm:h-10 sm:w-10">
              <Mail size={16} className="sm:size-[18px]" />
            </span>
            <div>
              <p className="text-xs font-bold text-summer-blue sm:text-sm">数据纠错</p>
              <h3 className="text-lg font-black sm:text-xl">信息更正与反馈</h3>
            </div>
          </div>
          <p className="text-xs font-medium leading-5 text-slate-600 sm:text-sm sm:leading-6">
            本站数据主要参考 FIFA 官方页面，并由本地人工维护。若存在赛程变更、时区换算错误、球队信息错误或数据更新延迟，欢迎通过邮箱反馈。收到反馈后会人工核对官方来源并更新。
          </p>
          <a
            href={`mailto:${feedbackEmail}`}
            className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-[8px] bg-[#172033] px-3 py-1.5 text-xs font-black text-white transition hover:bg-summer-blue sm:min-h-10 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
          >
            联系站长：{feedbackEmail}
            <ArrowUpRight size={13} className="sm:size-[15px]" />
          </a>
        </div>
      </div>
    </section>
  );
}
