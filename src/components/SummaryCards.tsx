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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Total Disbursals</p>
            <p className="text-3xl font-bold">₹{metrics.totalDisbursals} Cr</p>
          </div>
          <DollarSign className="w-12 h-12 opacity-80" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Final Cumulative Users</p>
            <p className="text-3xl font-bold">{metrics.finalCumulativeUsers.toLocaleString()}</p>
          </div>
          <Users className="w-12 h-12 opacity-80" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Avg Monthly Disbursal</p>
            <p className="text-3xl font-bold">₹{metrics.avgMonthlyDisbursal} Cr</p>
          </div>
          <TrendingUp className="w-12 h-12 opacity-80" />
        </div>
      </div>
    </div>
  );
};
