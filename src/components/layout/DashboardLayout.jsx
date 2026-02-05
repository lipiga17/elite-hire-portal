 import { Link, useLocation, useNavigate } from 'react-router-dom';
 import { useAuth } from '@/contexts/AuthContext';
 import { 
   LayoutDashboard, Briefcase, Users, User, LogOut, 
   ChevronRight, Menu, X, Settings
 } from 'lucide-react';
 import { useState } from 'react';
 import straatixLogo from '@/assets/straatix-logo.jpg';
 
 const navItems = [
   { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
   { path: '/positions', icon: Briefcase, label: 'Positions' },
   { path: '/candidates', icon: Users, label: 'Candidates' },
   { path: '/profile', icon: User, label: 'Profile' },
 ];
 
 export default function DashboardLayout({ children }) {
   const location = useLocation();
   const navigate = useNavigate();
   const { user, logout } = useAuth();
   const [sidebarOpen, setSidebarOpen] = useState(false);
 
   const handleLogout = () => {
     logout();
     navigate('/login');
   };
 
   const isActive = (path) => {
     if (path === '/dashboard') return location.pathname === '/dashboard';
     return location.pathname.startsWith(path);
   };
 
   return (
     <div className="min-h-screen bg-background flex">
       {/* Mobile Header */}
       <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-5 z-50 shadow-sm">
         <img src={straatixLogo} alt="Straatix" className="h-8" />
         <button 
           onClick={() => setSidebarOpen(!sidebarOpen)}
           className="p-2.5 hover:bg-accent rounded-xl transition-colors"
         >
           {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
         </button>
       </div>
 
       {/* Sidebar Overlay */}
       {sidebarOpen && (
         <div 
           className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
           onClick={() => setSidebarOpen(false)}
         />
       )}
 
       {/* Premium Sidebar */}
       <aside className={`
         fixed lg:static inset-y-0 left-0 z-40
         w-72 bg-gradient-primary text-sidebar-foreground
         transform transition-transform duration-300 ease-in-out
         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
         flex flex-col
       `}>
         {/* Logo Section */}
         <div className="h-20 flex items-center px-7 border-b border-white/10">
           <img 
             src={straatixLogo} 
             alt="Straatix Partners" 
             className="h-9 brightness-0 invert"
           />
         </div>
 
         {/* Navigation */}
         <nav className="flex-1 py-8 px-4 space-y-2">
           <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-white/40 mb-4">Menu</p>
           {navItems.map((item) => {
             const Icon = item.icon;
             const active = isActive(item.path);
             return (
               <Link
                 key={item.path}
                 to={item.path}
                 onClick={() => setSidebarOpen(false)}
                 className={`
                   flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold
                   transition-all duration-200
                   ${active 
                     ? 'bg-white/15 text-white shadow-lg shadow-black/10' 
                     : 'text-white/70 hover:bg-white/10 hover:text-white'
                   }
                 `}
               >
                 <Icon className="w-5 h-5" />
                 <span>{item.label}</span>
                 {active && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
               </Link>
             );
           })}
         </nav>
 
         {/* User Profile & Logout */}
         <div className="p-5 border-t border-white/10">
           {/* User Card */}
           <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 mb-4">
             {user?.companyLogoPreview ? (
               <img 
                 src={user.companyLogoPreview} 
                 alt="Company" 
                 className="w-11 h-11 rounded-lg object-cover border border-white/10"
               />
             ) : (
               <div className="w-11 h-11 rounded-lg bg-white/15 flex items-center justify-center text-sm font-bold">
                 {user?.hirerName?.charAt(0) || 'U'}
               </div>
             )}
             <div className="flex-1 min-w-0">
               <p className="text-sm font-semibold truncate text-white">{user?.hirerName || 'User'}</p>
               <p className="text-xs text-white/50 truncate">{user?.companyName || 'Company'}</p>
             </div>
           </div>
 
           {/* Sign Out Button */}
           <button
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
               text-white/60 hover:bg-red-500/15 hover:text-red-300
               transition-all duration-200"
           >
             <LogOut className="w-5 h-5" />
             <span>Sign out</span>
           </button>
         </div>
       </aside>
 
       {/* Main Content */}
       <main className="flex-1 lg:ml-0 pt-16 lg:pt-0 min-h-screen overflow-x-hidden">
         <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
           {children}
         </div>
       </main>
     </div>
   );
 }
