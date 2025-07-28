import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  Database, 
  Activity, 
  Shield, 
  Clock, 
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const AdminSystemStatus: React.FC = () => {
  const systemMetrics = {
    uptime: '99.8%',
    responseTime: '120ms',
    activeUsers: 234,
    databaseStatus: 'online',
    backupStatus: 'current',
    securityScan: '2 hours ago',
    storageUsed: '2.4GB',
    storageTotal: '10GB'
  };

  const alerts = [
    {
      id: 1,
      type: 'info',
      message: 'Scheduled maintenance tonight at 2:00 AM',
      timestamp: '30 min ago'
    },
    {
      id: 2,
      type: 'success',
      message: 'Database backup completed successfully',
      timestamp: '2 hours ago'
    },
    {
      id: 3,
      type: 'warning',
      message: 'High CPU usage detected on server 2',
      timestamp: '4 hours ago'
    }
  ];

  const StatusBadge = ({ status, type }: { status: string; type: 'success' | 'warning' | 'error' }) => {
    const variants = {
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      error: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <Badge className={variants[type]}>
        {type === 'success' && <CheckCircle className="h-3 w-3 mr-1" />}
        {type === 'warning' && <AlertCircle className="h-3 w-3 mr-1" />}
        {type === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold">{systemMetrics.uptime}</p>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold">{systemMetrics.responseTime}</p>
                <p className="text-xs text-muted-foreground mt-1">Average</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{systemMetrics.activeUsers}</p>
                <p className="text-xs text-muted-foreground mt-1">Currently online</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage</p>
                <p className="text-2xl font-bold">{systemMetrics.storageUsed}</p>
                <p className="text-xs text-muted-foreground mt-1">of {systemMetrics.storageTotal}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Database className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-600" />
              System Status
            </CardTitle>
            <CardDescription>
              Current status of core system components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Database</span>
              <StatusBadge status="Online" type="success" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Web Server</span>
              <StatusBadge status="Running" type="success" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Authentication</span>
              <StatusBadge status="Active" type="success" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">File Storage</span>
              <StatusBadge status="Online" type="success" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Email Service</span>
              <StatusBadge status="Degraded" type="warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Security & Backup
            </CardTitle>
            <CardDescription>
              Security status and backup information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Backup Status</span>
              <StatusBadge status="Current" type="success" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Security Scan</span>
              <span className="text-sm text-muted-foreground">{systemMetrics.securityScan}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">SSL Certificate</span>
              <StatusBadge status="Valid" type="success" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Firewall</span>
              <StatusBadge status="Active" type="success" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Data Encryption</span>
              <StatusBadge status="Enabled" type="success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            System Alerts
          </CardTitle>
          <CardDescription>
            Recent system notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
              <div className="flex-shrink-0 mt-1">
                {alert.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                {alert.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                {alert.type === 'info' && <Clock className="h-4 w-4 text-blue-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {alert.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {alert.timestamp}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemStatus;