import { Database, Smartphone, Sparkles } from 'lucide-react';

const notes = [
  {
    icon: Smartphone,
    title: '移动端优先',
    text: '适合在聊天、通勤、睡前快速确认下一场比赛的北京时间和对阵。',
  },
  {
    icon: Database,
    title: '本地人工维护',
    text: 'V1 不接实时 API，赛程数据会根据 FIFA 官方页面人工核对后更新。',
  },
  {
    icon: Sparkles,
    title: 'Made with football by NovaW',
    text: '保留一点个人风格，但页面主体面向所有需要中文赛程的用户。',
  },
];

export function SummerNotes() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        {notes.map((note) => {
          const Icon = note.icon;
          return (
            <article key={note.title} className="rounded-[8px] border border-white bg-white p-5 shadow-sm">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-[8px] bg-summer-orange text-white">
                <Icon size={20} />
              </span>
              <h2 className="text-xl font-black leading-7">{note.title}</h2>
              <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{note.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
