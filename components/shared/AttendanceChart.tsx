
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Matematika', Hadir: 95, "Tidak Hadir": 5 },
  { name: 'Fisika', Hadir: 88, "Tidak Hadir": 12 },
  { name: 'Sejarah', Hadir: 98, "Tidak Hadir": 2 },
  { name: 'Biologi', Hadir: 91, "Tidak Hadir": 9 },
  { name: 'Kimia', Hadir: 85, "Tidak Hadir": 15 },
];

const AttendanceChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis unit="%" tick={{ fontSize: 12 }} />
        <Tooltip
          cursor={{ fill: 'rgba(219, 234, 254, 0.5)' }}
          contentStyle={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            fontSize: '0.875rem'
          }}
        />
        <Legend wrapperStyle={{ fontSize: '0.875rem', paddingTop: '1rem' }} />
        <Bar dataKey="Hadir" fill="#3b82f6" stackId="a" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Tidak Hadir" fill="#ef4444" stackId="a" radius={[0, 0, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;
