 import { useNavigate } from 'react-router-dom';
 import { usePositions } from '../contexts/PositionsContext';
 import { useCandidates } from '../contexts/CandidatesContext';
 import { useAuth } from '../contexts/AuthContext';
 import DashboardLayout from '../components/layout/DashboardLayout';
 import MetricCard from '../components/dashboard/MetricCard';
 import PositionCard from '../components/dashboard/PositionCard';
 import { Button } from '@/components/ui/button';
 import { 
   Briefcase, Users, AlertTriangle, CheckCircle2, 
   Plus, ArrowRight, Sparkles
 } from 'lucide-react';
 
 export default function Dashboard() {
   const navigate = useNavigate();
   const { positions, getStats } = usePositions();
   const { candidates } = useCandidates();
   const { user } = useAuth();
   
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
       icon: CheckCircle2,
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
       icon: AlertTriangle,
       trend: 'down',
       trendValue: '-1 resolved',
     },
   ];
 
   const activePositions = positions.filter(p => p.status === 'active').slice(0, 6);
 
   return (
     <DashboardLayout>
       <div className="space-y-10">
         {/* Welcome Header */}
         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
           <div>
             <div className="flex items-center gap-3 mb-2">
               <h1 className="text-3xl font-bold text-foreground">
                 Welcome back{user?.hirerName ? `, ${user.hirerName.split(' ')[0]}` : ''}
               </h1>
               <Sparkles className="w-6 h-6 text-primary" />
             </div>
             <p className="text-muted-foreground text-lg">
               Here's what's happening with your hiring pipeline today.
             </p>
           </div>
           <Button 
             onClick={() => navigate('/positions/new')} 
             size="lg" 
             className="h-12 px-6 rounded-xl font-semibold shadow-lg shadow-primary/20"
           >
             <Plus className="w-5 h-5 mr-2" />
             Create Position
           </Button>
         </div>
 
         {/* Metrics Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
           {metrics.map((metric, index) => (
             <div key={metric.title} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
               <MetricCard {...metric} />
             </div>
           ))}
         </div>
 
         {/* Active Positions Section */}
         <div>
           <div className="flex items-center justify-between mb-6">
             <div>
               <h2 className="text-xl font-bold text-foreground">Active Positions</h2>
               <p className="text-sm text-muted-foreground mt-1">Manage your open positions</p>
             </div>
             <Button 
               variant="ghost" 
               onClick={() => navigate('/positions')}
               className="text-primary hover:text-primary font-semibold"
             >
               View all positions
               <ArrowRight className="w-4 h-4 ml-2" />
             </Button>
           </div>
 
           {activePositions.length === 0 ? (
             <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-premium">
               <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                 <Briefcase className="w-10 h-10 text-primary" />
               </div>
               <h3 className="text-xl font-bold text-foreground mb-3">No positions yet</h3>
               <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                 Create your first position to start receiving candidates and build your talent pipeline.
               </p>
               <Button onClick={() => navigate('/positions/new')} size="lg" className="h-12 px-8 rounded-xl font-semibold">
                 <Plus className="w-5 h-5 mr-2" />
                 Create Your First Position
               </Button>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {activePositions.map((position, index) => (
                 <div key={position.id} style={{ animationDelay: `${index * 50}ms` }}>
                   <PositionCard 
                     position={position}
                     onEdit={(pos) => navigate(`/positions/edit/${pos.id}`)}
                   />
                 </div>
               ))}
             </div>
           )}
         </div>
       </div>
     </DashboardLayout>
   );
 }
