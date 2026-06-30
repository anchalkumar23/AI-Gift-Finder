import { GiftIdea } from "@/lib/types";
import { GiftIdeaCard } from "./GiftIdeaCard";

function groupByCategory(ideas: GiftIdea[]): Map<string, GiftIdea[]> {
  const groups = new Map<string, GiftIdea[]>();
  for (const idea of ideas) {
    const existing = groups.get(idea.category) ?? [];
    existing.push(idea);
    groups.set(idea.category, existing);
  }
  return groups;
}

export function ResultsGrid({ ideas, recipient }: { ideas: GiftIdea[]; recipient: string }) {
  const groups = groupByCategory(ideas);

  return (
    <div className="mt-8 space-y-8">
      {Array.from(groups.entries()).map(([category, categoryIdeas]) => (
        <section key={category}>
          <h3 className="text-lg font-bold text-ink">{category}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryIdeas.map((idea) => (
              <GiftIdeaCard key={idea.name} idea={idea} recipient={recipient} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
