import type { TodoItemProps } from './types';

export default function TodoItem({ todo, onToggleComplete, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center justify-between border-b py-2">
      {/* 左侧：checkbox + 文本 */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id)}
          className="w-4 h-4 accent-blue-500"
        />
        <p className={todo.completed ? 'line-through text-gray-400' : ''}>{todo.text}</p>
      </div>

      {/* 右侧：删除按钮 */}
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-700 font-medium"
      >
        Delete
      </button>
    </li>
  );
}
