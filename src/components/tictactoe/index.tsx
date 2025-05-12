import { useState } from 'react';
type HistoryProp = {
  board: string[]; // 当前棋盘的落子状态 相当于当前的boxList
  lastPlayer: string | null; // 上一次走的玩家是谁
  winner: string | null; // 当前赢家
  currentClickIndex: number; // 当前点击的格子
};
export default function TicTacToe() {
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [boxList, setBoxList] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryProp[]>([]);
  const [step, setStep] = useState(0); // 当前步数
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLDivElement;
    if (!target || checkWinner(boxList)) return;
    const cell = target.closest('[data-id]') as HTMLDivElement | null;
    if (cell) {
      const index = parseInt(cell.dataset.id || '');
      if (boxList[index]) return; // 如果这个格子已经被点击过了，就不处理
      const newBoxList = [...boxList];
      newBoxList[index] = currentPlayer;
      setBoxList(newBoxList);
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      checkWinner(newBoxList);
      setHistory([
        ...history,
        {
          board: newBoxList,
          lastPlayer: currentPlayer,
          winner: checkWinner(newBoxList),
          currentClickIndex: index,
        },
      ]);
      setStep(step + 1);
    }
  }
  function handleClickHistory(e: React.MouseEvent<HTMLUListElement>) {
    const target = e.target as HTMLLIElement;
    if (!target) return;
    const cell = target.closest('[data-id]') as HTMLLIElement | null;
    if (cell) {
      const index = parseInt(cell.dataset.id || '');
      const historyItem = history[index];
      if (historyItem) {
        setBoxList(historyItem.board);
        setCurrentPlayer(historyItem.lastPlayer === 'X' ? 'O' : 'X');
        setWinner(historyItem.winner);
        setStep(index + 1);
      }
    }
  }
  function checkWinner(boxList: string[]) {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (boxList[a] && boxList[a] === boxList[b] && boxList[a] === boxList[c]) {
        setWinner(boxList[a]);
        return boxList[a];
      }
    }
    return null;
  }
  function handleReset() {
    setBoxList(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setHistory([]);
    setStep(0);
  }

  return (
    <>
      {winner ? <p>胜者是:{winner}</p> : <p>当前玩家是:{currentPlayer}</p>}
      <p>当前步数是:{step}</p>

      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={handleReset}>
        Reset
      </button>
      <div className="flex justify-start">
        <div className="grid grid-cols-3 w-64 h-64 border" onClick={(e) => handleClick(e)}>
          {boxList.map((box, ind) => (
            <div
              key={ind}
              data-id={ind}
              className="aspect-square flex items-center justify-center border border-gray-400 text-[3.25rem] font-bold cursor-pointer  hover:bg-sky-200 transition"
            >
              {box ? box : ''}
              {/* {'X'} */}
            </div>
          ))}
        </div>
        <div className="ml-20">
          <p>History</p>
          <ul onClick={handleClickHistory}>
            {history.map((item, index) => (
              <li
                key={index}
                data-id={index}
                className="border border-gray-400 cursor-pointer hover:bg-sky-200 transition"
              >
                {item.lastPlayer} 在 {item.currentClickIndex} 位置落子
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
