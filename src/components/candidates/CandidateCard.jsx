 import { MapPin, Briefcase, Clock, Download, Eye, Mail } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 
 const statusConfig = {
   new: { className: 'status-new', label: 'New' },
   screening: { className: 'status-screening', label: 'Screening' },
   interview: { className: 'status-interview', label: 'Interview' },
   offer: { className: 'status-offer', label: 'Offer' },
 };
 
 export default function CandidateCard({ candidate }) {
   const status = statusConfig[candidate.status] || statusConfig.new;
 
   return (
     <div className="candidate-card animate-fade-in group">
       {/* Header with Avatar */}
       <div className="flex items-start gap-4 mb-5">
         <div className="avatar-gradient w-14 h-14 text-lg flex-shrink-0">
           {candidate.name.charAt(0)}
         </div>
         <div className="flex-1 min-w-0">
           <h3 className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
             {candidate.name}
           </h3>
           <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
             <Mail className="w-3.5 h-3.5" />
             <span className="truncate">{candidate.email}</span>
           </div>
         </div>
         <span className={status.className}>
           {status.label}
         </span>
       </div>
 
       {/* Applied Position */}
       <div className="p-3 bg-accent/50 rounded-xl mb-4">
         <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Applied for</p>
         <p className="text-sm font-semibold text-foreground truncate">{candidate.positionTitle}</p>
       </div>
 
       {/* Details Grid */}
       <div className="grid grid-cols-2 gap-3 mb-5">
         <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
           <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
             <Clock className="w-4 h-4" />
           </div>
           <span>{candidate.experience} years</span>
         </div>
         <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
           <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
             <MapPin className="w-4 h-4" />
           </div>
           <span className="truncate">{candidate.location}</span>
         </div>
       </div>
 
       {/* Resume Actions */}
       <div className="flex gap-3">
         <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl">
           <Eye className="w-4 h-4 mr-2" />
           Resume
         </Button>
         <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl">
           <Download className="w-4 h-4 mr-2" />
           Download
         </Button>
       </div>
     </div>
   );
 }
