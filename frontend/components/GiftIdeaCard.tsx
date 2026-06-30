import { GiftIdea } from "@/lib/types";
import { GiftLinks } from "./GiftLinks";

export function GiftIdeaCard({ idea, recipient }: { idea: GiftIdea; recipient: string }) {
  return (
    <article className="overflow-hidden rounded-card border border-ink/10 bg-white">
      {idea.image_url && (
        <img
          src={idea.image_url}
          alt={idea.name}
          loading="lazy"
          width={400}
          height={300}
          className="aspect-[4/3] w-full object-cover"
        />
      )}
      <div className="p-5">
        {idea.is_combo && (
          <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-wide text-primary-deep">
            Combo pack
          </span>
        )}
        <h4 className="text-base font-bold text-ink">{idea.name}</h4>
        <p className="mt-1 text-sm text-ink">
          <span className="font-semibold">Why {recipient} will love it: </span>
          {idea.why}
        </p>
        <p className="mt-2 text-sm font-semibold text-muted">
          ₹{idea.price_min.toLocaleString("en-IN")}–₹{idea.price_max.toLocaleString("en-IN")}
        </p>
        <p className="mt-1 text-xs text-muted">Look for it: {idea.where_to_look.join(", ")}</p>
        <GiftLinks idea={idea} />
      </div>
    </article>
  );
}
