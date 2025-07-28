import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowRight, Lock, Settings, Users, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPortalCard: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-xl font-bold text-blue-900">
          Administrator Portal
        </CardTitle>
        <CardDescription className="text-blue-700">
          Secure access for system administrators and school management
        </CardDescription>
        <Badge variant="secondary" className="mx-auto w-fit mt-2">
          <Lock className="h-3 w-3 mr-1" />
          Restricted Access
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Feature List */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Users className="h-4 w-4" />
            User Management
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Settings className="h-4 w-4" />
            System Config
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Database className="h-4 w-4" />
            Data Management
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Shield className="h-4 w-4" />
            Security Center
          </div>
        </div>

        {/* Access Notice */}
        <div className="bg-blue-100/50 p-3 rounded-lg">
          <p className="text-xs text-blue-800 text-center">
            <strong>Administrator Access Only:</strong> This portal requires elevated permissions. 
            Contact your system administrator if you need access.
          </p>
        </div>

        {/* Access Button */}
        <Button 
          asChild 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          <Link to="/admin">
            <Shield className="h-4 w-4 mr-2" />
            Access Admin Portal
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>

        <p className="text-xs text-center text-blue-600">
          Secure Gateway • Advanced Features • System Control
        </p>
      </CardContent>
    </Card>
  );
};

export default AdminPortalCard;