'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";

/**
 * タスクの型定義
 */
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

/**
 * GlimmerTasksのメインコンポーネント
 * タスクの一覧表示、追加、削除、完了状態の切り替えを管理します
 */
export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  /**
   * タスク一覧を取得します
   */
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/tasks');
      if (!response.ok) throw new Error('タスクの取得に失敗しました');
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('タスクの取得中にエラーが発生しました');
      console.error(err);
    }
  };

  /**
   * 新しいタスクを追加します
   */
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle })
      });
      if (!response.ok) throw new Error('タスクの追加に失敗しました');
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setError(null);
    } catch (err) {
      setError('タスクの追加中にエラーが発生しました');
      console.error(err);
    }
  };

  /**
   * タスクの完了状態を切り替えます
   */
  const toggleTask = async (taskId: number, completed: boolean) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      if (!response.ok) throw new Error('タスクの更新に失敗しました');
      await fetchTasks();
      setError(null);
    } catch (err) {
      setError('タスクの更新中にエラーが発生しました');
      console.error(err);
    }
  };

  /**
   * タスクを削除します
   */
  const deleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('タスクの削除に失敗しました');
      setTasks(tasks.filter(task => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError('タスクの削除中にエラーが発生しました');
      console.error(err);
    }
  };

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <main className="min-h-screen p-8 relative overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="glass-container rounded-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            GlimmerTasks
          </h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg text-white">
              {error}
            </div>
          )}

          <form onSubmit={addTask} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="新しいタスクを入力..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-white/30 transition-all duration-300"
              />
              <button
                type="submit"
                className="gradient-button px-6 py-3 rounded-xl text-white font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newTaskTitle.trim()}
              >
                追加
              </button>
            </div>
          </form>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-white/90 mb-4 flex items-center">
                <span className="mr-2">📝</span> 未完了のタスク
              </h2>
              <div className="space-y-3">
                {incompleteTasks.map(task => (
                  <div key={task.id} className="glass-card rounded-xl p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id, task.completed)}
                        className="checkbox-custom"
                      />
                      <span className="text-white/90 font-medium">{task.title}</span>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-white/40 hover:text-white/90 transition-colors duration-200 opacity-0 group-hover:opacity-100 p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {incompleteTasks.length === 0 && (
                  <div className="text-white/50 text-center py-4">
                    未完了のタスクはありません
                  </div>
                )}
              </div>
            </section>

            {completedTasks.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-white/90 mb-4 flex items-center">
                  <span className="mr-2">✨</span> 完了したタスク
                </h2>
                <div className="space-y-3">
                  {completedTasks.map(task => (
                    <div key={task.id} className="glass-card rounded-xl p-4 flex items-center justify-between group opacity-60 hover:opacity-80 transition-opacity duration-200">
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id, task.completed)}
                          className="checkbox-custom"
                        />
                        <span className="text-white/90 line-through">{task.title}</span>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-white/40 hover:text-white/90 transition-colors duration-200 opacity-0 group-hover:opacity-100 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* 装飾的な背景要素 */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
    </main>
  );
}
