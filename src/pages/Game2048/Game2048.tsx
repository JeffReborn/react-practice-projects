import Game2048 from '@/components/Game2048';

export default function Game2048Page() {
  return (
    <div className="p-10 space-y-4">
      <a href="/" className="underline">
        ← 返回首页
      </a>
      <Game2048 />
    </div>
  );
}
