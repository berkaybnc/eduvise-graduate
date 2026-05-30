
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, BookOpen, PieChart, Settings, HelpCircle, User } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Roadmap', path: '/roadmap', icon: Map },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Reports', path: '/reports', icon: PieChart },
  ];

  const bottomItems = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Help', path: '/help', icon: HelpCircle },
  ];

  return (
    <div className="w-[260px] bg-[#E7E8E9] flex flex-col h-full border-r border-border">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-text-primary">EduVise</h1>
        <p className="text-sm text-text-muted">Adaptive Learning</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-surface-low text-primary border-l-2 border-primary'
                  : 'text-text-secondary hover:bg-surface-low hover:text-text-primary border-l-2 border-transparent'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-text-secondary hover:bg-surface-low hover:text-text-primary transition-colors border-l-2 border-transparent"
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
        <div className="pt-4">
          <button className="w-full bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
