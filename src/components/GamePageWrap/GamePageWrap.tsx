export default function GamePageWrap({ children }: { children: React.ReactNode }) {
  //
  return (
    <div className="p-10 space-y-4">
      <a href="/" className="underline">
        ← 返回首页
      </a>
      {children}
    </div>
  );
}
