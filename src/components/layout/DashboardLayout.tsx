import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogOut, School, Users, BookOpen, BarChart3, MessageCircle, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    ];

    if (user?.role === 'administrator') {
      return [
        ...baseItems,
        { href: '/school-setup', label: 'School Setup', icon: School },
        { href: '/classes', label: 'Classes', icon: BookOpen },
        { href: '/students', label: 'Students', icon: Users },
        { href: '/assessments', label: 'Assessments', icon: BarChart3 },
        { href: '/reports', label: 'Reports', icon: BarChart3 },
        { href: '/comments', label: 'Comments', icon: MessageCircle },
        { href: '/settings', label: 'Settings', icon: Settings },
      ];
    }

    if (user?.role === 'class_teacher' || user?.role === 'subject_teacher' || user?.role === 'head_teacher') {
      return [
        ...baseItems,
        { href: '/classes', label: 'My Classes', icon: BookOpen },
        { href: '/assessments', label: 'Assessments', icon: BarChart3 },
        { href: '/reports', label: 'Reports', icon: BarChart3 },
        { href: '/comments', label: 'Comments', icon: MessageCircle },
      ];
    }

    if (user?.role === 'student') {
      return [
        ...baseItems,
        { href: '/my-results', label: 'My Results', icon: BarChart3 },
        { href: '/my-pathway', label: 'My Pathway', icon: BookOpen },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <School className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">SchoolMS</h1>
                <p className="text-sm text-muted-foreground">Results Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-border">
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="h-8 w-8 p-0"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;