import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  School, 
  BookOpen, 
  BarChart3, 
  Shield, 
  Settings, 
  Database, 
  AlertTriangle,
  Plus,
  Activity,
  TrendingUp,
  Calendar,
  FileText,
  UserCheck,
  GraduationCap,
  Building,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminSystemStatus from '@/components/admin/AdminSystemStatus';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [systemStats, setSystemStats] = useState({
    totalUsers: 1247,
    totalStudents: 1089,
    totalTeachers: 58,
    totalClasses: 24,
    totalSchools: 3,
    activeAssessments: 15,
    pendingGrades: 89,
    systemUptime: '99.8%'
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'user_registration',
      message: 'New teacher registered: Mary Johnson',
      timestamp: '2 minutes ago',
      severity: 'info'
    },
    {
      id: 2,
      type: 'system_alert',
      message: 'Database backup completed successfully',
      timestamp: '15 minutes ago',
      severity: 'success'
    },
    {
      id: 3,
      type: 'grade_submission',
      message: '45 new grades submitted for Form 2B Mathematics',
      timestamp: '1 hour ago',
      severity: 'info'
    },
    {
      id: 4,
      type: 'security_alert',
      message: 'Failed login attempts detected from IP 192.168.1.100',
      timestamp: '2 hours ago',
      severity: 'warning'
    }
  ]);

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${user?.name}!`;
  };

  const handleQuickAction = (action: string) => {
    toast({
      title: 'Feature Coming Soon',
      description: `${action} functionality will be available in the next update.`,
      variant: 'default',
    });
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    trend, 
    color = 'blue' 
  }: {
    title: string;
    value: string | number;
    icon: any;
    description: string;
    trend?: string;
    color?: string;
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
            {trend && (
              <Badge variant="secondary" className="mt-2 text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend}
              </Badge>
            )}
          </div>
          <div className={`p-3 rounded-full bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const QuickActionButton = ({ 
    title, 
    description, 
    icon: Icon, 
    action, 
    color = 'blue' 
  }: {
    title: string;
    description: string;
    icon: any;
    action: string;
    color?: string;
  }) => (
    <Button
      variant="outline"
      className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-shadow"
      onClick={() => handleQuickAction(action)}
    >
      <div className="flex items-center space-x-2 w-full">
        <Icon className={`h-5 w-5 text-${color}-600`} />
        <span className="font-medium">{title}</span>
      </div>
      <p className="text-xs text-muted-foreground text-left">{description}</p>
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            {getWelcomeMessage()}
          </h1>
          <p className="text-muted-foreground">
            Administrative Dashboard - System Overview & Management
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Badge variant="outline" className="text-green-700 border-green-300">
            <Activity className="h-3 w-3 mr-1" />
            System Online
          </Badge>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date().toLocaleDateString()}
          </Button>
        </div>
      </div>

      {/* System Alerts */}
      <Alert className="border-yellow-200 bg-yellow-50/50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Maintenance Notice:</strong> Scheduled system backup tonight at 2:00 AM (approximately 30 minutes).
        </AlertDescription>
      </Alert>

      {/* Key Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={systemStats.totalUsers.toLocaleString()}
          icon={Users}
          description="Active system users"
          trend="+12% this month"
          color="blue"
        />
        <StatCard
          title="Students Enrolled"
          value={systemStats.totalStudents.toLocaleString()}
          icon={GraduationCap}
          description="Currently enrolled students"
          trend="+8% this term"
          color="green"
        />
        <StatCard
          title="Teaching Staff"
          value={systemStats.totalTeachers}
          icon={UserCheck}
          description="Active teachers"
          trend="+3 new this month"
          color="purple"
        />
        <StatCard
          title="System Uptime"
          value={systemStats.systemUptime}
          icon={Activity}
          description="Last 30 days"
          color="green"
        />
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <QuickActionButton
                  title="Add New User"
                  description="Register new student, teacher, or admin"
                  icon={Users}
                  action="Add New User"
                  color="blue"
                />
                <QuickActionButton
                  title="Create Class"
                  description="Set up new class with subjects"
                  icon={BookOpen}
                  action="Create Class"
                  color="green"
                />
                <QuickActionButton
                  title="System Backup"
                  description="Manually trigger system backup"
                  icon={Database}
                  action="System Backup"
                  color="purple"
                />
                <QuickActionButton
                  title="Generate Reports"
                  description="Create comprehensive system reports"
                  icon={FileText}
                  action="Generate Reports"
                  color="orange"
                />
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Recent System Activity
                </CardTitle>
                <CardDescription>
                  Latest events and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Badge
                        variant={
                          activity.severity === 'success'
                            ? 'default'
                            : activity.severity === 'warning'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="w-2 h-2 p-0 rounded-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Management Tab */}
        <TabsContent value="management" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage student, teacher, and admin accounts
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Users:</span>
                    <span className="font-medium">{systemStats.totalUsers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pending Approvals:</span>
                    <span className="font-medium text-orange-600">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-green-600" />
                  School Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure schools, classes, and subjects
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Schools:</span>
                    <span className="font-medium">{systemStats.totalSchools}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Classes:</span>
                    <span className="font-medium">{systemStats.totalClasses}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Assessment Center
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Monitor assessments and grading
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Assessments:</span>
                    <span className="font-medium">{systemStats.activeAssessments}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pending Grades:</span>
                    <span className="font-medium text-orange-600">{systemStats.pendingGrades}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Real-time system metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Performance</span>
                    <Badge variant="secondary">Excellent</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Response Time</span>
                    <span className="text-sm font-medium">120ms avg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Storage Used</span>
                    <span className="text-sm font-medium">2.4GB / 10GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Sessions</span>
                    <span className="text-sm font-medium">234</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>Platform utilization metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daily Active Users</span>
                    <span className="text-sm font-medium">856</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Assessments This Week</span>
                    <span className="text-sm font-medium">42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Grades Entered Today</span>
                    <span className="text-sm font-medium">187</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">System Alerts</span>
                    <span className="text-sm font-medium text-orange-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-4">
          <AdminSystemStatus />
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Database Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  User Permissions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Backup & Recovery
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Status</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Online
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Backup Status</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Current
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Security Scan</span>
                    <Badge variant="secondary">
                      Last: 2 hours ago
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Updates Available</span>
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      2 pending
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;