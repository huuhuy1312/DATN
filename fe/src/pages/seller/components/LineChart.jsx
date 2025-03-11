// import React, { useEffect, useRef } from 'react';
// import { Chart } from 'chart.js';

// const LineChart = () => {
//     const chartRef = useRef(null);

//     useEffect(() => {
//         const ctx = chartRef.current.getContext('2d');

//         new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//                 datasets: [
//                     {
//                         label: 'My First Dataset',
//                         borderColor: 'rgb(75, 192, 192)',
//                         data: [65, 59, 80, 81, 56, 55, 40],
//                     },
//                 ],
//             },
//         });
//     }, []);

//     return (
//         <div>
//             <canvas ref={chartRef} width="400" height="200"></canvas>
//         </div>
//     );
// };

// export default LineChart;
