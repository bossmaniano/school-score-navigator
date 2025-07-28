import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, Users, BarChart3, Shield, CheckCircle, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <School className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">SchoolMS</h1>
              <p className="text-sm text-muted-foreground">Results Management System</p>
            </div>
          </div>
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Modern School Results
            <span className="text-primary"> Management System</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline student assessments, track performance, and generate comprehensive reports 
            with our comprehensive school management platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/login">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything You Need to Manage School Results
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform provides all the tools you need for effective student assessment and reporting.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Student Management</CardTitle>
              <CardDescription>
                Efficiently manage student records, class assignments, and academic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  Student enrollment and profiles
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  Class assignment management
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  Academic progress tracking
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Assessment & Analytics</CardTitle>
              <CardDescription>
                Create assessments, enter scores, and generate detailed performance analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  Flexible assessment creation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  Real-time performance tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  Comprehensive reporting
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Role-Based Access</CardTitle>
              <CardDescription>
                Secure access control for students, teachers, and administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  Multiple user roles
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  Permission-based features
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  Secure data protection
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join schools worldwide that trust SchoolMS for their student assessment and reporting needs.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/login">
                Sign In to Your Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 SchoolMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
