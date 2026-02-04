import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PositionsContext = createContext(null);

const POSITIONS_KEY = 'straatix_positions';

// Mock initial positions for demo
const mockPositions = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    category: 'Engineering',
    experienceMin: 5,
    experienceMax: 10,
    workType: 'Hybrid',
    locations: ['New York', 'San Francisco'],
    priority: 'high',
    candidateCount: 24,
    status: 'active',
    description: 'Looking for a senior engineer to lead our platform team.',
    requirements: ['5+ years experience', 'React expertise', 'System design skills'],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Product Manager',
    category: 'Product',
    experienceMin: 3,
    experienceMax: 7,
    workType: 'Remote',
    locations: ['Remote'],
    priority: 'medium',
    candidateCount: 18,
    status: 'active',
    description: 'Seeking a product manager to drive our B2B initiatives.',
    requirements: ['3+ years PM experience', 'B2B background', 'Data-driven'],
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    title: 'UX Designer',
    category: 'Design',
    experienceMin: 2,
    experienceMax: 5,
    workType: 'On-site',
    locations: ['Boston'],
    priority: 'low',
    candidateCount: 12,
    status: 'active',
    description: 'Join our design team to craft exceptional user experiences.',
    requirements: ['Figma expertise', 'Portfolio required', 'User research skills'],
    createdAt: '2024-01-25',
  },
  {
    id: '4',
    title: 'Data Scientist',
    category: 'Data',
    experienceMin: 4,
    experienceMax: 8,
    workType: 'Hybrid',
    locations: ['Chicago', 'Austin'],
    priority: 'high',
    candidateCount: 9,
    status: 'active',
    description: 'Build ML models to power our recommendation engine.',
    requirements: ['Python/ML expertise', 'PhD preferred', 'Production ML experience'],
    createdAt: '2024-02-01',
  },
];

export function PositionsProvider({ children }) {
  const { user } = useAuth();
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`${POSITIONS_KEY}_${user.id}`);
      if (stored) {
        setPositions(JSON.parse(stored));
      } else {
        // Initialize with mock data for new users
        setPositions(mockPositions);
        localStorage.setItem(`${POSITIONS_KEY}_${user.id}`, JSON.stringify(mockPositions));
      }
    }
  }, [user]);

  const savePositions = (newPositions) => {
    setPositions(newPositions);
    if (user) {
      localStorage.setItem(`${POSITIONS_KEY}_${user.id}`, JSON.stringify(newPositions));
    }
  };

  const addPosition = (position) => {
    const newPosition = {
      ...position,
      id: Date.now().toString(),
      candidateCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    savePositions([...positions, newPosition]);
    return newPosition;
  };

  const updatePosition = (id, updates) => {
    const updated = positions.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    savePositions(updated);
  };

  const deletePosition = (id) => {
    savePositions(positions.filter(p => p.id !== id));
  };

  const getPosition = (id) => {
    return positions.find(p => p.id === id);
  };

  const getStats = () => {
    const total = positions.length;
    const active = positions.filter(p => p.status === 'active').length;
    const totalCandidates = positions.reduce((sum, p) => sum + (p.candidateCount || 0), 0);
    const highPriority = positions.filter(p => p.priority === 'high').length;
    
    return { total, active, totalCandidates, highPriority };
  };

  return (
    <PositionsContext.Provider value={{
      positions,
      addPosition,
      updatePosition,
      deletePosition,
      getPosition,
      getStats,
    }}>
      {children}
    </PositionsContext.Provider>
  );
}

export function usePositions() {
  const context = useContext(PositionsContext);
  if (!context) {
    throw new Error('usePositions must be used within a PositionsProvider');
  }
  return context;
}

export default PositionsContext;
