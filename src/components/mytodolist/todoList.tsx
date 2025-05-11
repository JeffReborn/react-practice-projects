import { useEffect, useRef, useState } from 'react';
import type { Todo } from './types';
import TodoItem from './todoItem';
import Filter from './filter';

let idCount = 0;
export default function MyTodoList() {
  const [todolist, setTodoList] = useState<Todo[]>([]);
  const [textInput, setTextInput] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    // 这里可以进行一些初始化操作，比如从后端获取数据
    didInit.current = true;
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos);
        if (Array.isArray(parsedTodos)) {
          setTodoList(parsedTodos);
          idCount = parsedTodos.length;
        }
      } catch (error) {
        console.error('Failed to parse todos from localStorage', error);
      }
    }
  }, []);
  function handleAdd() {
    if (textInput.trim() === '') return;
    setTodoList([...todolist, { id: ++idCount, text: textInput.trim(), completed: false }]);
    localStorage.setItem(
      'todos',
      JSON.stringify([...todolist, { id: ++idCount, text: textInput.trim(), completed: false }])
    );
    setTextInput('');
  }
  function handleComplete(id: number) {
    setTodoList(
      todolist.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
    localStorage.setItem(
      'todos',
      JSON.stringify(
        todolist.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
      )
    );
  }
  function handleDelete(id: number) {
    setTodoList(todolist.filter((todo) => todo.id !== id));
    localStorage.setItem('todos', JSON.stringify(todolist.filter((todo) => todo.id !== id)));
  }
  function handleFilter(filter: string) {
    // filter: all, completed, unCompleted
    setCurrentFilter(filter);
  }
  const displayTodoList = todolist.filter((todo) => {
    if (currentFilter === 'completed') return todo.completed;
    if (currentFilter === 'unCompleted') return !todo.completed;
    return true;
  });
  return (
    <div>
      <h1>My Todo List</h1>
      <div>
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="w-1/2 px-4 py-2 border border-gray-400 rounded-md focus:outline-none transition focus:border-sky-400"
          placeholder="请输入待办事项"
        />
        <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleAdd}>
          Add
        </button>
      </div>
      <ul>
        {displayTodoList.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleComplete={handleComplete}
            onDelete={handleDelete}
          />
        ))}
      </ul>
      <Filter currentFilter={currentFilter} onToggleFilter={handleFilter} />
    </div>
  );
}
