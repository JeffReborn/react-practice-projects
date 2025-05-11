// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
// import TodoList from './components/todolist/todolist';
// import MiniSurveyForm from './components/miniSurveyForm';
import MyTodoList from './components/mytodolist/todoList';

export default function App() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-red-500">Hello Tailwind!</h1>
      {/* <TodoList /> */}
      {/* <MiniSurveyForm /> */}
      <MyTodoList />
    </div>
  );
}
