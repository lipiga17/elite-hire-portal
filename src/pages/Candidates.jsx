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
import { Search, Users, X, Filter } from 'lucide-react';

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Candidates</h1>
            <p className="text-muted-foreground mt-1">
              {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''} 
              {hasActiveFilters ? ' (filtered)' : ''}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filters */}
        <div className={`bg-card rounded-lg border border-border p-4 space-y-4 ${showFilters ? 'block' : 'hidden sm:block'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Position Filter */}
            <div className="space-y-2">
              <Label>Position</Label>
              <Select 
                value={filters.positionId} 
                onValueChange={(value) => handleFilterChange('positionId', value)}
              >
                <SelectTrigger>
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
              <Label>Experience</Label>
              <Select 
                value={filters.experience} 
                onValueChange={(value) => handleFilterChange('experience', value)}
              >
                <SelectTrigger>
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
              <Label>Location</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search location..."
                  className="pl-10"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Candidates Grid */}
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No candidates found
            </h3>
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your filters' 
                : 'No candidates have applied yet'}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCandidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
