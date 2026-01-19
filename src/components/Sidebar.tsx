type Props = { items: string[] };

export function Sidebar({ items }: Props) {
  return (
    <aside className="bg-[url('/assets/denim-texture.jpg')] bg-cover text-white w-56 h-screen p-4 flex flex-col gap-3 shadow-lg">
      {items.map(item => (
        <button
          key={item}
          className="text-left font-semibold hover:underline hover:opacity-90 transition"
        >
          {item}
        </button>
      ))}
    </aside>
  );
}