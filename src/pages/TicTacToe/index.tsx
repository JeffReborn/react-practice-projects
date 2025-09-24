import TicTacToe from '../../components/tictactoe';
import { Link } from 'react-router-dom';

export default function TicTacToePage() {
  return (
    <div className="p-10 space-y-4">
      <Link to="/" className="underline">
        ← 返回首页
      </Link>
      <TicTacToe />
    </div>
  );
}
