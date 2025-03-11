import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const SellerControlPageCharts = ({ orderLines }) => {
  const lineChartRef = useRef(null); // Reference for the line chart
  const barChartRef = useRef(null); // Reference for the bar chart

  // State for date range and shift filter
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [shift, setShift] = useState('morning'); // 'morning', 'afternoon', or 'night'

  // Set default start and end date when the component mounts
  useEffect(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 7); // Set start date to 7 days ago

    setStartDate(start.toISOString().split('T')[0]); // Format date as 'YYYY-MM-DD'
    setEndDate(today.toISOString().split('T')[0]); // Set end date to today
  }, []);

  function calculateFilteredTotals(orderLines, startDate, endDate, shift) {
    const totals = {};

    orderLines.forEach(order => {
      const orderDate = new Date(order.createdAt);
      
      // Filter orders by the selected date range
      if ((startDate && orderDate < new Date(startDate)) || (endDate && orderDate > new Date(endDate))) {
        return;
      }

      // Determine shift (morning, afternoon, or night)
      const hour = orderDate.getHours();
      if (shift === 'morning' && (hour < 8 || hour >= 12)) {
        return;
      }
      if (shift === 'afternoon' && (hour < 12 || hour >= 16)) {  // Fixed the time range for afternoon
        return;
      }
      if (shift === 'night' && (hour < 16 || hour >= 20)) {  // Night shift from 4:00 PM to 8:00 PM
        return;
      }

      const label = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}-${orderDate.getDate()} ${hour}:00`;

      if (!totals[label]) {
        totals[label] = { price: 0, cost: 0 };
      }

      order.items.forEach(item => {
        totals[label].price += item.price;
        totals[label].cost += item.cost;
      });
    });

    return totals;
  }

  const filteredTotals = calculateFilteredTotals(orderLines, startDate, endDate, shift);

  useEffect(() => {
    // Destroy existing charts if they exist
    if (lineChartRef.current) {
      lineChartRef.current.destroy();
    }
    if (barChartRef.current) {
      barChartRef.current.destroy();
    }

    // Prepare dynamic data for charts
    const labels = Object.keys(filteredTotals);
    const priceData = labels.map(label => filteredTotals[label].price);
    const costData = labels.map(label => filteredTotals[label].cost);

    // Calculate the maximum value for scaling the Y-axis of the line chart only
    let maxPrice = Math.max(...priceData);
    const maxCost = Math.max(...costData);
    let maxYValue = Math.max(maxPrice, maxCost);
    const stepSize = maxYValue / 10;
    maxYValue += stepSize;

    const data = {
      labels,
      datasets: [
        {
          label: "Price",
          data: priceData,
          backgroundColor: "rgba(255, 193, 7, 0.5)",
          borderColor: "#ffc107",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Cost",
          data: costData,
          backgroundColor: "rgba(0, 123, 255, 0.5)",
          borderColor: "#007bff",
          fill: true,
          tension: 0.4,
        }
      ]
    };

    // Chart options for the line chart (with custom Y-axis settings)
    const lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: maxYValue,
          ticks: {
            stepSize: stepSize,
          },
        },
      },
    };

    // Chart options for the bar chart (default Y-axis behavior)
    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    // Create the line chart
    lineChartRef.current = new Chart(document.getElementById("lineChart"), {
      type: "line",
      data,
      options: lineChartOptions,
    });

    // Create the bar chart
    barChartRef.current = new Chart(document.getElementById("barChart"), {
      type: "bar",
      data,
      options: barChartOptions,
    });

    // Cleanup function to destroy charts when component unmounts
    return () => {
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
    };
  }, [orderLines, startDate, endDate, shift]); // Depend on orderLines and filters to re-render charts

  return (
    <section className="scp-charts">
      <div>
        <label>Ngày bắt đầu:</label>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          style={{width:"auto"}}
          max={endDate} // Set MaxDate based on endDate
        />
        <label>Ca làm:</label>
        <select value={shift} onChange={(e) => setShift(e.target.value)}>
          <option value="morning">Ca sáng (8:00 - 12:00)</option>
          <option value="afternoon">Ca chiều (12:00 - 16:00)</option>
          <option value="night">Ca tối (16:00 - 20:00)</option> {/* Thêm ca tối */}
        </select>
      </div>

      <div>
        <label>Ngày kết thúc:</label>
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          min={startDate} // Set MinDate based on startDate
          max={new Date().toISOString().split('T')[0]} // Set MaxDate to today
        />
      </div>

      <div className="scp-chart-container">
        <h3>Doanh thu cho {shift === 'morning' ? 'Ca sáng' : shift === 'afternoon' ? 'Ca chiều' : 'Ca tối'}</h3>
        <canvas className="scpc-chart" id="barChart"></canvas>
      </div>
    </section>
  );
};

export default SellerControlPageCharts;
