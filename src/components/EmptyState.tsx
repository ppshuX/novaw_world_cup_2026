import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[8px] border border-dashed border-summer-sky bg-white/80 px-4 py-8 text-center shadow-sm sm:px-6 sm:py-10">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-[8px] bg-summer-sky/15 text-summer-blue sm:h-12 sm:w-12">
        <SearchX size={18} className="sm:size-[22px]" />
      </span>
      <h3 className="mt-3 text-base font-black sm:mt-4 sm:text-lg">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-xs font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">{description}</p>
    </div>
  );
}
