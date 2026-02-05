 import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { usePositions } from '../contexts/PositionsContext';
 import DashboardLayout from '../components/layout/DashboardLayout';
 import PositionCard from '../components/dashboard/PositionCard';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Plus, Search, Briefcase, FileText, Download, Loader2, Eye, X } from 'lucide-react';
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
       <div className="space-y-8">
         {/* Header */}
         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
           <div>
             <h1 className="text-3xl font-bold text-foreground">Positions</h1>
             <p className="text-muted-foreground mt-2 text-lg">
               Manage your open positions and generate documents
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
 
         {/* Search Bar */}
         <div className="relative max-w-lg">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
           <Input
             placeholder="Search by title or category..."
             className="h-12 pl-12 pr-4 rounded-xl text-base"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
         </div>
 
         {/* Positions Grid */}
         {filteredPositions.length === 0 ? (
           <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-premium">
             <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
               <Briefcase className="w-10 h-10 text-primary" />
             </div>
             <h3 className="text-xl font-bold text-foreground mb-3">
               {searchQuery ? 'No positions found' : 'No positions yet'}
             </h3>
             <p className="text-muted-foreground mb-8 max-w-md mx-auto">
               {searchQuery 
                 ? 'Try adjusting your search query to find what you\'re looking for.' 
                 : 'Create your first position to start receiving candidates.'}
             </p>
             {!searchQuery && (
               <Button onClick={() => navigate('/positions/new')} size="lg" className="h-12 px-8 rounded-xl font-semibold">
                 <Plus className="w-5 h-5 mr-2" />
                 Create Position
               </Button>
             )}
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
             {filteredPositions.map((position, index) => (
               <div key={position.id} className="space-y-4" style={{ animationDelay: `${index * 50}ms` }}>
                 <PositionCard 
                   position={position}
                   onEdit={(pos) => navigate(`/positions/edit/${pos.id}`)}
                 />
                 {/* Document Generation Buttons */}
                 <div className="flex gap-3">
                   <Button 
                     variant="outline" 
                     size="sm" 
                     className="flex-1 h-10 rounded-xl text-xs font-semibold"
                     onClick={() => handleGenerateDocument(position, 'jd')}
                   >
                     <FileText className="w-4 h-4 mr-2" />
                     Generate JD
                   </Button>
                   <Button 
                     variant="outline" 
                     size="sm" 
                     className="flex-1 h-10 rounded-xl text-xs font-semibold"
                     onClick={() => handleGenerateDocument(position, 'interview')}
                   >
                     <FileText className="w-4 h-4 mr-2" />
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
         <DialogContent className="max-w-4xl max-h-[90vh] p-0 rounded-2xl overflow-hidden">
           <DialogHeader className="px-8 pt-8 pb-4">
             <DialogTitle className="text-xl font-bold">
               {documentModal.type === 'jd' ? 'Job Description' : 'Interview Preparation'}
               {documentModal.position && (
                 <span className="text-muted-foreground font-normal"> — {documentModal.position.title}</span>
               )}
             </DialogTitle>
           </DialogHeader>
           
           <div className="px-8 pb-8">
             {isGenerating ? (
               <div className="flex flex-col items-center justify-center py-24">
                 <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                   <Loader2 className="w-8 h-8 text-primary animate-spin" />
                 </div>
                 <p className="text-lg font-medium text-foreground mb-2">Generating document...</p>
                 <p className="text-sm text-muted-foreground">This usually takes a few seconds</p>
               </div>
             ) : (
               <div className="space-y-6">
                 {/* PDF Preview Placeholder */}
                 <div className="bg-muted rounded-2xl border border-border aspect-[8.5/11] flex items-center justify-center">
                   <div className="text-center">
                     <div className="w-20 h-20 rounded-2xl bg-card flex items-center justify-center mx-auto mb-6 shadow-lg">
                       <FileText className="w-10 h-10 text-primary" />
                     </div>
                     <p className="text-lg font-semibold text-foreground mb-2">
                       {documentModal.type === 'jd' ? 'Job Description' : 'Interview Prep Guide'}
                     </p>
                     <p className="text-sm text-muted-foreground">
                       PDF document ready for viewing
                     </p>
                   </div>
                 </div>
                 
                 {/* Actions */}
                 <div className="flex gap-4">
                   <Button variant="outline" className="flex-1 h-12 rounded-xl font-semibold">
                     <Eye className="w-4 h-4 mr-2" />
                     View Full Document
                   </Button>
                   <Button className="flex-1 h-12 rounded-xl font-semibold">
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
