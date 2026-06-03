import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const sampleData = [
  { name: 'Week 1', 'Study Hours': 8, 'Quiz Score': 70 },
  { name: 'Week 2', 'Study Hours': 10, 'Quiz Score': 75 },
  { name: 'Week 3', 'Study Hours': 6, 'Quiz Score': 80 },
  { name: 'Week 4', 'Study Hours': 9, 'Quiz Score': 65 }
];

const AnalyticsCharts = () => (
  <div style={{ width: '100%', height: 260 }} className="text-xs font-semibold">
    <ResponsiveContainer>
      <LineChart data={sampleData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
        <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#F2F4EF', border: '1px solid #A8C3A0', borderRadius: '16px' }}
          labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
        />
        <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px', fontSize: '10px' }} />
        <Line 
          type="monotone" 
          dataKey="Study Hours" 
          stroke="#047857" 
          strokeWidth={3} 
          activeDot={{ r: 6 }} 
        />
        <Line 
          type="monotone" 
          dataKey="Quiz Score" 
          stroke="#10B981" 
          strokeWidth={2} 
          activeDot={{ r: 5 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default AnalyticsCharts;
