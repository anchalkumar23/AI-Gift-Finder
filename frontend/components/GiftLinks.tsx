import { GiftIdea } from "@/lib/types";

export function GiftLinks({ idea }: { idea: GiftIdea }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2 text-sm">
      {idea.links.map((link) => {
        const hostname = new URL(link.url).hostname;
        return (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 font-semibold text-ink transition-[color,background-color,border-color,transform] duration-150 ease-out hover:border-primary hover:text-primary active:scale-[0.97]"
          >
            <img
              src={`https://www.google.com/s2/favicons?sz=32&domain=${hostname}`}
              alt=""
              width={14}
              height={14}
              className="rounded-sm"
            />
            {link.platform}
          </a>
        );
      })}
    </div>
  );
}
