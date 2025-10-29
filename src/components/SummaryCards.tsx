import React from 'react';
import type { Scenario } from '../types';
import { calculateSummaryMetrics } from '../utils/calculations';
import { TrendingUp, Users, DollarSign } from 'lucide-react';

interface SummaryCardsProps {
  scenario: Scenario;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ scenario }) => {
  const metrics = calculateSummaryMetrics(scenario.monthlyData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl shadow-2xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50 animate-slide-up">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">Total Disbursals</p>
              <p className="text-4xl font-extrabold tracking-tight">₹{metrics.totalDisbursals} Cr</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <TrendingUp className="w-4 h-4" />
            <span>Across all months</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 to-blue-500"></div>
      </div>

      <div className="group relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 rounded-2xl shadow-2xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-green-500/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">Final Cumulative Users</p>
              <p className="text-4xl font-extrabold tracking-tight">{metrics.finalCumulativeUsers.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Users className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <TrendingUp className="w-4 h-4" />
            <span>Total user base</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 to-emerald-500"></div>
      </div>

      <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 via-pink-600 to-rose-700 rounded-2xl shadow-2xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">Avg Monthly Disbursal</p>
              <p className="text-4xl font-extrabold tracking-tight">₹{metrics.avgMonthlyDisbursal} Cr</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <TrendingUp className="w-4 h-4" />
            <span>Per month average</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-300 to-pink-500"></div>
      </div>
    </div>
  );
};
