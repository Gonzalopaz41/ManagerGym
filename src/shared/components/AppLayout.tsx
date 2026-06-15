import { useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import { Dumbbell, LayoutDashboard, LogOut, Menu, Users, X } from 'lucide-react';
import { useAppDispatch } from '@/shared/hooks/redux.hook';
import { logout } from '@/features/auth';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients',   label: 'Clientes',  icon: Users           },
];

const AppLayout = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#000000]">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#000000] border-b border-[#222222] flex items-center px-6 z-30">
        <button
          onClick={() => setOpen(true)}
          className="text-[#888888] hover:text-white transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
        <span className="ml-4 text-white text-sm font-semibold">ManagerGym</span>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-[#000000] border-r border-[#222222] z-50 flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-[#222222] shrink-0">
          <span className="flex items-center gap-2 text-white text-sm font-semibold">
            <Dumbbell size={16} />
            ManagerGym
          </span>
          <button
            onClick={() => setOpen(false)}
            className="text-[#888888] hover:text-white transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-[6px] text-sm transition-colors ${
                  isActive
                    ? 'bg-[#111111] text-white'
                    : 'text-[#888888] hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[#222222] shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-[6px] text-sm text-[#888888] hover:text-[#ff4444] transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="pt-14 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
