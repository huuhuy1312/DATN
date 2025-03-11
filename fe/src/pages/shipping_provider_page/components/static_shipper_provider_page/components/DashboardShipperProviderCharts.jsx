import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import orderlineService from '../../../../../services/orderline.service';
import warehouseService from '../../../../../services/warehouse.service';

const DashboardShipperProviderCharts = () => {
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const [listWarehouse,setListWarehouse] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const getMaxDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1); // Giới hạn ngày kết thúc là ngày hiện tại trừ 1
    return date.toISOString().split('T')[0]; // Chuyển đổi ngày thành định dạng "YYYY-MM-DD"
  };

  const maxDate = getMaxDate();
  const getMaxMonth = () => {
    const date = new Date();
    date.setMonth(date.getMonth() ); // Tháng hiện tại trừ 1
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Đảm bảo định dạng "YYYY-MM"
  };

  const maxMonth = getMaxMonth();
  const getAllWarehouse= async ()=>{
    const response = await warehouseService.getAllNoStatic();
    console.log(response.data)
    setListWarehouse(response.data)
    
  }
  // Kho hàng cho từng biểu đồ riêng biệt
  const [selectWarehouseLineChart, setSelectWarehouseLineChart] = useState(user?.id);  // Kho hàng cho biểu đồ đường
  const [selectWarehouseBarChart, setSelectWarehouseBarChart] = useState(null);    // Kho hàng cho biểu đồ cột

  // Các hàm lấy ngày tháng hiện tại
  const getCurrentMonth = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const getStartMonth = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const [selectedStartMonth, setSelectedStartMonth] = useState(getStartMonth());
  const [selectedEndMonth, setSelectedEndMonth] = useState(getCurrentMonth());

  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getStartDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const [selectedStartDate, setSelectedStartDate] = useState(getStartDate());
  const [selectedEndDate, setSelectedEndDate] = useState(getCurrentDate());
  
  const [selectedBarMonth, setSelectedBarMonth] = useState(getCurrentMonth());
  const [orders, setOrders] = useState([]);
  const [statTypeLine, setStatTypeLine] = useState("month"); // Track if user selects 'month' or 'day'
  const [statTypeBar, setStatTypeBar] = useState("month"); // Track if user selects 'month' or 'day'
  useEffect(() => {
    const staticOrderByAdmin = async () => {
      const response = await orderlineService.staticByAdmin();
      console.log(response.data);
      if (response.status === 200) {
        setOrders(response.data);
      }
    };
    staticOrderByAdmin();
    getAllWarehouse();
  }, []);

  // Tính toán tổng doanh thu, lợi nhuận theo tháng hoặc ngày
  const calculateTotals = (orders, type, warehouseId) => {
    const totals = {};
    console.log(warehouseId)
    orders.forEach((order) => {

      // Kiểm tra kho hàng trước khi tính toán
      if (warehouseId && (order?.idDeliveryWarehouse != warehouseId  && order?.idPickupWarehouse != warehouseId)) {
        return; // Nếu kho hàng không khớp, bỏ qua đơn hàng này
      }
      if (order?.status == "Đã hủy"  || order.status == "Chờ xác nhận") {
        return; // Nếu kho hàng không khớp, bỏ qua đơn hàng này
      }
      const period = type === "month" ? order.createdAt.slice(0, 7) : order.createdAt.slice(0, 10);
      if(type == 'month')
      {
        const dateOrder = new Date(period);
        const startMonth = new Date(selectedStartMonth)
        const endMonth = new Date(selectedEndMonth)
        if(dateOrder<startMonth || dateOrder >endMonth)
        {
          return;
        }
      }
      if (!totals[period]) {
        totals[period] = { totalPrice: 0, revenue: 0 };
      }
      totals[period].totalPrice += order.totalPrice;
      totals[period].revenue += order.revenue;
    });
    return totals;
  };
  

  // Tính toán số lượng đơn hàng theo trạng thái và kho hàng
  const calculateStatusCounts = (orders, startDate, endDate, type) => {
    const statusCounts = {};
    orders.forEach((order) => {
      console.log(order?.status)
      const orderDate = type === "month" ? order.createdAt.slice(0, 7) : order.createdAt.slice(0, 10);
      if (type === "day") {
        const orderDateObj = new Date(order.createdAt);
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        
        if (orderDateObj >= startDateObj && orderDateObj <= endDateObj) {
          if (selectWarehouseBarChart == null || order?.idDeliveryWarehouse === selectWarehouseBarChart || order?.idPickupWarehouse === selectWarehouseBarChart) {
            if (!statusCounts[order.status]) {
              statusCounts[order.status] = 0;
            }
            statusCounts[order.status]++;
          }
        }
      } else if (orderDate === selectedBarMonth) {
        if (!statusCounts[order.status]) {
          statusCounts[order.status] = 0;
        }
        if (selectWarehouseBarChart == null || order?.idDeliveryWarehouse === selectWarehouseBarChart || order?.idPickupWarehouse === selectWarehouseBarChart) {
          statusCounts[order.status]++;
        }
      }
    });
    console.log(statusCounts)
    return statusCounts;
  };

  const generateEmptyPeriods = (start, end, type) => {
    const emptyPeriods = {};
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    while (startDate <= endDate) {
      const period = type === "month" 
        ? `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}` 
        : `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
  
      emptyPeriods[period] = { totalPrice: 0, revenue: 0 };
  
      // Nếu là thống kê theo tháng, tăng tháng, nếu là ngày thì tăng 1 ngày
      if (type === "month") {
        startDate.setMonth(startDate.getMonth() + 1);
      } else {
        startDate.setDate(startDate.getDate() + 1);
      }
    }
  
    return emptyPeriods;
  };
  

  const totals = { ...generateEmptyPeriods(statTypeLine === "month" ? selectedStartMonth : selectedStartDate, statTypeLine === "month" ? selectedEndMonth : selectedEndDate, statTypeLine), ...calculateTotals(orders, statTypeLine,selectWarehouseLineChart) };
  const statusCounts = calculateStatusCounts(orders, selectedStartDate, selectedEndDate, statTypeBar);

  useEffect(() => {
    if (lineChartRef.current) {
      lineChartRef.current.destroy();
    }
    if (barChartRef.current) {
      barChartRef.current.destroy();
    }

    const lineChartData = {
      labels: Object.keys(totals),
      datasets: [
        {
          label: "Lợi nhuận",
          data: Object.values(totals).map((data) => data.revenue),
          backgroundColor: "rgba(40, 167, 69, 0.5)",
          borderColor: "#28a745",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Doanh thu",
          data: Object.values(totals).map((data) => data.totalPrice),
          backgroundColor: "rgba(0, 123, 255, 0.5)",
          borderColor: "#007bff",
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const barChartData = {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: "Số lượng đơn hàng",
          data: Object.values(statusCounts),
          backgroundColor: "rgba(255, 193, 7, 0.7)",
        },
      ],
    };

    const lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true },
      },
    };

    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true },
      },
    };

    lineChartRef.current = new Chart(document.getElementById("lineChart"), {
      type: "line",
      data: lineChartData,
      options: lineChartOptions,
    });

    barChartRef.current = new Chart(document.getElementById("barChart"), {
      type: "bar",
      data: barChartData,
      options: barChartOptions,
    });

    return () => {
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
    };
  }, [selectedStartMonth, selectedEndMonth, selectedBarMonth, selectedStartDate, selectedEndDate, selectWarehouseLineChart, selectWarehouseBarChart, statTypeBar,statTypeLine,orders]);

  return (
    <div>
      <section className="scp-charts">
        <div className="scp-chart-container">
          <h3>Biểu đồ đường: Doanh thu theo {statTypeLine === "month" ? "tháng" : "ngày"}</h3>
          <canvas className="scpc-chart" id="lineChart"></canvas>
        </div>
        <div className="scp-chart-controls" style={{width:"15%"}}>
          <label>Chọn kiểu thống kê:</label>
          <select value={statTypeLine} onChange={(e) => setStatTypeLine(e.target.value)}>
            <option value="month">Theo tháng</option>
            <option value="day">Theo ngày</option>
          </select>
          {statTypeLine === "month" ? (
            <>
              <label>Từ tháng:</label>
              <input type="month" max={maxMonth} value={selectedStartMonth} onChange={(e) => setSelectedStartMonth(e.target.value)} />
              <label>Đến tháng:</label>
              <input type="month" max={maxMonth} min={selectedStartMonth}value={selectedEndMonth} onChange={(e) => setSelectedEndMonth(e.target.value)} />
            </>
          ) : (
            <>
              <label>Từ ngày:</label>
              <input type="date" max = {maxDate} value={selectedStartDate} onChange={(e) => setSelectedStartDate(e.target.value)} />
              <label>Đến ngày:</label>
              <input type="date" max={maxDate} min={selectedStartDate}value={selectedEndDate} onChange={(e) => setSelectedEndDate(e.target.value)} />
            </>
          )}
          <label>Chọn kho hàng cho Biểu đồ đường:</label>
          <select value={selectWarehouseLineChart || ""} onChange={(e) => setSelectWarehouseLineChart(e.target.value)}>
            <option value="">Tất cả kho</option>
            {
              listWarehouse.map((item)=>(
                <option value={item?.id}>{item?.name}</option>
              ))
            }
          </select>
        </div>
      </section>

      <section className="scp-charts">
        <div className="scp-chart-container">
          <h3>Biểu đồ cột: Trạng thái đơn hàng</h3>
          <canvas className="scpc-chart" id="barChart"></canvas>
        </div>
        <div className="scp-chart-controls" style={{width:"15%"}}>
          <label>Chọn kiểu thống kê:</label>
          <select value={statTypeBar} onChange={(e) => setStatTypeBar(e.target.value)}>
            <option value="month">Theo tháng</option>
            <option value="day">Theo ngày</option>
          </select>
          <label>Chọn {statTypeBar === "month" ? "tháng" : "ngày"} (biểu đồ cột):</label>
          {statTypeBar === "month" ? (
            <input type="month" value={selectedBarMonth} onChange={(e) => setSelectedBarMonth(e.target.value)} />
          ) : (
            <>
              <input type="date" value={selectedStartDate} onChange={(e) => setSelectedStartDate(e.target.value)} />
              <input type="date" value={selectedEndDate} onChange={(e) => setSelectedEndDate(e.target.value)} />
            </>
          )}
          <label>Chọn kho hàng cho Biểu đồ cột:</label>
          <select value={selectWarehouseBarChart || ""} onChange={(e) => setSelectWarehouseBarChart(e.target.value)}>
            <option value="">Tất cả kho</option>
            {
              listWarehouse.map((item)=>(
                <option value={item?.id}>{item?.name}</option>
              ))
            }
          </select>
        </div>
      </section>
    </div>
  );
};

export default DashboardShipperProviderCharts;
