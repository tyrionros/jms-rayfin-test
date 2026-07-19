import { useCallback, useEffect, useState } from 'react';

import { ActionMenu } from '@/components/ActionMenu';
import { FeedbackModal } from '@/components/FeedbackModal';
import { useAuth } from '@/hooks/AuthContext';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  type TodoItem,
} from '@/services/todos';

export function HomePage({ onNavigate }: { onNavigate?: (pageId: string) => void }) {
  const { user } = useAuth();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const fetchTodos = useCallback(async () => {
    const data = await getTodos();
    setTodos(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTodoTitle.trim();
    if (!title) return;
    setNewTodoTitle('');
    await createTodo(title);
    await fetchTodos();
  };

  const handleToggle = async (id: string, isCompleted: boolean) => {
    await updateTodo(id, { isCompleted: !isCompleted });
    await fetchTodos();
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
    await fetchTodos();
  };

  const pending = todos.filter((t) => !t.isCompleted);
  const completed = todos.filter((t) => t.isCompleted);
  const progress = todos.length
    ? Math.round((completed.length / todos.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#021838]">
      {/* ── Header: deep navy bar, cream text ── */}
      <header className="sticky top-0 z-40 border-b border-[#DDD4C0] bg-[#021838] shadow-md">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C4D2F] text-[#FAF8F2]">
              <Hemy360Icon className="h-4 w-4" />
            </span>
            <span className="text-base font-semibold tracking-tight text-[#FAF8F2]" title="Hemy 360 - test by JMS">
              Hemy 360
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#C4956A] transition-colors hover:bg-[#0D2E5C] hover:text-[#FAF8F2]"
              title="Send feedback"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </button>
            <ActionMenu
              title="My Action"
              items={[
                { label: 'My Action', onClick: () => onNavigate?.('myaction') },
                { label: 'My Activity', onClick: () => console.log('Activity') },
                { label: 'Oh My My', onClick: () => console.log('Oh My') },
              ]}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-8 py-10">
        {/* ── Page heading ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#021838]">Your tasks</h1>
          <p className="mt-1 text-sm text-[#7C4D2F]">
            {todos.length === 0
              ? 'Add your first task to get started.'
              : `${completed.length} of ${todos.length} done`}
          </p>
          {todos.length > 0 && (
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#DDD4C0]">
              <div
                className="h-full rounded-full bg-[#7C4D2F] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* ── Add task form ── */}
        <form
          onSubmit={(e) => void handleAddTodo(e)}
          className="mb-8 flex gap-2.5"
        >
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 rounded-xl border border-[#DDD4C0] bg-white px-4 py-2.5 text-sm text-[#021838] placeholder-[#C4956A] shadow-sm transition-colors focus:border-[#021838] focus:outline-none focus:ring-2 focus:ring-[#021838]/20"
          />
          <button
            type="submit"
            disabled={!newTodoTitle.trim()}
            className="rounded-xl bg-[#021838] px-5 py-2.5 text-sm font-semibold text-[#FAF8F2] shadow-sm transition-colors hover:bg-[#0D2E5C] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add
          </button>
        </form>

        {/* ── Todo list ── */}
        {loading ? (
          <div className="space-y-2.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[58px] animate-pulse rounded-xl border border-[#DDD4C0] bg-[#F0EAD8]"
              />
            ))}
          </div>
        ) : todos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {pending.length > 0 && (
              <TodoSection
                label="To do"
                count={pending.length}
                todos={pending}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            )}
            {completed.length > 0 && (
              <TodoSection
                label="Completed"
                count={completed.length}
                todos={completed}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            )}
          </div>
        )}
      </main>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        userEmail={user?.email}
        currentPageName="Hemy 360 - test by JMS"
      />
    </div>
  );
}

type RowHandlers = {
  onToggle: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
};

function TodoSection({
  label,
  count,
  todos,
  onToggle,
  onDelete,
}: RowHandlers & { label: string; count: number; todos: TodoItem[] }) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7C4D2F]">
        {label}
        <span className="rounded-full bg-[#F0EAD8] px-2 py-0.5 text-[11px] font-semibold text-[#7C4D2F]">
          {count}
        </span>
      </h2>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoRow
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  );
}

function TodoRow({
  todo,
  onToggle,
  onDelete,
}: RowHandlers & { todo: TodoItem }) {
  return (
    <li className="group flex items-center gap-3 rounded-xl border border-[#DDD4C0] bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md">
      <button
        onClick={() => onToggle(todo.id, todo.isCompleted)}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          todo.isCompleted
            ? 'border-[#7C4D2F] bg-[#7C4D2F] text-[#FAF8F2]'
            : 'border-[#DDD4C0] hover:border-[#7C4D2F]'
        }`}
        aria-label={todo.isCompleted ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.isCompleted && <CheckIcon className="h-3 w-3" strokeWidth={3} />}
      </button>
      <span
        className={`flex-1 text-sm ${
          todo.isCompleted ? 'text-[#C4956A] line-through' : 'text-[#021838]'
        }`}
      >
        {todo.title}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="rounded-md p-1 text-[#DDD4C0] opacity-0 transition-all hover:bg-red-50 hover:text-red-500 focus:opacity-100 group-hover:opacity-100"
        aria-label="Delete todo"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DDD4C0] bg-[#F0EAD8]/40 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#021838]/10 text-[#021838]">
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>
      <p className="mt-4 text-sm font-medium text-[#021838]">
        Nothing here yet
      </p>
      <p className="mt-1 text-sm text-[#C4956A]">
        Add your first task above to get started.
      </p>
    </div>
  );
}

function Hemy360Icon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      {/* Letter H */}
      <text
        x="12"
        y="16"
        fontSize="14"
        fontWeight="bold"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="sans-serif"
      >
        H
      </text>
      {/* Circular arrow 360 degrees - arc with arrowhead */}
      <path
        d="M 12 3 A 9 9 0 0 1 21 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Arrowhead */}
      <path d="M 21 12 L 19.5 10.5 L 20.5 11.5" fill="currentColor" />
    </svg>
  );
}

function CheckIcon({
  className,
  strokeWidth = 2.5,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
