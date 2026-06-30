import { GiftIdea } from "@/lib/types";
import { GiftLinks } from "./GiftLinks";

const LABELS: Record<string, string> = {
  safe: "Safe choice",
  thoughtful: "Thoughtful choice",
  fun: "Fun / surprising choice",
};

const ACCENTS: Record<string, string> = {
  safe: "bg-safe/10 text-safe-deep",
  thoughtful: "bg-primary/10 text-primary-deep",
  fun: "bg-accent/10 text-accent-deep",
};

const BORDERS: Record<string, string> = {
  safe: "border-safe",
  thoughtful: "border-primary",
  fun: "border-accent",
};

export function HighlightCard({ idea, recipient }: { idea: GiftIdea; recipient: string }) {
  const label = idea.highlight ? LABELS[idea.highlight] : "";
  const accent = idea.highlight ? ACCENTS[idea.highlight] : "bg-primary/10 text-primary-deep";
  const border = idea.highlight ? BORDERS[idea.highlight] : "border-ink/15";

  return (
    <article
      className={`animate-card-entrance overflow-hidden rounded-card border-2 bg-white shadow-sm motion-reduce:animate-none ${border}`}
    >
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
      <div className="p-6">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide ${accent}`}>
          {label}
        </span>
        <h3 className="mt-4 text-xl font-extrabold leading-snug text-ink">{idea.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/80">
          <span className="font-semibold text-ink">Why {recipient} will love it: </span>
          {idea.why}
        </p>
        <p className="mt-3 text-sm font-semibold text-muted">
          ₹{idea.price_min.toLocaleString("en-IN")}–₹{idea.price_max.toLocaleString("en-IN")}
        </p>
        <GiftLinks idea={idea} />
      </div>
    </article>
  );
}
