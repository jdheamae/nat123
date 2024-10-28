import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './visual.css';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Visual = ({ natData = [] }) => { // Default to an empty array
  console.log("natData:", natData);
  
  // Prepare data for the age distribution histogram
  const ageData = useMemo(() => {
    return natData.map(data => ({
      age: data.age,
      sex: data.sex
    })).filter(entry => entry.age !== undefined);
  }, [natData]);

  if (ageData.length === 0) {
    return <p>No data available for visualization.</p>;
  }

  const maleDistribution = Array(31).fill(0);
  const femaleDistribution = Array(31).fill(0);

  ageData.forEach(({ age, sex }) => {
    if (age >= 0 && age < 31) {
      if (sex === 'Male') {
        maleDistribution[age] += 1;
      } else if (sex === 'Female') {
        femaleDistribution[age] += 1;
      }
    }
  });

  const chartDataBySex = {
    labels: Array.from({ length: 30 }, (_, i) => i.toString()),
    datasets: [
      {
        label: 'Male',
        data: maleDistribution,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 15, 
        categoryPercentage: 0.7, 
        barPercentage: 0.6, 
      },
      {
        label: 'Female',
        data: femaleDistribution,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        barThickness: 15,
        categoryPercentage: 0.7, 
        barPercentage: 0.6, 
      },
    ],
  };

  return (
    <div className="data-visualization">
      <h3>Age Distribution by Sex</h3>
      <div className="chart-container" style={{ width: '50%', height: '400px' }}>
        <Bar
          data={chartDataBySex}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Age',
                },
                grid: {
                  display: false, // Hide the grid lines if needed
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Number of Respondents',
                },
              },
            },
          }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default Visual;
