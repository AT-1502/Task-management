import React, { useEffect, useState } from 'react';
import {
  getPriorityBadgeColor,
  getPriorityColor,
  MENU_OPTIONS,
  TI_CLASSES,
} from '../assets/dummy';
import { Calendar, CheckCircle2, Clock, MoreVertical } from 'lucide-react';
import axios from 'axios';
import { isToday, format } from 'date-fns';
import TaskModal from './TaskModal';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://localhost:3000/api/tasks';

const parseCompleted = (val) =>
  [true, 1, 'yes'].includes(typeof val === 'string' ? val.toLowerCase() : val);

const TaskItem = ({ task, onRefresh, onLogout, showCompleteCheckbox = true }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isCompleted, setIsCompleted] = useState(parseCompleted(task.completed));
  const [showEditModal, setShowEditModal] = useState(false);
  const [subtasks] = useState(task.subtasks || []);

  useEffect(() => {
    setIsCompleted(parseCompleted(task.completed));
  }, [task.completed]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found in localStorage');
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const borderColor = isCompleted
    ? 'border-green-500'
    : getPriorityColor(task.priority).split(' ')[0];

  const handleComplete = async () => {
    const newStatus = !isCompleted ? 'no' : 'yes';
    try {
      await axios.put(
        `${API_BASE}/${task._id}/gp`,
        { completed: newStatus },
        { headers: getAuthHeaders() }
      );
      setIsCompleted(!isCompleted);
      onRefresh?.();
    } catch (error) {
      console.error('Error updating task completion:', error);
      if (error.response?.status === 401) onLogout?.();
    }
  };

  const handleAction = async (action) => {
    setShowMenu(false);
    if (action === 'edit') setShowEditModal(true);
    else if (action === 'delete') handleDelete();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/${task._id}/gp`, { headers: getAuthHeaders() });
      onRefresh?.();
    } catch (error) {
      console.error('Error deleting task:', error);
      onLogout?.();
    }
  };

  const handleSave = async (updatedTask) => {
    try {
      const payload = (({ title, description, priority, dueDate, completed }) => ({
        title,
        description,
        priority,
        dueDate,
        completed,
      }))(updatedTask);
      await axios.put(`${API_BASE}/${task._id}/gp`, payload, {
        headers: getAuthHeaders(),
      });
      setShowEditModal(false);
      onRefresh?.();
    } catch (error) {
      console.error('Error updating task:', error);
      if (error.response?.status === 401) onLogout?.();
    }
  };

  return (
    <>
      <motion.div
        className={`${TI_CLASSES.wrapper} ${borderColor} transition-shadow border-2 rounded-2xl p-4 bg-gradient-to-br from-white to-purple-50 hover:shadow-xl`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <div className={TI_CLASSES.leftContainer}>
          {showCompleteCheckbox && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleComplete}
              className={`${TI_CLASSES.completeBtn} ${
                isCompleted ? 'bg-green-500' : 'bg-gray-200'
              }`}
            >
              <CheckCircle2
                size={18}
                className={`${TI_CLASSES.checkboxIconBase} ${
                  isCompleted ? 'text-green-200' : ''
                }`}
              />
            </motion.button>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <h3
                className={`${TI_CLASSES.titleBase} ${
                  isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'
                }`}
              >
                {task.title}
              </h3>
              <span
                className={`${TI_CLASSES.priorityBadge} ${getPriorityBadgeColor(task.priority)}`}
              >
                {task.priority}
              </span>
            </div>
            {task.description && (
              <p className={`${TI_CLASSES.description} text-sm text-gray-700`}>
                {task.description}
              </p>
            )}
          </div>
        </div>
        <div className={TI_CLASSES.rightContainer}>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className={TI_CLASSES.menuButton}>
              <MoreVertical className="w-4 h-4 text-gray-500 sm:h-5" />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  className={TI_CLASSES.menuDropdown}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {MENU_OPTIONS.map((opt) => (
                    <button
                      key={opt.action}
                      onClick={() => handleAction(opt.action)}
                      className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-purple-100 flex items-center gap-2 transition-colors duration-200"
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className={`${TI_CLASSES.dateRow} ${
              task.dueDate && isToday(new Date(task.dueDate)) ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            <Calendar className="w-4 h-4" />
            {task.dueDate
              ? isToday(new Date(task.dueDate))
                ? 'Today'
                : format(new Date(task.dueDate), 'MMM dd')
              : '-'}
          </div>

          <div className={TI_CLASSES.createdRow}>
            <Clock className="w-4 h-4" />
            {task.createdAt
              ? `Created ${format(new Date(task.createdAt), 'MMM dd')}`
              : 'No date'}
          </div>
        </div>
      </motion.div>

      <TaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        taskToEdit={task}
        onSave={handleSave}
      />
    </>
  );
};

export default TaskItem;
