import React, { useState, useEffect } from "react";
import './ManagePayment.css';
import paymentService from "../../services/payment.service";

const ManagePayment = () => {
  // Giả sử đây là dữ liệu được lấy từ API hoặc từ state
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);

  const formatPriceToVND = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Giả sử đây là API để lấy dữ liệu
        const response = await paymentService.all(); // Lấy dữ liệu từ API

        // Phân loại các item trong response thành payments và refunds
        const paymentsData = [];
        const refundsData = [];
        console.log(response)
        response.forEach(item => {
          if (item.isBack) {
            refundsData.push(item); // Nếu isBack = true thì thêm vào refunds
          } else {
            paymentsData.push(item); // Ngược lại thì thêm vào payments
          }
        });

        // Cập nhật state
        setPayments(paymentsData);
        setRefunds(refundsData);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchPayments(); // Gọi API khi component mount
  }, []); // Chạy một lần khi component mount

  return (
    <div className="container">
      <h2>Các Giao Dịch Thanh Toán</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Số Tiền</th>
            <th>Ngân Hàng</th>
            <th>Số Tài Khoản</th>
            <th>Ngày Tạo</th>
            <th>Mục Đích</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{formatPriceToVND(payment.amount)}</td>
              <td>{payment.bank}</td>
              <td>{payment.accountNumber}</td>
              <td>{payment.createdDate}</td>
              <td>{payment.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Các Giao Dịch Hoàn Tiền</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Số Tiền</th>
            <th>Ngân Hàng</th>
            <th>Số Tài Khoản</th>
            <th>Ngày Tạo</th>
            <th>Lý Do Hoàn Tiền</th>
          </tr>
        </thead>
        <tbody>
          {refunds.map(refund => (
            <tr key={refund.id}>
              <td>{refund.id}</td>
              <td>{formatPriceToVND(refund.amount)}</td>
              <td>{refund.bank}</td>
              <td>{refund.accountNumber}</td>
              <td>{refund.createdDate}</td>
              <td>{refund.reasonBack}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagePayment;
