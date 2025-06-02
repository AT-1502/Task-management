import React, { useEffect, useMemo, useState } from 'react';
import { layoutClasses, SORT_OPTIONS } from '../assets/dummy';
import { Clock, ListCheck, Filter, Plus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://localhost:3000/api/tasks';

const Pending = () => {
  const { tasks = [], refreshTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sortedPendingTasks = useMemo(() => {
    const filtered = tasks.filter(
      (task) => !task.completed || (typeof task.completed === 'string' && task.completed.toLowerCase() !== 'yes')
    );
    return filtered.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      const order = { high: 3, medium: 2, low: 1 };
      return order[b.priority.toLowerCase()] - order[a.priority.toLowerCase()];
    });
  }, [tasks, sortBy]);

  return (
    <motion.div className={layoutClasses.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={layoutClasses.headerWrapper}>
        <div>
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <ListCheck className="text-purple-600 w-6 h-6 md:w-8 md:h-8" /> Pending Tasks
          </motion.h1>
          <p className="text-sm text-gray-500 mt-1 ml-7">
            {sortedPendingTasks.length} task{sortedPendingTasks.length !== 1 && 's'} need your attention
          </p>
        </div>

        <div className={layoutClasses.sortBox}>
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm">Sort by:</span>
          </div>
          <select
            className="bg-white border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
          </select>

          <div className={layoutClasses.tabWrapper}>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out ${
                  sortBy === opt.id ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-purple-100'
                }`}
                onClick={() => setSortBy(opt.id)}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        className={layoutClasses.addBox}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-center justify-center gap-3 text-gray-500 group-hover:text-purple-600 transition-colors duration-200">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5 text-purple-600 group-hover:text-purple-800 transition-colors duration-200" />
          </div>
          <span className="text-sm font-medium">Add New Task</span>
        </div>
      </motion.div>

      <div className="space-y-4 mt-4">
        {sortedPendingTasks.length === 0 ? (
          <motion.div
            className="text-center p-6 bg-white shadow-md rounded-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Clock className="w-6 h-6 text-purple-600 mb-2 mx-auto" />
            <h2 className="text-lg font-semibold text-gray-800">All Caught Up!</h2>
            <p className="text-sm text-gray-600">You have no pending tasks at the moment.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
            >
              Add New Task
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  delayChildren: 0.1,
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {sortedPendingTasks.map((task) => (
              <motion.div key={task._id || task.id} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                <TaskItem
                  task={task}
                  showCompleteCheckbox
                  onEdit={() => {
                    setSelectedTask(task);
                    setShowModal(true);
                  }}
                  onRefresh={refreshTasks}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <TaskModal
        isOpen={!!selectedTask || showModal}
        onClose={() => {
          setSelectedTask(null);
          setShowModal(false);
          refreshTasks();
        }}
        taskToEdit={selectedTask}
      />
    </motion.div>
  );
};

export default Pending;