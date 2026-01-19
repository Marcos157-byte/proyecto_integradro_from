type Card = { label: string; count: number };

export function SummaryCards({ cards }: { cards: Card[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {cards.map(card => (
        <div key={card.label} className="bg-gray-100 rounded-lg shadow p-4 text-center">
          <div className="text-sm text-gray-600">{card.label}</div>
          <div className="text-2xl font-bold text-gray-800">{card.count}</div>
        </div>
      ))}
    </div>
  );
}