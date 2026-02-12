
import React, { useMemo } from 'react';
import { Trip, BudgetStats } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { WalletIcon, TrendingDownIcon, AlertCircleIcon, DollarSignIcon } from 'lucide-react';

interface BudgetTrackerProps {
  trip: Trip;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ trip }) => {
  const stats = useMemo(() => {
    const categories: Record<string, { planned: number; actual: number }> = {
      attraction: { planned: 0, actual: 0 },
      food: { planned: 0, actual: 0 },
      accommodation: { planned: 0, actual: 0 },
      transport: { planned: 0, actual: 0 },
      custom: { planned: 0, actual: 0 },
    };

    // Aggregate from itinerary
    trip.itinerary.forEach(day => {
      day.activities.forEach(act => {
        categories[act.category].planned += act.estimatedCost;
        categories[act.category].actual += act.actualCost || act.estimatedCost; // fallback to est if actual is 0
      });
    });

    // Add accommodation costs
    trip.accommodations.forEach(acc => {
      categories.accommodation.planned += acc.cost;
      categories.accommodation.actual += acc.cost;
    });

    const data: BudgetStats[] = Object.keys(categories).map(cat => ({
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      planned: categories[cat].planned,
      actual: categories[cat].actual
    }));

    const totalSpent = data.reduce((acc, curr) => acc + curr.actual, 0);
    const totalPlanned = data.reduce((acc, curr) => acc + curr.planned, 0);

    return { data, totalSpent, totalPlanned };
  }, [trip]);

  const remaining = Math.max(0, trip.totalBudget - stats.totalSpent);
  const overspend = stats.totalSpent > trip.totalBudget;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><WalletIcon className="w-5 h-5" /></div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Budget</span>
          </div>
          <div className="text-3xl font-black text-slate-900">${trip.totalBudget}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TrendingDownIcon className="w-5 h-5" /></div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Spent</span>
          </div>
          <div className={`text-3xl font-black ${overspend ? 'text-red-500' : 'text-slate-900'}`}>${stats.totalSpent}</div>
        </div>

        <div className={`p-6 rounded-2xl border shadow-sm transition-colors ${overspend ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${overspend ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {overspend ? <AlertCircleIcon className="w-5 h-5" /> : <DollarSignIcon className="w-5 h-5" />}
            </div>
            <span className={`text-sm font-bold uppercase tracking-wider ${overspend ? 'text-red-600' : 'text-green-600'}`}>
              {overspend ? 'Over Budget' : 'Remaining'}
            </span>
          </div>
          <div className={`text-3xl font-black ${overspend ? 'text-red-600' : 'text-green-600'}`}>
            ${overspend ? (stats.totalSpent - trip.totalBudget).toFixed(0) : remaining.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Spending by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.data.filter(d => d.actual > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="actual"
                >
                  {stats.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Planned vs Actual</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.data} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" width={100} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="planned" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={20} />
                <Bar dataKey="actual" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Budget Breakdown</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Planned</th>
              <th className="px-6 py-3">Actual</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stats.data.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-bold text-slate-700">{row.category}</td>
                <td className="px-6 py-4 text-slate-500">${row.planned.toFixed(0)}</td>
                <td className="px-6 py-4 font-bold text-slate-900">${row.actual.toFixed(0)}</td>
                <td className="px-6 py-4">
                  {row.actual > row.planned && row.planned > 0 ? (
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Over budget</span>
                  ) : row.actual > 0 ? (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">On track</span>
                  ) : (
                    <span className="text-xs font-bold text-slate-300">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetTracker;
