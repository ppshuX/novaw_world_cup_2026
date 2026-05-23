import { ArrowUpRight, Link2, Mail } from 'lucide-react';
import { getOfficialSources } from '../services/worldCupData';

const feedbackEmail = '2064747320@qq.com';

export function OfficialSources() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-[8px] border border-white/80 bg-white/[0.92] p-5 shadow-sm backdrop-blur">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold text-summer-blue">Official Sources</p>
            <h2 className="text-2xl font-black sm:text-3xl">官方数据入口</h2>
          </div>
          <p className="max-w-xl text-sm font-medium leading-6 text-slate-600">
            本项目为个人学习与公开展示项目，赛程数据由本地人工维护，主要参考 FIFA 官方页面。
          </p>
        </div>

        <div className="mb-4 rounded-[8px] bg-slate-50 p-4 text-sm font-medium leading-6 text-slate-600">
          数据更新时间：2026-05-23。赛程对阵和时间将根据 FIFA 官方赛程人工维护；比分、结果和晋级情况将在比赛进行后更新。
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {getOfficialSources().map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-[8px] border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-summer-sky hover:bg-white hover:shadow-card"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-summer-blue text-white">
                  <Link2 size={18} />
                </span>
                <span className="rounded-[6px] bg-summer-lime px-2 py-1 text-xs font-black text-[#17331d]">
                  {source.tag}
                </span>
              </div>
              <h3 className="flex items-start justify-between gap-3 text-lg font-black">
                <span>{source.title}</span>
                <ArrowUpRight size={18} className="mt-1 shrink-0 text-slate-400 transition group-hover:text-summer-blue" />
              </h3>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{source.description}</p>
            </a>
          ))}
        </div>

        <div className="mt-4 rounded-[8px] border border-summer-sky/30 bg-[#f4fbff] p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-summer-blue text-white">
              <Mail size={18} />
            </span>
            <div>
              <p className="text-sm font-bold text-summer-blue">数据纠错</p>
              <h3 className="text-xl font-black">信息更正与反馈</h3>
            </div>
          </div>
          <p className="text-sm font-medium leading-6 text-slate-600">
            本站数据主要参考 FIFA 官方页面，并由本地人工维护。若存在赛程变更、时区换算错误、球队信息错误或数据更新延迟，欢迎通过邮箱反馈。收到反馈后会人工核对官方来源并更新。
          </p>
          <a
            href={`mailto:${feedbackEmail}`}
            className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-[8px] bg-[#172033] px-3 py-2 text-sm font-black text-white transition hover:bg-summer-blue"
          >
            联系站长：{feedbackEmail}
            <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
