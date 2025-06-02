import React, { useCallback, useState, useEffect, useMemo } from 'react';
import Navbar from './Navbar';
import SideBar from './SideBar';
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import { Circle, Clock, TrendingUp, Zap } from 'lucide-react';

const Layout = ({ onLogOut, user }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const { data } = await axios.get('http://localhost:3000/api/tasks/gp', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const arr = Array.isArray(data) ? data :
                Array.isArray(data.tasks) ? data.tasks :
                    Array.isArray(data.data) ? data.data : [];
            setTasks(arr);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError(err.message || 'Failed to fetch tasks');
            if (err.response && err.response.status === 401) onLogOut();
        } finally {
            setLoading(false);
        }
    }, [onLogOut]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const stats = useMemo(() => {
        const completedTasks = tasks.filter(t =>
            t.completed === true ||
            t.completed === 1 ||
            (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
        ).length;

        const totalCount = tasks.length;
        const pendingCount = totalCount - completedTasks;
        const completionPercentage = totalCount ? Math.round((completedTasks / totalCount) * 100) : 0;

        return {
            totalCount,
            completedCount: completedTasks,
            pendingCount,
            completionPercentage
        };
    }, [tasks]);

    const Statcard = ({ title, value, icon }) => (
        <div className='p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-400 to-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-300 group'>
            <div className='flex items-center gap-3'>
                <div className='p-2 rounded-full bg-white text-blue-600 group-hover:bg-blue-200 transition-colors duration-300'>
                    {icon}
                </div>
                <div>
                    <p className='text-xl font-bold text-white'>{value}</p>
                    <p className='text-sm text-gray-200'>{title}</p>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='animate-spin rounded-full h-20 w-20 border-b-4 border-blue-500'></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen space-y-4 text-center px-4'>
                <div className='text-red-500 text-lg animate-bounce'>{error}</div>
                <button
                    onClick={fetchTasks}
                    className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300'
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col gap-2">
            {/* Sticky Navbar */}
            <header className="sticky top-0 z-50 bg-white shadow-md w-full">
                <Navbar user={user} onLogOut={onLogOut} />
            </header>

            <div className="flex flex-col lg:flex-row gap-2 px-2 md:px-4">
                {/* Sidebar (responsive) */}
                <aside className="hidden md:block w-full md:w-64">
                    <SideBar user={user} tasks={tasks} />
                </aside>

                {/* Main content */}
                <main className="flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 space-y-4">
                            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
                        </div>

                        <div className="lg:col-span-1 space-y-4">
                            {/* Stats Card */}
                            <div className='bg-white rounded-xl p-4 shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-300 hover:border-blue-200'>
                                <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                                    <TrendingUp className='w-5 text-blue-200' />
                                    Task Statistics
                                </h3>
                                <div className='grid grid-cols-2 gap-3'>
                                    <Statcard
                                        title="Total Tasks"
                                        value={stats.totalCount}
                                        icon={<Circle className='w-5 h-5 text-blue-200' />}
                                    />
                                    <Statcard
                                        title="Completed"
                                        value={stats.completedCount}
                                        icon={<Circle className='w-5 h-5 text-green-200' />}
                                    />
                                    <Statcard
                                        title="Pending"
                                        value={stats.pendingCount}
                                        icon={<Circle className='w-5 h-5 text-purple-200' />}
                                    />
                                    <Statcard
                                        title="Completion Rate"
                                        value={`${stats.completionPercentage}%`}
                                        icon={<Zap className='w-5 h-5 text-blue-200' />}
                                    />
                                </div>

                                {/* Progress Bar */}
                                <hr className='my-4 border-gray-200' />
                                <div className='space-y-2'>
                                    <div className='flex items-center justify-between text-gray-600 text-sm'>
                                        <span className='flex items-center gap-1'>
                                            <Circle className='w-3 h-3 text-blue-200' />
                                            Progress
                                        </span>
                                        <span>{stats.completedCount} / {stats.totalCount}</span>
                                    </div>
                                    <div className='relative pt-1'>
                                        <div className='w-full h-2 bg-blue-200 rounded-full overflow-hidden'>
                                            <div className='h-full bg-blue-500 transition-all duration-300' style={{ width: `${stats.completionPercentage}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className='bg-white rounded-xl p-4 shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-300 hover:border-blue-200'>
                                <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                                    <Clock className='w-5 h-5 text-blue-200' />
                                    Recent Activity
                                </h3>
                                <div className='space-y-3'>
                                    {tasks.slice(0, 3).map((task) => (
                                        <div key={task._id || task.id} className='flex items-center justify-between text-gray-600 text-sm'>
                                            <div className='flex flex-col sm:flex-row sm:items-center sm:gap-2'>
                                                <span className='font-medium'>{task.title}</span>
                                                <span>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "No date"}</span>
                                            </div>
                                            <span className={`${task.completed ? 'text-green-500' : 'text-red-500'}`}>
                                                {task.completed ? 'Completed' : 'Pending'}
                                            </span>
                                        </div>
                                    ))}
                                    {tasks.length === 0 && (
                                        <div className='text-center py-6 px-2'>
                                            <Clock className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                                            <p className='text-gray-500'>No recent activity</p>
                                            <p className='text-xs text-gray-400'>Tasks will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
