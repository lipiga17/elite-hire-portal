 import { useState } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import { useAuth } from '../contexts/AuthContext';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
 import straatixLogo from '@/assets/straatix-logo.jpg';
 
 export default function Login() {
   const navigate = useNavigate();
   const { login } = useAuth();
   const [formData, setFormData] = useState({ email: '', password: '' });
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState('');
   const [isLoading, setIsLoading] = useState(false);
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     setError('');
     setIsLoading(true);
 
     const result = await login(formData.email, formData.password);
     
     if (result.success) {
       navigate('/dashboard');
     } else {
       setError(result.error);
     }
     setIsLoading(false);
   };
 
   return (
     <div className="min-h-screen bg-background flex">
       {/* Left Panel - Premium Branding */}
       <div className="hidden lg:flex lg:w-[45%] bg-gradient-primary relative overflow-hidden">
         {/* Subtle pattern overlay */}
         <div className="absolute inset-0 opacity-5">
           <div className="absolute inset-0" style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
           }} />
         </div>
         
         <div className="relative z-10 flex flex-col justify-between h-full p-12">
           {/* Logo */}
           <div>
             <img 
               src={straatixLogo} 
               alt="Straatix Partners" 
               className="h-10 brightness-0 invert"
             />
           </div>
           
           {/* Hero Content */}
           <div className="text-primary-foreground">
             <h1 className="text-4xl font-bold leading-tight mb-6">
               Enterprise Hiring<br />Excellence
             </h1>
             <p className="text-lg opacity-80 max-w-md leading-relaxed">
               Streamline your executive search and talent acquisition with our 
               consulting-grade platform built for elite organizations.
             </p>
             
             {/* Feature highlights */}
             <div className="mt-10 space-y-4">
               {['Intelligent position management', 'Candidate tracking & analytics', 'Document automation'].map((feature, i) => (
                 <div key={i} className="flex items-center gap-3 opacity-80">
                   <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                   <span className="text-sm">{feature}</span>
                 </div>
               ))}
             </div>
           </div>
 
           {/* Footer */}
           <div className="text-primary-foreground/60 text-sm">
             © {new Date().getFullYear()} Straatix Partners. All rights reserved.
           </div>
         </div>
 
         {/* Decorative gradient orbs */}
         <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
         <div className="absolute top-32 -right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
       </div>
 
       {/* Right Panel - Login Form */}
       <div className="flex-1 flex flex-col justify-center px-8 lg:px-20 xl:px-28">
         <div className="w-full max-w-md mx-auto">
           {/* Mobile Logo */}
           <div className="lg:hidden mb-10">
             <img 
               src={straatixLogo} 
               alt="Straatix Partners" 
               className="h-10"
             />
           </div>
 
           <div className="mb-10">
             <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
             <p className="text-muted-foreground mt-3 text-base">
               Sign in to access your hiring dashboard
             </p>
           </div>
 
           <form onSubmit={handleSubmit} className="space-y-6">
             {error && (
               <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm animate-fade-in">
                 {error}
               </div>
             )}
 
             <div className="space-y-2">
               <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
               <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input
                   id="email"
                   type="email"
                   placeholder="you@company.com"
                   className="h-12 pl-11 rounded-xl"
                   value={formData.email}
                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                   required
                 />
               </div>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="password" className="text-sm font-medium">Password</Label>
               <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input
                   id="password"
                   type={showPassword ? 'text' : 'password'}
                   placeholder="Enter your password"
                   className="h-12 pl-11 pr-11 rounded-xl"
                   value={formData.password}
                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                   required
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                 >
                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                 </button>
               </div>
             </div>
 
             <Button 
               type="submit" 
               className="w-full h-12 rounded-xl text-base font-semibold"
               disabled={isLoading}
             >
               {isLoading ? 'Signing in...' : (
                 <>
                   Sign in
                   <ArrowRight className="w-4 h-4 ml-2" />
                 </>
               )}
             </Button>
           </form>
 
           <p className="mt-10 text-center text-muted-foreground">
             Don't have an account?{' '}
             <Link to="/register" className="text-primary font-semibold hover:underline">
               Register your company
             </Link>
           </p>
         </div>
       </div>
     </div>
   );
 }
