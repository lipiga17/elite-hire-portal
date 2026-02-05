 import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
 
 export default function MetricCard({ 
   title, 
   value, 
   icon: Icon, 
   trend, 
   trendValue, 
   variant = 'default' 
 }) {
   const getTrendIcon = () => {
     if (!trend) return null;
     if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5" />;
     if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5" />;
     return <Minus className="w-3.5 h-3.5" />;
   };
 
   const getTrendStyles = () => {
     if (!trend) return '';
     if (trend === 'up') return 'text-emerald-600 bg-emerald-50';
     if (trend === 'down') return 'text-red-600 bg-red-50';
     return 'text-muted-foreground bg-muted';
   };
 
   return (
     <div className="metric-card group">
       <div className="flex items-start justify-between gap-4">
         <div className="space-y-3">
           <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
           <p className="text-4xl font-bold text-foreground tabular-nums">{value}</p>
           {trendValue && (
             <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getTrendStyles()}`}>
               {getTrendIcon()}
               <span>{trendValue}</span>
             </div>
           )}
         </div>
         {Icon && (
           <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
             <Icon className="w-6 h-6 text-primary" />
           </div>
         )}
       </div>
     </div>
   );
 }
