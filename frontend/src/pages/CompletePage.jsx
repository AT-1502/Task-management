import React,{useState,useMemo} from 'react'
import { useOutletContext } from 'react-router-dom'
import { CT_CLASSES,SORT_OPTIONS } from '../assets/dummy'
import { CheckCircle, CheckCircle2, Filter } from 'lucide-react';
import TaskItem from '../components/TaskItem';

const CompletePage = () => {

  const { tasks , refreshTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState('newest');

  const sortedCompletedTasks = useMemo (() => {
    return tasks
    .filter(task=>[true,1,'yes'].includes(
      typeof task.completed === 'string' ? task.completed.toLowerCase() : task.completed
    ))
      .sort((a, b) => {
        switch(sortBy){
          case'newest':
           return new Date(b.createAt) - new Date(a.createAt)
           case 'oldest':
            return new Date(a.createAt) - new Date(b.createAt)
             case 'priority':{
             const order = { high: 3, medium: 2, low: 1 };
              return order[b.priority?.toLowerCase()] - order[a.priority?.toLowerCase()]
        } 
        default:
          return 0; 
      }
      
  })
  }
  , [tasks, sortBy]);
  
  return (
    <div className={CT_CLASSES.page}>
      {/* {Header} */}
      <div className={CT_CLASSES.header}>
        <div className={CT_CLASSES.titleWrapper}>
          <h1 className={CT_CLASSES.title}>
            <CheckCircle2 className='text-green-500 w-5 h-5 md:w-6 md:h-6' />
            <span className='truncate'>Completed Tasks</span>
            </h1>
            <p className={CT_CLASSES.subtitle}>
              {sortedCompletedTasks.length} task{sortedCompletedTasks.length !== 1 && 's'} marked as complete
              </p>
              </div>

              {/* {sort controls} */}
              <div className={CT_CLASSES.sortContainer}>
                <div className={CT_CLASSES.sortBox}>
                  <div className={CT_CLASSES.filterLabel}>
                    <Filter className='w-5 h-5 text-gray-500' />
                    <span className='text-sm'>Sort by:</span>
                  </div>

                  {/* {mobile dropdown} */}
                  <select
                    className={CT_CLASSES.select}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                        {option.id === 'newest'? 'first':""}
                      </option>
                    ))}
                  </select>

                  {/* {desktop button} */}

                  <div className={CT_CLASSES.btnGroup}>
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        className={[CT_CLASSES.btnBase, sortBy === opt.id ? CT_CLASSES.btnActive : CT_CLASSES.btnInactive].join(" ")}
                        onClick={() => setSortBy(opt.id)}
                      >
                        {opt.icon} {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
        </div>

      {/* {Tasks List} */}
      <div className={CT_CLASSES.list}>
        {sortedCompletedTasks.length === 0 ? (
        <div className={CT_CLASSES.emptyState}>
          <div className={CT_CLASSES.emptyIconWrapper}>
            <CheckCircle2 className='w-12 h-12 text-green-500' />
          </div>
          <h2 className={CT_CLASSES.emptyTitle}>No completed tasks found.</h2>
          <p className={CT_CLASSES.emptyText}>
            All your completed tasks will appear here.
          </p>
    </div>
  ):(
    sortedCompletedTasks.map((task) => (
      <TaskItem key={task._id || task.id} task={task} onRefresh={refreshTasks} showCompleteCheckbox={false} className='opacity-90 hover:opacity-100 transition-opacity text-sm md:text-base'  />
    ))
  )}
      </div>
    </div>
  )
}

export default CompletePage