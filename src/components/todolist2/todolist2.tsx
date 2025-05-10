import { useState } from 'react';
import type { Todo } from './types';
import TodoListItem2 from './todolistItem';
let idCount = 0;
export default function TodoList2() {
  const [input, setInput] = useState('');
  const [todoList, setTodoList] = useState<Todo[]>([]);
  function handleValue(value: string) {
    setInput(value);
  }
  function handleAdd() {
    setTodoList([...todoList, { id: ++idCount, text: input, completed: false }]);
    setInput('');
  }
  function handleComplete(id: number) {
    setTodoList(
      todoList.map((item) => {
        if (item.id === id) {
          item.completed = true;
        }
        return item;
      })
    );
  }
  function handleDelete(id: number) {
    setTodoList(todoList.filter((item) => item.id !== id));
  }
  return (
    <div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => handleValue(e.target.value)}
          placeholder="请输入"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      <ul>
        {todoList.map((item) => (
          <TodoListItem2
            key={item.id}
            todo={item}
            onToggleComplete={() => handleComplete(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </ul>
    </div>
  );
}
