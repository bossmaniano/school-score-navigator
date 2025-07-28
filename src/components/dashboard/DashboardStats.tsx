import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, FileBarChart, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div className="flex items-center pt-1">
          <TrendingUp className="h-4 w-4 text-success mr-1" />
          <span className="text-xs text-success">{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const DashboardStats: React.FC = () => {
  const { user } = useAuth();

  const getStatsForRole = () => {
    if (user?.role === 'administrator') {
      return [
        {
          title: 'Total Students',
          value: 1247,
          description: 'Active students enrolled',
          icon: <Users className="h-4 w-4 text-muted-foreground" />,
          trend: '+12% from last month',
        },
        {
          title: 'Classes',
          value: 24,
          description: 'Active classes',
          icon: <BookOpen className="h-4 w-4 text-muted-foreground" />,
        },
        {
          title: 'Teachers',
          value: 48,
          description: 'Teaching staff',
          icon: <Users className="h-4 w-4 text-muted-foreground" />,
        },
        {
          title: 'Assessments',
          value: 156,
          description: 'Completed this term',
          icon: <FileBarChart className="h-4 w-4 text-muted-foreground" />,
          trend: '+8% completion rate',
        },
      ];
    }

    if (user?.role === 'class_teacher' || user?.role === 'subject_teacher') {
      return [
        {
          title: 'My Students',
          value: 42,
          description: 'Students in my classes',
          icon: <Users className="h-4 w-4 text-muted-foreground" />,
        },
        {
          title: 'Subjects',
          value: 3,
          description: 'Subjects I teach',
          icon: <BookOpen className="h-4 w-4 text-muted-foreground" />,
        },
        {
          title: 'Pending Marks',
          value: 24,
          description: 'Assessments to grade',
          icon: <FileBarChart className="h-4 w-4 text-muted-foreground" />,
        },
        {
          title: 'Average Score',
          value: '78%',
          description: 'Class performance',
          icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
          trend: '+5% improvement',
        },
      ];
    }

    if (user?.role === 'student') {
      return [
        {
          title: 'Current Grade',
          value: 'A-',
          description: 'Overall performance',
          icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
        },
        {
          title: 'Subjects',
          value: 8,
          description: 'Enrolled subjects',
          icon: <BookOpen className="h-4 w-4 text-muted-foreground" />,
        },
        {
          title: 'Assessments',
          value: 12,
          description: 'Completed this term',
          icon: <FileBarChart className="h-4 w-4 text-muted-foreground" />,
        },
        {
          title: 'Class Rank',
          value: '3rd',
          description: 'Out of 42 students',
          icon: <Users className="h-4 w-4 text-muted-foreground" />,
          trend: 'Moved up 2 positions',
        },
      ];
    }

    return [];
  };

  const stats = getStatsForRole();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;