import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePositions } from '../contexts/PositionsContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Check, ChevronLeft, ChevronRight, Briefcase, 
  FileText, Settings, MapPin, X 
} from 'lucide-react';

const CATEGORIES = ['Engineering', 'Product', 'Design', 'Data', 'Marketing', 'Sales', 'Operations', 'Finance', 'HR'];
const WORK_TYPES = ['On-site', 'Remote', 'Hybrid'];
const PRIORITIES = ['low', 'medium', 'high'];
const LOCATIONS = ['New York', 'San Francisco', 'Boston', 'Chicago', 'Austin', 'Seattle', 'Los Angeles', 'Denver', 'Atlanta', 'Miami', 'Remote'];

const STEP_LABELS = ['Position Details', 'Requirements', 'Settings'];

const initialFormData = {
  title: '',
  category: '',
  description: '',
  experienceMin: '',
  experienceMax: '',
  requirements: '',
  workType: '',
  locations: [],
  priority: 'medium',
};

export default function PositionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addPosition, updatePosition, getPosition } = usePositions();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditing = !!id;

  useEffect(() => {
    if (id) {
      const position = getPosition(id);
      if (position) {
        setFormData({
          ...position,
          requirements: Array.isArray(position.requirements) 
            ? position.requirements.join('\n') 
            : position.requirements || '',
        });
      }
    }
  }, [id, getPosition]);

  const validateStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = 'Position title is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    }
    
    if (currentStep === 2) {
      if (!formData.experienceMin) newErrors.experienceMin = 'Minimum experience is required';
      if (!formData.experienceMax) newErrors.experienceMax = 'Maximum experience is required';
      if (Number(formData.experienceMin) > Number(formData.experienceMax)) {
        newErrors.experienceMax = 'Maximum must be greater than minimum';
      }
    }
    
    if (currentStep === 3) {
      if (!formData.workType) newErrors.workType = 'Work type is required';
      if (formData.locations.length === 0) newErrors.locations = 'At least one location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const toggleLocation = (location) => {
    const current = formData.locations;
    if (current.includes(location)) {
      setFormData({ ...formData, locations: current.filter(l => l !== location) });
    } else {
      setFormData({ ...formData, locations: [...current, location] });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    
    const positionData = {
      ...formData,
      experienceMin: Number(formData.experienceMin),
      experienceMax: Number(formData.experienceMax),
      requirements: formData.requirements.split('\n').filter(r => r.trim()),
    };
    
    if (isEditing) {
      updatePosition(id, positionData);
    } else {
      addPosition(positionData);
    }
    
    navigate('/positions');
    setIsSubmitting(false);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {STEP_LABELS.map((label, index) => {
        const stepNum = index + 1;
        const isCompleted = currentStep > stepNum;
        const isActive = currentStep === stepNum;
        
        return (
          <div key={stepNum} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`stepper-step ${
                isCompleted ? 'stepper-step-completed' : 
                isActive ? 'stepper-step-active' : 'stepper-step-pending'
              }`}>
                {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
              </div>
              <span className={`text-xs mt-2 ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </div>
            {index < STEP_LABELS.length - 1 && (
              <div className={`stepper-line w-16 sm:w-24 ${
                currentStep > stepNum ? 'stepper-line-active' : 'stepper-line-pending'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/positions')}
            className="mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Positions
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">
            {isEditing ? 'Edit Position' : 'Create New Position'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? 'Update position details' : 'Fill in the details to create a new position'}
          </p>
        </div>

        {/* Stepper */}
        {renderStepIndicator()}

        {/* Form Card */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          {/* Step 1: Position Details */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Briefcase className="w-5 h-5" />
                <span className="font-medium">Position Details</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Position Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
                        ${formData.category === cat
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-accent'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role and responsibilities..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Requirements */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 text-primary mb-4">
                <FileText className="w-5 h-5" />
                <span className="font-medium">Requirements</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experienceMin">Min Experience (years) *</Label>
                  <Input
                    id="experienceMin"
                    type="number"
                    min="0"
                    placeholder="e.g., 3"
                    value={formData.experienceMin}
                    onChange={(e) => setFormData({ ...formData, experienceMin: e.target.value })}
                    className={errors.experienceMin ? 'border-destructive' : ''}
                  />
                  {errors.experienceMin && <p className="text-sm text-destructive">{errors.experienceMin}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experienceMax">Max Experience (years) *</Label>
                  <Input
                    id="experienceMax"
                    type="number"
                    min="0"
                    placeholder="e.g., 7"
                    value={formData.experienceMax}
                    onChange={(e) => setFormData({ ...formData, experienceMax: e.target.value })}
                    className={errors.experienceMax ? 'border-destructive' : ''}
                  />
                  {errors.experienceMax && <p className="text-sm text-destructive">{errors.experienceMax}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea
                  id="requirements"
                  placeholder="e.g., 5+ years of React experience&#10;Strong system design skills&#10;Excellent communication"
                  rows={5}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </div>

              <div className="space-y-2">
                <Label>Work Type *</Label>
                <div className="flex gap-2">
                  {WORK_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, workType: type })}
                      className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border
                        ${formData.workType === type
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card text-foreground border-border hover:border-primary'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {errors.workType && <p className="text-sm text-destructive">{errors.workType}</p>}
              </div>

              <div className="space-y-2">
                <Label>Locations *</Label>
                <p className="text-sm text-muted-foreground">Select all applicable locations</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {LOCATIONS.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => toggleLocation(location)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
                        ${formData.locations.includes(location)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-accent'
                        }`}
                    >
                      <MapPin className="inline-block w-3 h-3 mr-1" />
                      {location}
                    </button>
                  ))}
                </div>
                {errors.locations && <p className="text-sm text-destructive">{errors.locations}</p>}
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="flex gap-2">
                  {PRIORITIES.map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority })}
                      className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium capitalize transition-all border
                        ${formData.priority === priority
                          ? priority === 'high' ? 'bg-destructive text-destructive-foreground border-destructive' :
                            priority === 'medium' ? 'bg-warning text-warning-foreground border-warning' :
                            'bg-success text-success-foreground border-success'
                          : 'bg-card text-foreground border-border hover:border-muted-foreground'
                        }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-border">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            {currentStep < 3 ? (
              <Button onClick={handleNext} className="flex-1">
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Position' : 'Create Position'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
