import { MapPin, Briefcase, Calendar, FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CandidateCard({ candidate }) {
  return (
    <div className="candidate-card animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
          {candidate.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground truncate">
            {candidate.name}
          </h3>
          <p className="text-sm text-muted-foreground">{candidate.email}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="w-4 h-4" />
          <span className="truncate">{candidate.positionTitle}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{candidate.experience} years experience</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{candidate.location}</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize
          ${candidate.status === 'new' ? 'bg-info/10 text-info border border-info/20' :
            candidate.status === 'screening' ? 'bg-warning/10 text-warning border border-warning/20' :
            candidate.status === 'interview' ? 'bg-success/10 text-success border border-success/20' :
            'bg-muted text-muted-foreground border border-border'
          }`}>
          {candidate.status}
        </span>
      </div>

      {/* Resume Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Eye className="w-4 h-4 mr-1" />
          View Resume
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Download className="w-4 h-4 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );
}
