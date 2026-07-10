import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-vexor-black p-3 border-[2px] border-white text-white font-mono text-sm">
        <p className="font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: ৳{entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RevenueChart = ({ data }) => {
  const [showProfit, setShowProfit] = useState(false);

  return (
    <div className="bg-white border-[3px] border-vexor-black shadow-[6px_6px_0px_#0A0A0A] p-6 h-[400px] flex flex-col" style={{ borderRadius: 0 }}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline text-2xl font-[900] italic uppercase tracking-wider text-vexor-black">
          REVENUE OVERVIEW <span className="text-vexor-orange">//</span>
        </h3>
        <button
          onClick={() => setShowProfit(!showProfit)}
          className={`px-4 py-2 font-heading text-xs font-bold uppercase transition-colors border-[2px] border-vexor-black ${
            showProfit ? 'bg-vexor-orange text-white' : 'bg-white text-vexor-black hover:bg-neutral'
          }`}
        >
          {showProfit ? 'Hide Profit' : 'Show Profit'}
        </button>
      </div>

      <div className="flex-1 w-full relative min-h-0">
        {!data || data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center font-heading font-bold text-secondary text-sm tracking-[0.2em]">NO DATA</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
              <XAxis 
                dataKey="_id" 
                tick={{ fontFamily: 'monospace', fontSize: 10, fill: '#666' }}
                tickMargin={10}
                axisLine={{ stroke: '#000', strokeWidth: 2 }}
              />
              <YAxis 
                tick={{ fontFamily: 'monospace', fontSize: 10, fill: '#666' }}
                tickFormatter={(val) => `৳${val.toLocaleString()}`}
                axisLine={{ stroke: '#000', strokeWidth: 2 }}
                tickMargin={10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: 12, paddingTop: '20px' }} />
              
              <Line 
                type="monotone" 
                dataKey="sales" 
                name="Sales" 
                stroke="#000000" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 6 }}
              />
              
              {showProfit && (
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  name="Profit" 
                  stroke="#FF5500" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2 }} 
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
