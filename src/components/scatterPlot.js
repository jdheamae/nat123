// ScatterPlot.js
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ScatterPlot = ({ natData }) => {
  // Assuming natData contains `academicPerformance`, `natResults`, and `respondentName`
  const scatterData = natData.map(item => ({
    academic_perfromance: Math.max(70, Math.min(100, item.academic_perfromance)),
    nat_result: item.nat_result,
    respondent: item.respondent,
  }));

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center', // Center vertically if needed
      height: '100%', // Ensure it has height to align items
      flexDirection: 'column', // Add column direction to position title above the chart
    },
    title: {
      marginBottom: '20px', // Add some space below the title
      fontSize: '20px',
      fontWeight: 'bold',
    },
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ccc' }}>
          <p><strong>Respondent:</strong> {payload[0].payload.respondent}</p>
          <p><strong>Academic Performance:</strong> {payload[0].payload.academic_perfromance}</p>
          <p><strong>NAT Results:</strong> {payload[0].payload.nat_result}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.container}>
        <div style={styles.title}>Correlation between Academic Performance and NAT Results</div>
      <ResponsiveContainer width="80%" height={400}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="academic_perfromance"
            name="Academic Performance"
            domain={[70, 90]} // Set the domain to 70 - 100
            label={{ value: 'Academic Performance', position: 'bottom', offset: -5 }} // Label for X-axis
          />
          <YAxis
            type="number"
            dataKey="nat_result"
            name="NAT Results"
            label={{ value: 'NAT Results', angle: -90, position: 'insideLeft', offset: 10 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="Data Points" data={scatterData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlot;
