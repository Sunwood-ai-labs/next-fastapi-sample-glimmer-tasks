'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch('http://localhost:8000/api/tasks');
    const data = await response.json();
    setTasks(data);
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const response = await fetch('http://localhost:8000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTaskTitle })
    });
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const toggleTask = async (taskId: number, completed: boolean) => {
    await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    });
    fetchTasks();
  };

  const deleteTask = async (taskId: number) => {
    await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
      method: 'DELETE'
    });
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="glass-container rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">GlimmerTasks</h1>
          
          <form onSubmit={addTask} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="新しいタスクを入力..."
                className="flex-1 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors"
              >
                追加
              </button>
            </div>
          </form>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">未完了のタスク</h2>
              <div className="space-y-3">
                {incompleteTasks.map(task => (
                  <div key={task.id} className="glass-card rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id, task.completed)}
                        className="w-5 h-5 rounded border-white/30"
                      />
                      <span className="text-white">{task.title}</span>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-white/70 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {completedTasks.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">完了したタスク</h2>
                <div className="space-y-3">
                  {completedTasks.map(task => (
                    <div key={task.id} className="glass-card rounded-lg p-4 flex items-center justify-between opacity-70">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id, task.completed)}
                          className="w-5 h-5 rounded border-white/30"
                        />
                        <span className="text-white line-through">{task.title}</span>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-white/70 hover:text-white"
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
    </main>
  );
}
