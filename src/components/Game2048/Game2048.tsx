import { useState, useEffect } from 'react';
import type { Board, Dir } from './types';
import {
  initializeBoard,
  moveBoard,
  generateNewNumber,
  hasMovesAvailable,
  getBestScore,
  saveBestScore,
} from './logic';

export default function Game2048() {
  const [board, setBoard] = useState<Board>(initializeBoard());
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(getBestScore());

  // 动画用的短时标记
  const [spawnedCell, setSpawnedCell] = useState<[number, number] | null>(null);
  const [mergedCells, setMergedCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const keyMap: Record<string, Dir> = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
      };
      const dir = keyMap[e.key];
      if (!dir) return;
      e.preventDefault(); // 阻止默认滚动行为
      doMove(dir);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [board]); // 依赖 board，使得每次用到的 board 是最新的

  /**
   * 执行一次“移动”
   * 1) 如果已经 Game Over：直接忽略（不再响应移动）
   * 2) 调用逻辑层 moveBoard 执行移动/合并
   * 3) 若本次确实发生变化（moved = true），则：
   *      a) 在新棋盘上随机生成一枚新砖（2 或 4）
   *      b) 更新到 UI
   *      c) 检查是否已经“无空位 & 无可合并” → 若是，则 setOver(true)
   * 4) 若没发生变化（moved = false），不做任何事（避免生成无意义新砖）
   */
  const doMove = (dir: Dir) => {
    if (gameOver) return; // 1) 已经 Game Over，忽略

    const { board: nb, moved, gained, merges } = moveBoard(board, dir);
    if (!moved) return; // 没有变化，啥也不做
    // 2) 有变化，更新分数
    const curScore = score + gained;
    setScore(curScore);
    if (curScore > getBestScore()) {
      setBestScore(curScore);
      saveBestScore(curScore);
    }
    const mergeKeys = new Set(merges.map((m) => `${m.r}-${m.c}`));
    setMergedCells(mergeKeys);
    // 3) 有变化，生成新砖 & 更新 UI & 检查 Game Over
    const { board: newBoardWithNewNumber, newPoints } = generateNewNumber(nb); // a) 生成新砖
    setBoard(newBoardWithNewNumber); // b) 更新到 UI
    setSpawnedCell(newPoints);
    if (!hasMovesAvailable(newBoardWithNewNumber)) {
      // c) 检查是否 Game Over
      setGameOver(true);
      alert('Game Over! No more moves available.');
    }

    // 4) 没有变化，啥也不做
    // 5) 动画标记是短时的：150~200ms 后清除，让元素回弹
    setTimeout(() => {
      setMergedCells(new Set());
      setSpawnedCell(null);
    }, 180);
  };

  // 点击new game 按钮
  const onNewGame = () => {
    setBoard(initializeBoard());
    setGameOver(false);
    setScore(0);
  };

  const renderTopBar = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onNewGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          New Game
        </button>
        <div className="rounded bg-neutral-100 px-3 py-1 font-semibold">Score: {score}</div>
        <div className="rounded bg-yellow-100 px-3 py-1 font-semibold">Best: {bestScore}</div>
        {gameOver && <div className="text-red-600 font-bold">Game Over</div>}
      </div>
    );
  };
  //
  return (
    <div className="p-6 space-y-4">
      {/**顶部工具栏 返回首页 + new game */}
      {renderTopBar()}
      {/**游戏区域 */}
      <div className="grid grid-cols-4 bg-gray-200 p-4 rounded-lg w-fit mx-auto">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={[
                'w-20 h-20 border rounded flex items-center justify-center text-xl font-bold rounded border border-dashed border-gray-400',
                cell ? 'bg-yellow-300 text-black' : 'bg-gray-100 text-gray-300',
                'transition-transform duration-150 ease-out', // ← 平滑回弹
                // 如果是刚合并出的新砖 → 放大
                mergedCells.has(`${rowIndex}-${colIndex}`) ? 'scale-110' : '',
                // 如果是刚生成的新砖 → 也放大（你也可以选择淡入）
                spawnedCell && spawnedCell[0] === rowIndex && spawnedCell[1] === colIndex
                  ? 'scale-110'
                  : '',
              ].join(' ')}
            >
              {cell || ''}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
