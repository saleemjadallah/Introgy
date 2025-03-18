
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { NurturingStats } from '@/types/relationship-nurturing';

interface RelationshipStatsChartProps {
  stats: NurturingStats | null;
}

export const RelationshipStatsChart: React.FC<RelationshipStatsChartProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg">
        <p className="text-muted-foreground">No stats available</p>
      </div>
    );
  }

  const { healthyRelationships, needsAttentionCount, overdueCount } = stats;

  const data = [
    { name: 'Healthy', value: healthyRelationships, color: '#4ade80' },
    { name: 'Needs Attention', value: needsAttentionCount, color: '#fb923c' },
    { name: 'Overdue', value: overdueCount, color: '#f87171' },
  ].filter(item => item.value > 0);

  // If no data with positive values, show empty state
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg">
        <p className="text-muted-foreground">No relationship data to display</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 bg-white rounded-lg shadow-sm p-2">
      <h3 className="text-sm font-medium mb-1 text-center">Relationship Health</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value} relationships`, 'Count']}
            contentStyle={{
              borderRadius: '0.375rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RelationshipStatsChart;
