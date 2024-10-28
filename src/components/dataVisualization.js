// DataVisualization.js
import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Visual from './visual'; // Existing visual component
import ScatterPlot from './scatterPlot'; // Import the ScatterPlot component
import StackedBarChart from './stackBar';



const DataVisualization = () => {
  const [natData, setNatData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const natCollection = collection(db, "natData");
      const natSnapshot = await getDocs(natCollection);
      const dataList = natSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNatData(dataList);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="data-visualization-page">
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <Visual natData={natData} />
          <ScatterPlot natData={natData} /> 
          <StackedBarChart natData={natData} />
          
        </>
      )}
    </div>
  );
};

export default DataVisualization;
