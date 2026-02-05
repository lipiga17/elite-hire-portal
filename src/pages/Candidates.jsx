 import { useState, useEffect } from 'react';
 import { useSearchParams } from 'react-router-dom';
 import { useCandidates } from '../contexts/CandidatesContext';
 import { usePositions } from '../contexts/PositionsContext';
 import DashboardLayout from '../components/layout/DashboardLayout';
 import CandidateCard from '../components/candidates/CandidateCard';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Button } from '@/components/ui/button';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { Search, Users, X, Filter, SlidersHorizontal } from 'lucide-react';
 
 const EXPERIENCE_RANGES = [
   { value: '', label: 'All Experience' },
   { value: '0-2', label: '0-2 years' },
   { value: '3-5', label: '3-5 years' },
   { value: '6-10', label: '6-10 years' },
   { value: '10-99', label: '10+ years' },
 ];
 
 export default function Candidates() {
   const [searchParams, setSearchParams] = useSearchParams();
   const { candidates, filterCandidates } = useCandidates();
   const { positions } = usePositions();
   
   const [filters, setFilters] = useState({
     positionId: searchParams.get('position') || '',
     experience: '',
     location: '',
   });
   
   const [filteredCandidates, setFilteredCandidates] = useState(candidates);
   const [showFilters, setShowFilters] = useState(false);
 
   useEffect(() => {
     const result = filterCandidates(filters);
     setFilteredCandidates(result);
   }, [filters, filterCandidates, candidates]);
 
   const handleFilterChange = (key, value) => {
     const newFilters = { ...filters, [key]: value };
     setFilters(newFilters);
     
     if (key === 'positionId') {
       if (value) {
         setSearchParams({ position: value });
       } else {
         setSearchParams({});
       }
     }
   };
 
   const clearFilters = () => {
     setFilters({ positionId: '', experience: '', location: '' });
     setSearchParams({});
   };
 
   const hasActiveFilters = filters.positionId || filters.experience || filters.location;
   const activeFilterCount = [filters.positionId, filters.experience, filters.location].filter(Boolean).length;
 
   return (
     <DashboardLayout>
       <div className="space-y-8">
         {/* Header */}
         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
           <div>
             <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
             <p className="text-muted-foreground mt-2 text-lg">
               {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''} 
               {hasActiveFilters ? ' matching filters' : ' total'}
             </p>
           </div>
           <Button 
             variant="outline" 
             onClick={() => setShowFilters(!showFilters)}
             className="lg:hidden h-11 rounded-xl"
           >
             <SlidersHorizontal className="w-4 h-4 mr-2" />
             Filters
             {activeFilterCount > 0 && (
               <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                 {activeFilterCount}
               </span>
             )}
           </Button>
         </div>
 
         {/* Filters Panel */}
         <div className={`bg-card rounded-2xl border border-border p-6 shadow-premium ${showFilters ? 'block' : 'hidden lg:block'}`}>
           <div className="flex items-center gap-3 mb-5">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
               <Filter className="w-5 h-5 text-primary" />
             </div>
             <div>
               <h3 className="font-semibold text-foreground">Filter Candidates</h3>
               <p className="text-sm text-muted-foreground">Refine your search results</p>
             </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
             {/* Position Filter */}
             <div className="space-y-2">
               <Label className="text-sm font-medium">Position</Label>
               <Select 
                 value={filters.positionId} 
                 onValueChange={(value) => handleFilterChange('positionId', value)}
               >
                 <SelectTrigger className="h-11 rounded-xl">
                   <SelectValue placeholder="All Positions" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="">All Positions</SelectItem>
                   {positions.map((pos) => (
                     <SelectItem key={pos.id} value={pos.id}>
                       {pos.title}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
 
             {/* Experience Filter */}
             <div className="space-y-2">
               <Label className="text-sm font-medium">Experience Level</Label>
               <Select 
                 value={filters.experience} 
                 onValueChange={(value) => handleFilterChange('experience', value)}
               >
                 <SelectTrigger className="h-11 rounded-xl">
                   <SelectValue placeholder="All Experience" />
                 </SelectTrigger>
                 <SelectContent>
                   {EXPERIENCE_RANGES.map((range) => (
                     <SelectItem key={range.value} value={range.value}>
                       {range.label}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
 
             {/* Location Filter */}
             <div className="space-y-2">
               <Label className="text-sm font-medium">Location</Label>
               <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <Input
                   placeholder="Search location..."
                   className="h-11 pl-11 rounded-xl"
                   value={filters.location}
                   onChange={(e) => handleFilterChange('location', e.target.value)}
                 />
               </div>
             </div>
           </div>
 
           {hasActiveFilters && (
             <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border">
               <span className="text-sm text-muted-foreground">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied</span>
               <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary hover:text-primary">
                 <X className="w-4 h-4 mr-1" />
                 Clear all
               </Button>
             </div>
           )}
         </div>
 
         {/* Candidates Grid */}
         {filteredCandidates.length === 0 ? (
           <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-premium">
             <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
               <Users className="w-10 h-10 text-primary" />
             </div>
             <h3 className="text-xl font-bold text-foreground mb-3">
               No candidates found
             </h3>
             <p className="text-muted-foreground mb-8 max-w-md mx-auto">
               {hasActiveFilters 
                 ? 'Try adjusting your filters to see more results.' 
                 : 'No candidates have applied to your positions yet.'}
             </p>
             {hasActiveFilters && (
               <Button variant="outline" onClick={clearFilters} className="h-11 px-6 rounded-xl">
                 Clear All Filters
               </Button>
             )}
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
             {filteredCandidates.map((candidate, index) => (
               <div key={candidate.id} style={{ animationDelay: `${index * 50}ms` }}>
                 <CandidateCard candidate={candidate} />
               </div>
             ))}
           </div>
         )}
       </div>
     </DashboardLayout>
   );
 }
