import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Users, Briefcase, Shield } from 'lucide-react';
import { useEffect } from 'react';
import straatixLogo from '@/assets/straatix-logo.jpg';

const features = [
  {
    icon: Briefcase,
    title: 'Position Management',
    description: 'Create and manage positions with our intuitive stepper workflow',
  },
  {
    icon: Users,
    title: 'Candidate Tracking',
    description: 'View and filter candidates across all your open positions',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Your data is protected with enterprise-grade security',
  },
];

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <img src={straatixLogo} alt="Straatix Partners" className="h-8" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-sm text-primary font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Enterprise Hiring Platform
          </div>
          <h1 className="text-4xl lg:text-6xl font-semibold text-foreground max-w-4xl mx-auto leading-tight">
            Streamline Your Executive Search & Talent Acquisition
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
            A consulting-grade hiring portal designed for enterprise clients. 
            Manage positions, track candidates, and make better hiring decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button size="lg" onClick={() => navigate('/register')}>
              Start Hiring
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Sign In to Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-foreground">
              Everything You Need
            </h2>
            <p className="text-muted-foreground mt-2">
              Built for enterprise hiring teams
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-card rounded-lg border border-border p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-primary rounded-2xl p-12 text-primary-foreground">
            <h2 className="text-3xl font-semibold mb-4">
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-lg opacity-80 max-w-xl mx-auto mb-8">
              Join leading enterprises using Straatix Partners to find exceptional talent.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/register')}
            >
              Get Started Today
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={straatixLogo} alt="Straatix Partners" className="h-6" />
          <p className="text-sm text-muted-foreground">
            © 2024 Straatix Partners. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
