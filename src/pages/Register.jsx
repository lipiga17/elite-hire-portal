import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Eye, EyeOff, Building2, Globe, Linkedin, MapPin, 
  User, Briefcase, Mail, Lock, Upload, X 
} from 'lucide-react';
import straatixLogo from '@/assets/straatix-logo.jpg';

const OFFICE_LOCATIONS = [
  'New York', 'San Francisco', 'Boston', 'Chicago', 'Austin', 
  'Seattle', 'Los Angeles', 'Denver', 'Atlanta', 'Miami', 'Remote'
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyLogo: null,
    companyLogoPreview: '',
    companyName: '',
    companyWebsite: '',
    companyLinkedIn: '',
    officeLocations: [],
    hirerName: '',
    hirerTitle: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          companyLogo: file,
          companyLogoPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLocation = (location) => {
    const current = formData.officeLocations;
    if (current.includes(location)) {
      setFormData({
        ...formData,
        officeLocations: current.filter(l => l !== location),
      });
    } else {
      setFormData({
        ...formData,
        officeLocations: [...current, location],
      });
    }
  };

  const validateStep = () => {
    setError('');
    
    if (step === 1) {
      if (!formData.companyName.trim()) {
        setError('Company name is required');
        return false;
      }
      if (!formData.companyWebsite.trim()) {
        setError('Company website is required');
        return false;
      }
      if (formData.officeLocations.length === 0) {
        setError('Select at least one office location');
        return false;
      }
    }
    
    if (step === 2) {
      if (!formData.hirerName.trim()) {
        setError('Your name is required');
        return false;
      }
      if (!formData.hirerTitle.trim()) {
        setError('Your title is required');
        return false;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email');
        return false;
      }
    }
    
    if (step === 3) {
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setIsLoading(true);
    const result = await register(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-navy-700 to-navy-900" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">
          <img 
            src={straatixLogo} 
            alt="Straatix Partners" 
            className="w-56 mb-6 brightness-0 invert"
          />
          <h1 className="text-3xl font-semibold mb-4">
            Join our platform
          </h1>
          <p className="text-base opacity-80">
            Register your company to start managing positions and candidates.
          </p>
          
          {/* Step indicators */}
          <div className="mt-12 space-y-4">
            {['Company Details', 'Your Profile', 'Security'].map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                  ${step > i + 1 ? 'bg-success text-success-foreground' : 
                    step === i + 1 ? 'bg-primary-foreground text-primary' : 
                    'bg-navy-600 text-navy-300'}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className={step === i + 1 ? 'font-medium' : 'opacity-70'}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-navy-600/20 rounded-full blur-3xl" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-12 py-8 overflow-y-auto">
        <div className="w-full max-w-lg mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6">
            <img src={straatixLogo} alt="Straatix Partners" className="h-10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm animate-fade-in">
                {error}
              </div>
            )}

            {/* Step 1: Company Details */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Company Details</h2>
                  <p className="text-muted-foreground mt-1">Tell us about your organization</p>
                </div>

                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="flex items-center gap-4">
                    {formData.companyLogoPreview ? (
                      <div className="relative">
                        <img 
                          src={formData.companyLogoPreview} 
                          alt="Logo preview" 
                          className="w-16 h-16 rounded-lg object-cover border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, companyLogo: null, companyLogoPreview: '' })}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-16 h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </label>
                    )}
                    <span className="text-sm text-muted-foreground">Upload your company logo (optional)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      placeholder="Acme Corporation"
                      className="pl-10"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Company Website *</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyWebsite"
                      placeholder="https://acme.com"
                      className="pl-10"
                      value={formData.companyWebsite}
                      onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyLinkedIn">Company LinkedIn</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyLinkedIn"
                      placeholder="https://linkedin.com/company/acme"
                      className="pl-10"
                      value={formData.companyLinkedIn}
                      onChange={(e) => setFormData({ ...formData, companyLinkedIn: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Office Locations *</Label>
                  <p className="text-sm text-muted-foreground">Select all locations where you hire</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {OFFICE_LOCATIONS.map((location) => (
                      <button
                        key={location}
                        type="button"
                        onClick={() => toggleLocation(location)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
                          ${formData.officeLocations.includes(location)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-accent'
                          }`}
                      >
                        <MapPin className="inline-block w-3 h-3 mr-1" />
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Details */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Your Profile</h2>
                  <p className="text-muted-foreground mt-1">Tell us about yourself</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hirerName">Your Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="hirerName"
                      placeholder="John Smith"
                      className="pl-10"
                      value={formData.hirerName}
                      onChange={(e) => setFormData({ ...formData, hirerName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hirerTitle">Your Title *</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="hirerTitle"
                      placeholder="Head of Talent"
                      className="pl-10"
                      value={formData.hirerTitle}
                      onChange={(e) => setFormData({ ...formData, hirerTitle: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Work Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@acme.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Password */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">Set Your Password</h2>
                  <p className="text-muted-foreground mt-1">Create a secure password for your account</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={handleNext} className="flex-1">
                  Continue
                </Button>
              ) : (
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              )}
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
