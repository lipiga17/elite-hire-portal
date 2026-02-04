import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePositions } from '../contexts/PositionsContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import PositionCard from '../components/dashboard/PositionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Briefcase, FileText, Download, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Positions() {
  const navigate = useNavigate();
  const { positions } = usePositions();
  const [searchQuery, setSearchQuery] = useState('');
  const [documentModal, setDocumentModal] = useState({ open: false, position: null, type: null });
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredPositions = positions.filter(pos =>
    pos.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pos.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateDocument = (position, type) => {
    setDocumentModal({ open: true, position, type });
    setIsGenerating(true);
    
    // Simulate document generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Positions</h1>
            <p className="text-muted-foreground mt-1">
              Manage your open positions
            </p>
          </div>
          <Button onClick={() => navigate('/positions/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Position
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search positions..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Positions Grid */}
        {filteredPositions.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? 'No positions found' : 'No positions yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Try adjusting your search query' 
                : 'Create your first position to start receiving candidates'}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/positions/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Position
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPositions.map((position) => (
              <div key={position.id} className="space-y-3">
                <PositionCard 
                  position={position}
                  onEdit={(pos) => navigate(`/positions/edit/${pos.id}`)}
                />
                {/* Document Generation Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-xs"
                    onClick={() => handleGenerateDocument(position, 'jd')}
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    Generate JD
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-xs"
                    onClick={() => handleGenerateDocument(position, 'interview')}
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    Interview Prep
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      <Dialog open={documentModal.open} onOpenChange={(open) => setDocumentModal({ ...documentModal, open })}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {documentModal.type === 'jd' ? 'Job Description' : 'Interview Preparation'}
              {documentModal.position && ` - ${documentModal.position.title}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Generating document...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* PDF Preview Placeholder */}
                <div className="bg-muted rounded-lg border border-border aspect-[8.5/11] flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      PDF Preview
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {documentModal.type === 'jd' 
                        ? 'Job description document' 
                        : 'Interview preparation guide'}
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    View Full Document
                  </Button>
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
