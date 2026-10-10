import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Store, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export function AdminLayout() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-ivory"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" /></div>;
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-gray-200 bg-white md:flex">
          <div className="border-b border-gray-100 p-6">
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg font-bold tracking-[0.15em] text-charcoal">LUXURIOUS</span>
              <span className="text-[9px] font-medium tracking-[0.4em] text-gold">SHOP · ADMIN</span>
            </div>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors',
                    isActive ? 'bg-charcoal text-white' : 'text-gray-600 hover:bg-ivory hover:text-charcoal',
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-gray-100 p-4">
            <p className="mb-2 truncate text-xs text-gray-400">{user.email}</p>
            <button
              onClick={async () => { await signOut(); navigate('/admin'); }}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
            <a href="/" className="mt-3 flex items-center gap-2 text-sm text-gray-600 hover:text-gold">
              <Store className="h-4 w-4" /> View Store
            </a>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
          <span className="font-serif text-sm font-bold tracking-wider text-charcoal">ADMIN</span>
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-500"><Store className="h-4 w-4" /></a>
            <button onClick={async () => { await signOut(); navigate('/admin'); }} className="text-gray-500 hover:text-red-500">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-gray-200 bg-white md:hidden">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium',
                  isActive ? 'text-gold' : 'text-gray-500',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 pb-20 pt-16 md:p-8 md:pb-8 md:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
