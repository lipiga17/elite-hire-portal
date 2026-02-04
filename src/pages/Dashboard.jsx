import { useNavigate } from 'react-router-dom';
import { usePositions } from '../contexts/PositionsContext';
import { useCandidates } from '../contexts/CandidatesContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import MetricCard from '../components/dashboard/MetricCard';
import PositionCard from '../components/dashboard/PositionCard';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, Users, AlertCircle, CheckCircle, 
  Plus, ArrowRight 
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { positions, getStats } = usePositions();
  const { candidates } = useCandidates();
  
  const stats = getStats();

  const metrics = [
    {
      title: 'Total Positions',
      value: stats.total,
      icon: Briefcase,
      trend: 'up',
      trendValue: '+2 this month',
    },
    {
      title: 'Active Positions',
      value: stats.active,
      icon: CheckCircle,
      trend: 'stable',
      trendValue: 'No change',
    },
    {
      title: 'Total Candidates',
      value: candidates.length,
      icon: Users,
      trend: 'up',
      trendValue: '+12 this week',
    },
    {
      title: 'High Priority',
      value: stats.highPriority,
      icon: AlertCircle,
      trend: 'down',
      trendValue: '-1 resolved',
    },
  ];

  const activePositions = positions.filter(p => p.status === 'active').slice(0, 6);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your hiring pipeline
            </p>
          </div>
          <Button onClick={() => navigate('/positions/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Position
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        {/* Active Positions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Active Positions</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/positions')}>
              View all
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {activePositions.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No positions yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first position to start receiving candidates
              </p>
              <Button onClick={() => navigate('/positions/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Position
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {activePositions.map((position) => (
                <PositionCard 
                  key={position.id} 
                  position={position}
                  onEdit={(pos) => navigate(`/positions/edit/${pos.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
