// import "./App.css";
// import TodoList from './components/todolist/todolist';
// import MiniSurveyForm from './components/miniSurveyForm';
// import MyTodoList from './components/mytodolist/todoList';
import TicTacToe from './components/tictactoe';

export default function App() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-red-500">Hello Tailwind!</h1>
      {/* <TodoList /> */}
      {/* <MiniSurveyForm /> */}
      {/* <MyTodoList /> */}
      <TicTacToe />
    </div>
  );
}
