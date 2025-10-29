import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyData, Scenario } from '../types';

interface ChartsProps {
  scenarios: Scenario[];
}

export const Charts: React.FC<ChartsProps> = ({ scenarios }) => {
  // Prepare data for stacked bar chart
  const prepareBarChartData = (monthlyData: MonthlyData[]) => {
    return monthlyData.map((month) => ({
      month: `M${month.month}`,
      newDisbursal: month.disbursalFromNew,
      repeatDisbursal: month.repeatDisbursal,
    }));
  };

  // Prepare data for cumulative users line chart
  const prepareCumulativeData = () => {
    const maxMonths = Math.max(...scenarios.map(s => s.monthlyData.length));
    const data: any[] = [];

    for (let i = 0; i < maxMonths; i++) {
      const dataPoint: any = { month: `M${i + 1}` };
      scenarios.forEach((scenario) => {
        if (scenario.monthlyData[i]) {
          dataPoint[scenario.name] = scenario.monthlyData[i].cumulativeNewUsers;
        }
      });
      data.push(dataPoint);
    }

    return data;
  };

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-8">
      {/* Stacked Bar Charts for each scenario */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 backdrop-blur-sm animate-scale-in hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {scenario.name} - Monthly Disbursals
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prepareBarChartData(scenario.monthlyData)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" label={{ value: 'Cr', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    color: '#f9fafb',
                  }}
                />
                <Legend />
                <Bar dataKey="newDisbursal" stackId="a" fill="#3b82f6" name="New Disbursal" />
                <Bar dataKey="repeatDisbursal" stackId="a" fill="#10b981" name="Repeat Disbursal" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Cumulative Users Line Chart */}
      <div className="bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 backdrop-blur-sm animate-scale-in">
        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Cumulative Users Growth (All Scenarios)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={prepareCumulativeData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                color: '#f9fafb',
              }}
            />
            <Legend />
            {scenarios.map((scenario, idx) => (
              <Line
                key={scenario.id}
                type="monotone"
                dataKey={scenario.name}
                stroke={colors[idx % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
