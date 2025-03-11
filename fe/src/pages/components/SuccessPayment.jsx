import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SuccessPayment.css";
import orderService from "../../services/order.service";
import paymentService from "../../services/payment.service";

const SuccessPayment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const hasExecuted = useRef(false); // Dùng useRef để theo dõi xem đã gọi hay chưa

  const saveOrder = async () => {
    try {
      const storedBody = JSON.parse(localStorage.getItem('orderData'));
      if (storedBody) {
        await orderService.addOrder(storedBody);
      }
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const addPayment = async (body) => {
    try {
      await paymentService.addPayment(body);
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };

  useEffect(() => {
    // Chỉ gọi khi chưa gọi trước đó
    if (hasExecuted.current) return;

    const queryParams = new URLSearchParams(window.location.search);
    const amount = queryParams.get('vnp_Amount');
    const bankCode = queryParams.get('vnp_BankCode');

    const storedBody = JSON.parse(localStorage.getItem('orderData'));

    if (storedBody && amount && bankCode) {
      const body = {
        amount: amount / 100, // Chuyển đổi sang đơn vị tiền tệ phù hợp
        bank: bankCode,
        objectId: storedBody.customerId,
        objectName: "Customer",
        purpose: "Thanh toán đơn hàng"
      };

      // Call both functions sequentially, but only once
      addPayment(body);
      saveOrder();

      // Đánh dấu là đã thực thi
      hasExecuted.current = true;
    } else {
      console.error("Missing required data for payment or order");
    }

    setLoading(false); // Hoàn thành quá trình
  }, []); // Empty dependency array ensures this runs only once

  const redirectToLogin = () => {
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="loader_contains">
      {loading ? (
        <div>Loading...</div> // Show loading state until both actions are completed
      ) : (
        <div style={{ margin: "auto", alignItems: "center", display: "flex", flexDirection: "column" }}>
          <img src="/success.png" alt="Success" />
          <div style={{ color: "white", fontSize: 20, width: "100%", textAlign: "center" }}>
            Thanh toán thành công
          </div>
          <button style={{ width: "100%", height: 50, fontSize: 30, marginTop: 30 }} onClick={redirectToLogin}>
            Quay trở lại Trang Chủ
          </button>
        </div>
      )}
    </div>
  );
};

export default SuccessPayment;
