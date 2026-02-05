 import { useState } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import { useAuth } from '../contexts/AuthContext';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { 
   Eye, EyeOff, Building2, Globe, Linkedin, MapPin, 
   User, Briefcase, Mail, Lock, Upload, X, Check, ArrowRight, ChevronLeft
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
 
   const getPasswordStrength = () => {
     const password = formData.password;
     if (!password) return { strength: 0, label: '' };
     if (password.length < 8) return { strength: 1, label: 'Weak' };
     if (password.length < 12) return { strength: 2, label: 'Fair' };
     if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 3, label: 'Strong' };
     return { strength: 2, label: 'Fair' };
   };
 
   const passwordStrength = getPasswordStrength();
 
   return (
     <div className="min-h-screen bg-background flex">
       {/* Left Panel - Premium Branding */}
       <div className="hidden lg:flex lg:w-[42%] bg-gradient-primary relative overflow-hidden">
         <div className="absolute inset-0 opacity-5">
           <div className="absolute inset-0" style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
           }} />
         </div>
         
         <div className="relative z-10 flex flex-col justify-between h-full p-12">
           <div>
             <img 
               src={straatixLogo} 
               alt="Straatix Partners" 
               className="h-10 brightness-0 invert"
             />
           </div>
           
           <div className="text-primary-foreground">
             <h1 className="text-3xl font-bold mb-4">
               Join Our Platform
             </h1>
             <p className="text-base opacity-80 mb-10">
               Register your company to start managing positions and candidates.
             </p>
             
             {/* Step indicators */}
             <div className="space-y-5">
               {[
                 { label: 'Company Details', desc: 'Your organization info' },
                 { label: 'Your Profile', desc: 'Personal information' },
                 { label: 'Security', desc: 'Create your password' }
               ].map((item, i) => (
                 <div key={i} className="flex items-start gap-4">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all flex-shrink-0
                     ${step > i + 1 ? 'bg-success text-success-foreground' : 
                       step === i + 1 ? 'bg-white text-primary' : 
                       'bg-white/20 text-white/60'}`}>
                     {step > i + 1 ? <Check className="w-5 h-5" /> : i + 1}
                   </div>
                   <div className={step === i + 1 ? 'opacity-100' : 'opacity-60'}>
                     <p className="font-semibold">{item.label}</p>
                     <p className="text-sm opacity-80">{item.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
 
           <div className="text-primary-foreground/60 text-sm">
             © {new Date().getFullYear()} Straatix Partners
           </div>
         </div>
 
         <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
       </div>
 
       {/* Right Panel - Form */}
       <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-10 overflow-y-auto">
         <div className="w-full max-w-xl mx-auto">
           {/* Mobile Logo */}
           <div className="lg:hidden mb-8">
             <img src={straatixLogo} alt="Straatix Partners" className="h-10" />
           </div>
 
           {/* Mobile Step Indicator */}
           <div className="lg:hidden flex items-center gap-2 mb-8">
             {[1, 2, 3].map((s) => (
               <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${
                 s <= step ? 'bg-primary' : 'bg-border'
               }`} />
             ))}
           </div>
 
           <form onSubmit={handleSubmit} className="space-y-6">
             {error && (
               <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm animate-fade-in">
                 {error}
               </div>
             )}
 
             {/* Step 1: Company Details */}
             {step === 1 && (
               <div className="space-y-6 animate-fade-in">
                 <div className="mb-8">
                   <h2 className="text-3xl font-bold text-foreground">Company Details</h2>
                   <p className="text-muted-foreground mt-2">Tell us about your organization</p>
                 </div>
 
                 {/* Logo Upload */}
                 <div className="space-y-3">
                   <Label>Company Logo</Label>
                   <div className="flex items-center gap-5">
                     {formData.companyLogoPreview ? (
                       <div className="relative">
                         <img 
                           src={formData.companyLogoPreview} 
                           alt="Logo preview" 
                           className="w-20 h-20 rounded-xl object-cover border-2 border-border"
                         />
                         <button
                           type="button"
                           onClick={() => setFormData({ ...formData, companyLogo: null, companyLogoPreview: '' })}
                           className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-lg"
                         >
                           <X className="w-3.5 h-3.5" />
                         </button>
                       </div>
                     ) : (
                       <label className="w-20 h-20 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-all">
                         <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                         <span className="text-xs text-muted-foreground">Upload</span>
                         <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                       </label>
                     )}
                     <div>
                       <p className="text-sm text-foreground font-medium">Upload logo</p>
                       <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                     </div>
                   </div>
                 </div>
 
                 <div className="space-y-2">
                   <Label htmlFor="companyName">Company Name *</Label>
                   <div className="relative">
                     <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                       id="companyName"
                       placeholder="Acme Corporation"
                       className="h-12 pl-11 rounded-xl"
                       value={formData.companyName}
                       onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                     />
                   </div>
                 </div>
 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="companyWebsite">Company Website *</Label>
                     <div className="relative">
                       <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="companyWebsite"
                         placeholder="https://acme.com"
                         className="h-12 pl-11 rounded-xl"
                         value={formData.companyWebsite}
                         onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                       />
                     </div>
                   </div>
 
                   <div className="space-y-2">
                     <Label htmlFor="companyLinkedIn">Company LinkedIn</Label>
                     <div className="relative">
                       <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="companyLinkedIn"
                         placeholder="linkedin.com/company/acme"
                         className="h-12 pl-11 rounded-xl"
                         value={formData.companyLinkedIn}
                         onChange={(e) => setFormData({ ...formData, companyLinkedIn: e.target.value })}
                       />
                     </div>
                   </div>
                 </div>
 
                 <div className="space-y-3">
                   <Label>Office Locations *</Label>
                   <p className="text-sm text-muted-foreground">Select all locations where you hire</p>
                   <div className="flex flex-wrap gap-2">
                     {OFFICE_LOCATIONS.map((location) => (
                       <button
                         key={location}
                         type="button"
                         onClick={() => toggleLocation(location)}
                         className={`pill-button ${
                           formData.officeLocations.includes(location)
                             ? 'pill-button-active'
                             : 'pill-button-inactive'
                         }`}
                       >
                         <MapPin className="inline-block w-3.5 h-3.5 mr-1.5" />
                         {location}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
             )}
 
             {/* Step 2: Personal Details */}
             {step === 2 && (
               <div className="space-y-6 animate-fade-in">
                 <div className="mb-8">
                   <h2 className="text-3xl font-bold text-foreground">Your Profile</h2>
                   <p className="text-muted-foreground mt-2">Tell us about yourself</p>
                 </div>
 
                 <div className="space-y-2">
                   <Label htmlFor="hirerName">Your Name *</Label>
                   <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                       id="hirerName"
                       placeholder="John Smith"
                       className="h-12 pl-11 rounded-xl"
                       value={formData.hirerName}
                       onChange={(e) => setFormData({ ...formData, hirerName: e.target.value })}
                     />
                   </div>
                 </div>
 
                 <div className="space-y-2">
                   <Label htmlFor="hirerTitle">Your Title *</Label>
                   <div className="relative">
                     <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                       id="hirerTitle"
                       placeholder="Head of Talent"
                       className="h-12 pl-11 rounded-xl"
                       value={formData.hirerTitle}
                       onChange={(e) => setFormData({ ...formData, hirerTitle: e.target.value })}
                     />
                   </div>
                 </div>
 
                 <div className="space-y-2">
                   <Label htmlFor="email">Work Email *</Label>
                   <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                       id="email"
                       type="email"
                       placeholder="john@acme.com"
                       className="h-12 pl-11 rounded-xl"
                       value={formData.email}
                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                     />
                   </div>
                 </div>
               </div>
             )}
 
             {/* Step 3: Password */}
             {step === 3 && (
               <div className="space-y-6 animate-fade-in">
                 <div className="mb-8">
                   <h2 className="text-3xl font-bold text-foreground">Set Your Password</h2>
                   <p className="text-muted-foreground mt-2">Create a secure password for your account</p>
                 </div>
 
                 <div className="space-y-2">
                   <Label htmlFor="password">Password *</Label>
                   <div className="relative">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                       id="password"
                       type={showPassword ? 'text' : 'password'}
                       placeholder="Minimum 8 characters"
                       className="h-12 pl-11 pr-11 rounded-xl"
                       value={formData.password}
                       onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                     />
                     <button
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                     >
                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                     </button>
                   </div>
                   {/* Password strength indicator */}
                   {formData.password && (
                     <div className="flex items-center gap-2 mt-2">
                       <div className="flex gap-1 flex-1">
                         {[1, 2, 3].map((level) => (
                           <div
                             key={level}
                             className={`h-1.5 flex-1 rounded-full transition-all ${
                               passwordStrength.strength >= level
                                 ? level === 1 ? 'bg-destructive' : level === 2 ? 'bg-warning' : 'bg-success'
                                 : 'bg-border'
                             }`}
                           />
                         ))}
                       </div>
                       <span className={`text-xs font-medium ${
                         passwordStrength.strength === 1 ? 'text-destructive' :
                         passwordStrength.strength === 2 ? 'text-warning' : 'text-success'
                       }`}>
                         {passwordStrength.label}
                       </span>
                     </div>
                   )}
                 </div>
 
                 <div className="space-y-2">
                   <Label htmlFor="confirmPassword">Confirm Password *</Label>
                   <div className="relative">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                       id="confirmPassword"
                       type={showConfirmPassword ? 'text' : 'password'}
                       placeholder="Confirm your password"
                       className="h-12 pl-11 pr-11 rounded-xl"
                       value={formData.confirmPassword}
                       onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                     />
                     <button
                       type="button"
                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                       className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                     >
                       {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                     </button>
                   </div>
                 </div>
               </div>
             )}
 
             {/* Navigation Buttons */}
             <div className="flex gap-4 pt-6">
               {step > 1 && (
                 <Button
                   type="button"
                   variant="outline"
                   onClick={() => setStep(step - 1)}
                   className="h-12 px-6 rounded-xl"
                 >
                   <ChevronLeft className="w-4 h-4 mr-1" />
                   Back
                 </Button>
               )}
               {step < 3 ? (
                 <Button type="button" onClick={handleNext} className="flex-1 h-12 rounded-xl font-semibold">
                   Continue
                   <ArrowRight className="w-4 h-4 ml-2" />
                 </Button>
               ) : (
                 <Button type="submit" className="flex-1 h-12 rounded-xl font-semibold" disabled={isLoading}>
                   {isLoading ? 'Creating account...' : 'Create Account'}
                   {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                 </Button>
               )}
             </div>
           </form>
 
           <p className="mt-10 text-center text-muted-foreground">
             Already have an account?{' '}
             <Link to="/login" className="text-primary font-semibold hover:underline">
               Sign in
             </Link>
           </p>
         </div>
       </div>
     </div>
   );
 }
