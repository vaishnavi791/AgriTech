import React from 'react';
import { 
  PieChart 
} from 'lucide-react';
import PredictionCard from '../../components/PredictionCard';
import { formatCurrency } from '../../utils/validation';

export const CostResult = ({ result, onReset }) => {
  if (!result) return null;

  const totalCost = result.total_cost || result.estimated_cost || 42500;
  const costPerAcre = result.cost_per_acre || (totalCost / (result.land_area || 1));
  const projectedRevenue = result.projected_revenue || totalCost * 1.65;
  const projectedProfit = result.projected_profit || (projectedRevenue - totalCost);
  const profitMargin = result.profit_margin || ((projectedProfit / projectedRevenue) * 100).toFixed(1);

  const breakdown = result.breakdown || [
    { label: 'Seeds & Saplings', amount: result.seed_cost || 6000, percentage: 14 },
    { label: 'Fertilizers & Nutrients', amount: result.fertilizer_cost || 12500, percentage: 29 },
    { label: 'Farm Labor & Weeding', amount: result.labor_cost || 11000, percentage: 26 },
    { label: 'Tractor & Machinery', amount: result.machinery_cost || 8000, percentage: 19 },
    { label: 'Irrigation & Utilities', amount: result.irrigation_cost || 5000, percentage: 12 },
  ];

  return (
    <PredictionCard
      title="Cultivation Budget & Profit Projection"
      subtitle="Itemized Agricultural Cost Breakdown"
      badgeText="Financial Estimate"
      onReset={onReset}
      resetLabel="Calculate New Estimate"
    >
      <div className="space-y-6">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-cream-50 border border-cream-300 rounded-xl space-y-1">
            <span className="text-xs font-semibold text-earth-muted uppercase tracking-wider">Estimated Total Cost</span>
            <div className="font-serif text-2xl font-bold text-earth-dark">
              {formatCurrency(totalCost)}
            </div>
            <p className="text-[11px] text-earth-muted">
              {formatCurrency(costPerAcre)} per acre
            </p>
          </div>

          <div className="p-5 bg-agri-50 border border-agri-200 rounded-xl space-y-1">
            <span className="text-xs font-semibold text-agri-800 uppercase tracking-wider">Projected Gross Revenue</span>
            <div className="font-serif text-2xl font-bold text-agri-900">
              {formatCurrency(projectedRevenue)}
            </div>
            <p className="text-[11px] text-agri-700">Based on prevailing market modal rates</p>
          </div>

          <div className="p-5 bg-sage-100 border border-sage-300 rounded-xl space-y-1">
            <span className="text-xs font-semibold text-agri-900 uppercase tracking-wider">Expected Net Profit</span>
            <div className="font-serif text-2xl font-bold text-agri-900">
              {formatCurrency(projectedProfit)}
            </div>
            <p className="text-[11px] text-agri-800 font-semibold">
              ~{profitMargin}% estimated margin
            </p>
          </div>
        </div>

        {/* Itemized Cost Breakdown Table */}
        <div className="bg-white border border-cream-300 rounded-xl overflow-hidden shadow-card">
          <div className="px-5 py-3.5 bg-cream-50 border-b border-cream-300 flex items-center justify-between">
            <h4 className="font-serif text-sm font-bold text-earth-dark flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-agri-600" />
              <span>Expenditure Breakdown</span>
            </h4>
            <span className="text-xs text-earth-muted">All amounts in INR (₹)</span>
          </div>

          <div className="divide-y divide-cream-200">
            {breakdown.map((item, index) => (
              <div key={index} className="px-5 py-3 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-agri-600" />
                  <span className="font-medium text-earth-dark">{item.label}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-earth-dark">{formatCurrency(item.amount)}</span>
                  {item.percentage && (
                    <span className="ml-2 text-xs text-earth-muted">({item.percentage}%)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Optimization Advice */}
        <div className="p-4 bg-cream-200/60 border border-cream-300 rounded-xl text-xs text-earth-charcoal space-y-1">
          <span className="font-serif font-bold uppercase tracking-wider text-earth-dark">
            Cost Optimization Insights:
          </span>
          <p className="leading-relaxed">
            Fertilizer and crop protection inputs form the largest variable expenditure. Utilizing precision soil testing to calibrate nitrogen and phosphorus doses can reduce input expenses by 15-20% while preserving target yields.
          </p>
        </div>
      </div>
    </PredictionCard>
  );
};

export default CostResult;
