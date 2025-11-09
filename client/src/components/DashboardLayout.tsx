import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Brain, LayoutDashboard, BookOpen, Settings, LogOut, Menu } from 'lucide-react';
import { APP_NAME } from '@/config';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, organization, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Knowledge Base', href: '/knowledge', icon: BookOpen },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300',
          !sidebarOpen && '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">{APP_NAME}</h1>
              <p className="text-xs text-gray-500 truncate">{organization?.name}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.full_name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300',
          sidebarOpen ? 'ml-64' : 'ml-0'
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4 px-6 py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex-1" />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
