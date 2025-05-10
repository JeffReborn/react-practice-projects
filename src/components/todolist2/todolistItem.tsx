import type { TodoItemProps } from './types';

export default function TodoListItem2({ todo, onToggleComplete, onDelete }: TodoItemProps) {
  return (
    <li>
      <span
        onClick={() => onToggleComplete(todo.id)}
        className={`cursor-pointer ${todo.completed ? 'text-red-500' : ''}`}
      >
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}
