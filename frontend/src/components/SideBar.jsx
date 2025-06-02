import { useState, useEffect } from 'react';
import {
  LINK_CLASSES,
  menuItems,
  PRODUCTIVITY_CARD,
  SIDEBAR_CLASSES,
  TIP_CARD,
} from '../assets/dummy';
import { Lightbulb, Menu, Sparkles, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const SideBar = ({ user, tasks }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileOpen]);

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.completed).length || 0;
  const productivity =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const username = user?.name || 'User';
  const initial = username.charAt(0).toUpperCase();

  const renderMenuItems = (isMobile = false) => (
    <ul className="space-y-2">
      {menuItems.map(({ text, path, icon }) => (
        <li key={text}>
          <NavLink
            to={path}
            className={({ isActive }) =>
              [
                LINK_CLASSES.base,
                isActive ? LINK_CLASSES.active : LINK_CLASSES.inactive,
                isMobile ? 'justify-center' : 'lg:justify-start',
              ].join(' ')
            }
            onClick={() => setMobileOpen(false)}
          >
            <span className={LINK_CLASSES.icon}>{icon}</span>
            <span
              className={`${isMobile ? 'block' : 'hidden lg:block'} ${
                LINK_CLASSES.text
              }`}
            >
              {text}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={SIDEBAR_CLASSES.desktop + ' sticky top-0 h-screen z-40'}>
        <div className="p-5 border-b border-purple-100 lg:block hidden">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-700">
              {initial}
            </div>
            <div>
              <h2 className="text-purple-900 font-semibold text-lg">
                Hey, {username}
              </h2>
              <p className="text-sm text-purple-500 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Let's Crush Today!
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          {/* Productivity Card */}
          <div className={PRODUCTIVITY_CARD.container}>
            <div className={PRODUCTIVITY_CARD.header}>
              <h3 className={PRODUCTIVITY_CARD.label}>Productivity</h3>
              <span className={PRODUCTIVITY_CARD.badge}>{productivity}%</span>
            </div>
            <div className={PRODUCTIVITY_CARD.barBg}>
              <div
                className={PRODUCTIVITY_CARD.barFg}
                style={{ width: `${productivity}%` }}
              />
            </div>
          </div>

          {/* Menu */}
          {renderMenuItems()}

          {/* Tip Card */}
          <div className="mt-auto pt-6 lg:block hidden">
            <div className={TIP_CARD.container}>
              <div className="flex items-center gap-2">
                <div className={TIP_CARD.iconWrapper}>
                  <Lightbulb className="w-5 h-5 text-purple-500" />
                </div>
                <p className={TIP_CARD.text}>
                  <span className={TIP_CARD.highlight}>Tip:</span> Keep your
                  tasks short and to the point.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      {!mobileOpen && (
        <button
          className={SIDEBAR_CLASSES.mobileButton}
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className={SIDEBAR_CLASSES.mobileDrawerBackdrop}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={SIDEBAR_CLASSES.mobileDrawer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-purple-100 mb-4">
              <h2 className="text-lg font-bold text-purple-600">Menu</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-md hover:bg-purple-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-700">
                {initial}
              </div>
              <div>
                <h2 className="text-purple-900 font-semibold text-lg">
                  Hey, {username}
                </h2>
                <p className="text-sm text-purple-500 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Let's Crush Today!
                </p>
              </div>
            </div>

            {/* Productivity & Menu */}
            <div className="space-y-6">
              <div className={PRODUCTIVITY_CARD.container}>
                <div className={PRODUCTIVITY_CARD.header}>
                  <h3 className={PRODUCTIVITY_CARD.label}>Productivity</h3>
                  <span className={PRODUCTIVITY_CARD.badge}>
                    {productivity}%
                  </span>
                </div>
                <div className={PRODUCTIVITY_CARD.barBg}>
                  <div
                    className={PRODUCTIVITY_CARD.barFg}
                    style={{ width: `${productivity}%` }}
                  />
                </div>
              </div>
              {renderMenuItems(true)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
