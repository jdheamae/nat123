import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './stackbar.css'; // Import CSS for styling the tooltip

const StackedBarChart = ({ natData }) => {
  const svgRef = useRef();
  const tooltipRef = useRef(); // Create a ref for the tooltip
  const [activeSex, setActiveSex] = useState(null); // State to track the active sex

  useEffect(() => {
    if (natData.length > 0) {
      drawStackedBarChart();
    }
  }, [natData, activeSex]); // Re-draw when activeSex changes

  const drawStackedBarChart = () => {
    const filteredData = activeSex
      ? natData.filter(d => d.sex === activeSex)
      : natData;

    const data = d3.groups(filteredData, d => d.socio_economic_status)
      .map(([key, values]) => ({
        socio_economic_status: key,
        habits: d3.rollup(values, v => v.length, d => d.study_habit),
      }));

    const habitsArray = data.map(d => ({
      socio_economic_status: d.socio_economic_status,
      habits: Array.from(d.habits.entries()).map(([habit, count]) => ({ habit, count })),
    }));

    const width = 1000;
    const height = 400;
    const margin = { top: 20, right: 50, bottom: 80, left: 300 }; // Increased bottom margin

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    svg.selectAll("*").remove();

    const x0 = d3.scaleBand()
      .domain(habitsArray.map(d => d.socio_economic_status))
      .range([margin.left, width - margin.right])
      .paddingInner(0.1);

    const habitsNames = [...new Set(filteredData.map(d => d.study_habit))];
    const x1 = d3.scaleBand()
      .domain(habitsNames)
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(habitsArray, d => d3.sum(d.habits, h => h.count))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(habitsNames);

    const groups = svg.append("g")
      .selectAll("g")
      .data(habitsArray)
      .enter().append("g")
      .attr("transform", d => `translate(${x0(d.socio_economic_status)}, 0)`);

    groups.selectAll("rect")
      .data(d => d.habits)
      .enter().append("rect")
      .attr("x", d => x1(d.habit))
      .attr("y", d => y(d.count))
      .attr("height", d => y(0) - y(d.count))
      .attr("width", x1.bandwidth())
      .attr("fill", d => color(d.habit))
      .on("mouseover", (event, d) => {
        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style("opacity", 1)
          .html(`Total of Students: ${d.count}<br>Habit: ${d.habit}`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mousemove", (event) => {
        d3.select(tooltipRef.current)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mouseout", () => {
        d3.select(tooltipRef.current).style("opacity", 0);
      });

    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .style("text-anchor", "middle");

    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    svg.append("text")
      .attr("transform", `translate(${width / 2}, ${height - margin.bottom / 2})`)
      .style("text-anchor", "middle")
      .text("Socio-Economic Status");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left / 2)
      .attr("x", -height / 2)
      .style("text-anchor", "middle")
      .text("Number of Students");
  };

  return (
    <>
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef} className="tooltip" style={{ opacity: 0 }}></div> {/* Tooltip div */}
    </>
  );
};

export default StackedBarChart;
