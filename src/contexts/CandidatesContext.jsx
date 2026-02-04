import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CandidatesContext = createContext(null);

const CANDIDATES_KEY = 'straatix_candidates';

// Mock candidates for demo
const mockCandidates = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    experience: 7,
    location: 'New York',
    positionId: '1',
    positionTitle: 'Senior Software Engineer',
    resumeUrl: '#',
    appliedAt: '2024-01-20',
    status: 'new',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'mchen@email.com',
    experience: 6,
    location: 'San Francisco',
    positionId: '1',
    positionTitle: 'Senior Software Engineer',
    resumeUrl: '#',
    appliedAt: '2024-01-22',
    status: 'screening',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    experience: 4,
    location: 'Remote',
    positionId: '2',
    positionTitle: 'Product Manager',
    resumeUrl: '#',
    appliedAt: '2024-01-25',
    status: 'new',
  },
  {
    id: '4',
    name: 'David Park',
    email: 'dpark@email.com',
    experience: 5,
    location: 'Boston',
    positionId: '3',
    positionTitle: 'UX Designer',
    resumeUrl: '#',
    appliedAt: '2024-01-28',
    status: 'interview',
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.t@email.com',
    experience: 8,
    location: 'New York',
    positionId: '1',
    positionTitle: 'Senior Software Engineer',
    resumeUrl: '#',
    appliedAt: '2024-01-30',
    status: 'new',
  },
  {
    id: '6',
    name: 'James Wilson',
    email: 'jwilson@email.com',
    experience: 5,
    location: 'Chicago',
    positionId: '4',
    positionTitle: 'Data Scientist',
    resumeUrl: '#',
    appliedAt: '2024-02-01',
    status: 'new',
  },
  {
    id: '7',
    name: 'Amanda Foster',
    email: 'afoster@email.com',
    experience: 3,
    location: 'Austin',
    positionId: '4',
    positionTitle: 'Data Scientist',
    resumeUrl: '#',
    appliedAt: '2024-02-02',
    status: 'screening',
  },
  {
    id: '8',
    name: 'Robert Kim',
    email: 'rkim@email.com',
    experience: 6,
    location: 'Remote',
    positionId: '2',
    positionTitle: 'Product Manager',
    resumeUrl: '#',
    appliedAt: '2024-02-03',
    status: 'new',
  },
];

export function CandidatesProvider({ children }) {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`${CANDIDATES_KEY}_${user.id}`);
      if (stored) {
        setCandidates(JSON.parse(stored));
      } else {
        setCandidates(mockCandidates);
        localStorage.setItem(`${CANDIDATES_KEY}_${user.id}`, JSON.stringify(mockCandidates));
      }
    }
  }, [user]);

  const getCandidatesByPosition = (positionId) => {
    return candidates.filter(c => c.positionId === positionId);
  };

  const getCandidateCount = (positionId) => {
    return candidates.filter(c => c.positionId === positionId).length;
  };

  const filterCandidates = (filters) => {
    let filtered = [...candidates];
    
    if (filters.positionId) {
      filtered = filtered.filter(c => c.positionId === filters.positionId);
    }
    
    if (filters.experience) {
      const [min, max] = filters.experience.split('-').map(Number);
      filtered = filtered.filter(c => c.experience >= min && c.experience <= max);
    }
    
    if (filters.location) {
      filtered = filtered.filter(c => 
        c.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    return filtered;
  };

  return (
    <CandidatesContext.Provider value={{
      candidates,
      getCandidatesByPosition,
      getCandidateCount,
      filterCandidates,
    }}>
      {children}
    </CandidatesContext.Provider>
  );
}

export function useCandidates() {
  const context = useContext(CandidatesContext);
  if (!context) {
    throw new Error('useCandidates must be used within a CandidatesProvider');
  }
  return context;
}

export default CandidatesContext;
