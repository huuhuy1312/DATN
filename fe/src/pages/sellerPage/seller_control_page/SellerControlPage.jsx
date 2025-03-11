import React, { useEffect, useState } from 'react';
import './SellerControlPage.css';
import { useNavigate } from 'react-router-dom';
import SellerControlPageHeader from './components/SellerControlPageHeader';
import SellerControlPageCharts from './components/SellerControlPageCharts';
import SellerControlPageTables from './components/SellerControlPageTables';
import orderlineService from '../../../services/orderline.service';
import productService from '../../../services/product.service';
const SellerControlPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [userInfo,setUserInfo] = useState(null);
  const [orderLinesAndCustomerList,setOrderLineAndCustomerList] = useState(null);
  const [listProduct,setListProduct] = useState([]);
  const getListProduct = async () =>{
    const productList = await productService.findBySellerId(user?.id);
    setListProduct(productList);
  }
  const countProductsWithLowQuantity = listProduct.filter(product =>
    product.typeOfProducts.some(type => type.quantity < 10)
  ).length;
  const getOrderLineAndCustomerList = async () => {
    const response = await orderlineService.getOrderLinesAndCustomerOfSeller(user?.id);
    console.log(response?.orderLines);
    let totalAmount = 0;
    response.orderLines.forEach(orderLine => {
      let orderLineTotal = 0;
      orderLine.items.forEach(item => {
        orderLineTotal += (item?.price || 0) * (item.quantity || 0);
      });
      totalAmount += orderLineTotal;
      orderLine.totalAmount = orderLineTotal; 
    });
    response.totalAmount = totalAmount;
    setOrderLineAndCustomerList(response);
  };
  useEffect(()=>{
      
      if(user){
          setUserInfo(user);
          console.log(user?.id)

      }else{
          navigate("/register")
      }
      getOrderLineAndCustomerList();
      getListProduct();
  },[])
  useEffect(() => {
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const updateClock = () => {
    const today = new Date();
    const weekday = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const day = weekday[today.getDay()];
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const h = today.getHours();
    const m = String(today.getMinutes()).padStart(2, '0');
    const s = String(today.getSeconds()).padStart(2, '0');
    document.getElementById("clock").innerHTML = `${day}, ${dd}/${mm}/${yyyy} - ${h} giờ ${m} phút ${s} giây`;
  };

  return (
    <div className="scp-dashboard-app">
      <SellerControlPageHeader />
      <main className="scp-dashboard">
        <section className="scp-widgets">
          <div className="scp-widget">
            <div className= "scp-icon">
              <img  src='/sellerControlPageImg/icon_customer.png'></img>
            </div>
            <div className="scp-widget-info">
              <h4>TỔNG KHÁCH HÀNG</h4>
              <p><strong>{orderLinesAndCustomerList?.customers.length} khách hàng</strong></p>
              <p>Tổng số khách hàng được quản lý.</p>
            </div>
          </div>
          <div className="scp-widget">
            <div className= "scp-icon">
              <img  src='/sellerControlPageImg/icon_product.png'></img>
            </div>
            <div className="scp-widget-info">
              <h4>TỔNG SẢN PHẨM</h4>
              <p><strong>{listProduct.length} sản phẩm</strong></p>
              <p>Tổng số sản phẩm được quản lý.</p>
            </div>
          </div>
          <div className="scp-widget">
            <div className= "scp-icon">
              <img  src='/sellerControlPageImg/icon_order.png'></img>
            </div>
            <div className="scp-widget-info">
              <h4>TỔNG ĐƠN HÀNG</h4>
              <p><strong>{orderLinesAndCustomerList?.orderLines.length} đơn hàng</strong></p>
              <p>Tổng số đơn hàng trong tháng.</p>
            </div>
          </div>
          <div className="scp-widget">
            <div className= "scp-icon">
              <img  src='/sellerControlPageImg/icon_notice.png'></img>
            </div>
            <div className="scp-widget-info">
              <h4>SẮP HẾT HÀNG</h4>
              <p><strong>{countProductsWithLowQuantity} sản phẩm</strong></p>
              <p>Số sản phẩm sắp hết hàng.</p>
            </div>
          </div>
        </section>
        {orderLinesAndCustomerList && <SellerControlPageCharts orderLines={orderLinesAndCustomerList?.orderLines}/>}
        {orderLinesAndCustomerList && <SellerControlPageTables listOrder={orderLinesAndCustomerList?.orderLines} listCustomer={orderLinesAndCustomerList?.customers}/>}
      </main>
    </div>
  );
};

export default SellerControlPage;
