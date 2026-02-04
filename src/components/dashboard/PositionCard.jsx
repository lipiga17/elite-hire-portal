import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Clock, Users, Edit2, Eye, 
  AlertCircle, ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const priorityStyles = {
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low',
};

const priorityLabels = {
  high: 'High Priority',
  medium: 'Medium',
  low: 'Low',
};

export default function PositionCard({ position, onEdit }) {
  const navigate = useNavigate();

  return (
    <div className="position-card animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground truncate">
            {position.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">{position.category}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityStyles[position.priority]}`}>
          {priorityLabels[position.priority]}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{position.experienceMin}-{position.experienceMax} years experience</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{position.workType} · {position.locations?.join(', ')}</span>
        </div>
      </div>

      {/* Candidate Badge */}
      <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg mb-4">
        <Users className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">
          {position.candidateCount || 0} candidate{position.candidateCount !== 1 ? 's' : ''} applied
        </span>
        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onEdit?.(position)}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1"
          onClick={() => navigate(`/candidates?position=${position.id}`)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Candidates
        </Button>
      </div>
    </div>
  );
}
