import type { TodoItemProps } from './todolist.types';

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="flex justify-between">
      <span onClick={() => onToggle(todo.id)} className="cursor-pointer">
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)} className="hover:bg-sky-300 hover:text-white">
        Delete
      </button>
    </li>
  );
}
