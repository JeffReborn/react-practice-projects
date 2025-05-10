import { useState } from 'react';
import type { Todo } from './todolist.types';
import TodoItem from './todoItems';

let idCount = 1;
export default function TodoList() {
  //定义input绑定的变量值和set函数
  const [textInput, setTextInput] = useState('');
  //定义todoItems的对象数组
  const [todoList, setTodoList] = useState<Todo[]>([]);

  function addHandle() {
    if (textInput.trim() == '') return;
    setTodoList([...todoList, { id: ++idCount, text: textInput.trim(), completed: false }]);
    setTextInput('');
  }
  function toggleHandle(id: number) {
    setTodoList(
      todoList.map((todo) => (todo.id == id ? { ...todo, completed: !todo.completed } : todo))
    );
  }
  function deleteHandle(id: number) {
    setTodoList(todoList.filter((todo) => todo.id != id));
  }
  return (
    <div>
      <h1 className="text-lg text-red-500">TodoList</h1>
      <div className="flex">
        <input
          type="text"
          className="w-1/2 px-4 py-2 border border-gray-400 rounded-md focus:outline-none transition focus:border-sky-400"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="请输入待办事项"
        />
        <button onClick={() => addHandle()}>Add</button>
      </div>
      <ul>
        {todoList.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleHandle(todo.id)}
            onDelete={() => deleteHandle(todo.id)}
          />
        ))}
      </ul>
    </div>
  );
}
