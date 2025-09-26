import { Link } from 'react-router-dom';
import { gameEntries } from '../../routes/config';

export default function Home() {
  console.log('gameEntries', gameEntries);

  return (
    <div className="p-10 space-y-6">
      <h2 className="text-xl font-semibold">小游戏合集</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {gameEntries.map((g) => (
          <Link key={g.path} to={g.path} className="rounded-xl border p-4 hover:shadow transition">
            {g.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
