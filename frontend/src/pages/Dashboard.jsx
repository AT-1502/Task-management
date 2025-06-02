import React, { useState, useMemo, useCallback } from 'react';
import {
  EMPTY_STATE,
  FILTER_LABELS,
  FILTER_OPTIONS,
  HEADER,
  ICON_WRAPPER,
  LABEL_CLASS,
  STAT_CARD,
  STATS,
  STATS_GRID,
  VALUE_CLASS,
  WRAPPER,
} from '../assets/dummy';
import { Filter, HomeIcon, Plus, CalendarIcon } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import TaskItem from '../components/TaskItem';
import axios from 'axios';
import TaskModal from '../components/TaskModal';
import { motion } from 'framer-motion';

const API_Base = 'http://localhost:3000/api/tasks';

const SORT_OPTIONS = ['dueDateAsc', 'dueDateDesc', 'priority'];

const Dashboard = () => {
  const { tasks, refreshTasks } = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('dueDateAsc');

  const stats = useMemo(() => ({
    total: tasks.length,
    lowPriority: tasks.filter((t) => t.priority?.toLowerCase() === 'low').length,
    mediumPriority: tasks.filter((t) => t.priority?.toLowerCase() === 'medium').length,
    highPriority: tasks.filter((t) => t.priority?.toLowerCase() === 'high').length,
    completed: tasks.filter((t) =>
      t.completed === true ||
      t.completed === 1 ||
      (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
    ).length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    if (filter === 'today') {
      filtered = filtered.filter(task => new Date(task.dueDate).toDateString() === today.toDateString());
    } else if (filter === 'week') {
      filtered = filtered.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= nextWeek;
      });
    } else if (['low', 'medium', 'high'].includes(filter)) {
      filtered = filtered.filter(task => task.priority?.toLowerCase() === filter);
    }

    if (sort === 'dueDateAsc') {
      filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sort === 'dueDateDesc') {
      filtered.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    } else if (sort === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      filtered.sort((a, b) => priorityOrder[a.priority?.toLowerCase()] - priorityOrder[b.priority?.toLowerCase()]);
    }

    return filtered;
  }, [tasks, filter, sort]);

  const handleTaskSave = useCallback(
    async (taskData) => {
      try {
        if (taskData.id) {
          await axios.put(`${API_Base}/${taskData.id}/gp`, taskData);
        }
        refreshTasks();
        setShowModal(false);
        setSelectedTask(null);
      } catch (error) {
        console.error('Error saving task:', error);
      }
    },
    [refreshTasks]
  );

  return (
    <div className={`${WRAPPER} bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 min-h-screen py-6`}>
      {/* Header */}
      <motion.div
        className={`${HEADER} flex justify-between items-center`}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <HomeIcon className="w-6 h-6 text-indigo-500" />
            Task Overview
          </h1>
          <p className="text-sm text-gray-500">Manage your tasks efficiently</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-purple-600 transition shadow-lg flex items-center gap-2"
        >
          <Plus size={16} /> Add Task
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        className={`${STATS_GRID} my-6`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {STATS.map(({ key, label, icon: Icon, iconColor, borderColor = 'border-blue-500', valueKey, textColor }) => (
          <motion.div
            key={key}
            className={`${STAT_CARD} ${borderColor} bg-white shadow-md hover:shadow-lg transition-shadow`}
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex  items-center gap-3">
              <div className={`${ICON_WRAPPER} ${iconColor}`}>
                <Icon className="w-6 h-6 md:w-4 md:h-4" />
              </div>
              <div>
                <p className={`${VALUE_CLASS} ${textColor}`}>
                  {stats[valueKey]}
                </p>

                <p className={LABEL_CLASS}>{label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter + Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 items-center flex-wrap">
          <Filter className="w-5 h-5 text-gray-500" />
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${filter === opt
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {FILTER_LABELS[opt] || opt}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="dueDateAsc">Sort by Due Date (Asc)</option>
          <option value="dueDateDesc">Sort by Due Date (Desc)</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      {/* Tasks */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {filteredTasks.length === 0 ? (
          <div className={EMPTY_STATE.wrapper}>
            <div className={EMPTY_STATE.iconWrapper}>
              <CalendarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Tasks Found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {filter === 'all' ? 'Create your first task' : 'No tasks match the selected filter.'}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-purple-600 transition shadow-lg"
            >
              Add Task
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox
              onEdit={() => {
                setSelectedTask(task);
                setShowModal(true);
              }}
            />
          ))
        )}
      </motion.div>

      {/* Add New Task shortcut (desktop only) */}
      <div
        onClick={() => setShowModal(true)}
        className="hidden md:flex items-center justify-center p-4 border-2 border-dashed border-blue-500 rounded-md hover:bg-blue-600 transition cursor-pointer text-gray-400 mt-6"
      >
        <Plus className="w-6 h-6 mr-2" />
        <span className="font-medium">Add New Task</span>
      </div>

      {/* Modal */}
      <TaskModal
        isOpen={showModal || !!selectedTask}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  );
};

export default Dashboard;
