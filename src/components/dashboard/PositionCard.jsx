 import { useNavigate } from 'react-router-dom';
 import { 
   MapPin, Briefcase, Users, Edit2, Eye, 
   ChevronRight, Building2
 } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 
 const priorityConfig = {
   critical: { className: 'badge-critical', label: 'Critical' },
   high: { className: 'badge-high', label: 'High Priority' },
   medium: { className: 'badge-medium', label: 'Medium' },
   low: { className: 'badge-low', label: 'Low' },
 };
 
 export default function PositionCard({ position, onEdit }) {
   const navigate = useNavigate();
   const priority = priorityConfig[position.priority] || priorityConfig.medium;
 
   return (
     <div className="position-card animate-fade-in group">
       {/* Header with Priority Badge */}
       <div className="flex items-start justify-between gap-3 mb-5">
         <div className="flex-1 min-w-0">
           <div className="flex items-center gap-2 mb-1">
             <span className="text-xs font-semibold text-primary uppercase tracking-wider">
               {position.category}
             </span>
           </div>
           <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
             {position.title}
           </h3>
         </div>
         <span className={priority.className}>
           {priority.label}
         </span>
       </div>
 
       {/* Details Grid */}
       <div className="grid grid-cols-2 gap-3 mb-5">
         <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
           <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
             <Briefcase className="w-4 h-4" />
           </div>
           <span>{position.experienceMin}-{position.experienceMax} years</span>
         </div>
         <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
           <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
             <Building2 className="w-4 h-4" />
           </div>
           <span>{position.workType}</span>
         </div>
       </div>
 
       {/* Locations */}
       <div className="flex items-start gap-2.5 text-sm text-muted-foreground mb-5">
         <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
         <span className="line-clamp-1">{position.locations?.join(', ') || 'Not specified'}</span>
       </div>
 
       {/* Candidate Counter */}
       <button 
         onClick={() => navigate(`/candidates?position=${position.id}`)}
         className="w-full flex items-center gap-3 p-4 bg-accent/60 hover:bg-accent rounded-xl mb-5 transition-colors"
       >
         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
           <Users className="w-5 h-5 text-primary" />
         </div>
         <div className="flex-1 text-left">
           <p className="text-sm font-semibold text-foreground">
             {position.candidateCount || 0} Candidate{position.candidateCount !== 1 ? 's' : ''}
           </p>
           <p className="text-xs text-muted-foreground">View applications</p>
         </div>
         <ChevronRight className="w-5 h-5 text-muted-foreground" />
       </button>
 
       {/* Actions */}
       <div className="flex gap-3">
         <Button 
           variant="outline" 
           size="sm" 
           className="flex-1 h-10 rounded-xl"
           onClick={() => onEdit?.(position)}
         >
           <Edit2 className="w-4 h-4 mr-2" />
           Edit
         </Button>
         <Button 
           variant="default" 
           size="sm" 
           className="flex-1 h-10 rounded-xl"
           onClick={() => navigate(`/candidates?position=${position.id}`)}
         >
           <Eye className="w-4 h-4 mr-2" />
           Candidates
         </Button>
       </div>
     </div>
   );
 }
