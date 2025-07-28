import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Bell, Plus, FileText } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${user?.name}!`;
  };

  const getQuickActions = () => {
    if (user?.role === 'administrator') {
      return [
        { label: 'Add New Student', icon: Plus, href: '/students/new' },
        { label: 'Create Assessment', icon: FileText, href: '/assessments/new' },
        { label: 'View Reports', icon: FileText, href: '/reports' },
        { label: 'Manage Classes', icon: Plus, href: '/classes' },
      ];
    }

    if (user?.role === 'class_teacher' || user?.role === 'subject_teacher') {
      return [
        { label: 'Enter Marks', icon: Plus, href: '/assessments' },
        { label: 'View My Classes', icon: FileText, href: '/classes' },
        { label: 'Class Reports', icon: FileText, href: '/reports' },
        { label: 'Add Comment', icon: Plus, href: '/comments' },
      ];
    }

    if (user?.role === 'student') {
      return [
        { label: 'View My Results', icon: FileText, href: '/my-results' },
        { label: 'Check Pathway', icon: FileText, href: '/my-pathway' },
      ];
    }

    return [];
  };

  const getRecentActivity = () => {
    return [
      {
        title: 'Math Assessment Graded',
        description: 'Form 2A - Mathematics CAT 1 results are now available',
        time: '2 hours ago',
        type: 'assessment',
      },
      {
        title: 'New Student Enrolled',
        description: 'Jane Doe has been added to Form 1B',
        time: '4 hours ago',
        type: 'student',
      },
      {
        title: 'Comment Added',
        description: 'Mr. Smith commented on Form 3A performance',
        time: '1 day ago',
        type: 'comment',
      },
      {
        title: 'Report Generated',
        description: 'Term 1 performance report is ready for review',
        time: '2 days ago',
        type: 'report',
      },
    ];
  };

  const quickActions = getQuickActions();
  const recentActivity = getRecentActivity();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{getWelcomeMessage()}</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your school today.
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <CalendarDays className="h-4 w-4 mr-2" />
            Today
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for your role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <a href={action.href}>
                    <Icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </a>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your school
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Badge
                    variant={
                      activity.type === 'assessment'
                        ? 'default'
                        : activity.type === 'student'
                        ? 'secondary'
                        : activity.type === 'comment'
                        ? 'outline'
                        : 'destructive'
                    }
                    className="w-2 h-2 p-0 rounded-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;