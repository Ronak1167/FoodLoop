import React from 'react';
import { Leaf, Cpu, Award } from 'lucide-react';

export default function SDGBadge({ goal = '12', size = 'md' }) {
  if (goal === '12') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs md:text-sm'
      }`}>
        <Leaf className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-emerald-600`} />
        <span>SDG 12: Responsible Consumption</span>
      </span>
    );
  }

  if (goal === '9') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-teal-100 text-teal-800 border border-teal-200 ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs md:text-sm'
      }`}>
        <Cpu className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-teal-600`} />
        <span>SDG 9: Sustainable Innovation</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 text-xs">
      <Award className="w-3.5 h-3.5 text-amber-600" />
      <span>Certified Green Partner</span>
    </span>
  );
}
