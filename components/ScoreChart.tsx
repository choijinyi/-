import React from 'react';
import { Score } from '../types';

// Since Recharts is loaded from a CDN, we access it via the window object.
// We will destructure it inside the component to avoid race conditions.

interface ScoreChartProps {
  scores: Score[];
  primaryStyle: string;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ scores, primaryStyle }) => {
    const Recharts = (window as any).Recharts;

    if (!Recharts) {
        return <div>Loading Chart...</div>;
    }

    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } = Recharts;

    const chartData = scores.map(s => ({
        name: s.style,
        점수: s.score,
        fullName: s.name,
    }));

  return (
    <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
            <BarChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => [`${value}점`, props.payload.fullName]}
                  cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} 
                />
                <Legend />
                <Bar dataKey="점수">
                {
                    chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === primaryStyle ? '#2563eb' : '#93c5fd'} />
                    ))
                }
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;