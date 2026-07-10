import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#FF5500', '#000000', '#333333', '#666666', '#999999'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-vexor-black p-3 border-[2px] border-white text-white font-mono text-sm shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
        <p className="font-bold mb-1">{payload[0].name}</p>
        <p className="text-vexor-orange">Sold: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const PerformancePieChart = ({ data }) => {
  // Use the top 5 products data for the pie chart
  const pieData = data?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  return (
    <div className="bg-white border-[3px] border-vexor-black shadow-[6px_6px_0px_#0A0A0A] p-6 h-[400px] flex flex-col" style={{ borderRadius: 0 }}>
      <h3 className="font-headline text-2xl font-[900] italic uppercase tracking-wider text-vexor-black mb-2">
        SALES SHARE <span className="text-vexor-orange">//</span> TOP 5
      </h3>
      <div className="flex-1 w-full relative min-h-0">
        {!pieData.length ? (
          <div className="absolute inset-0 flex items-center justify-center font-heading font-bold text-secondary text-sm tracking-[0.2em]">NO DATA</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontFamily: 'monospace', fontSize: 11 }}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PerformancePieChart;
