import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import warehouseService from '../../../../services/warehouse.service';
import orderlineService from '../../../../services/orderline.service';
import productService from '../../../../services/product.service';
import DashboardShipperProviderHeader from './components/DashboardShipperProviderHeader';
import DashboardShipperProviderCharts from './components/DashboardShipperProviderCharts';
import DashboardShipperProviderTables from './components/DashboardShipperProviderTables';
const WarehouseStaticPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [userInfo,setUserInfo] = useState(null);
  const [orderLinesAndCustomerList,setOrderLineAndCustomerList] = useState(null);
  const [listProduct,setListProduct] = useState([]);
  const [info,setInfo] = useState(null);
  const getInfoStatic = async ()=>{
    const response = await warehouseService.getAll();
    console.log(response)
    setInfo(response);
  }
  
  const getListProduct = async () =>{
    const productList = await productService.findBySellerId(user?.id);
    console.log(productList)
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
      getInfoStatic()
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
    <div style={{width:"100%",backgroundColor:"white", paddingTop:"2rem", marginLeft:"2rem"}}>
    <div className="sspp-dashboard-app">
      <DashboardShipperProviderHeader />
      <main className="scp-dashboard">
        <section className="scp-widgets">
          <div className="scp-widget">
            <div className= "scp-icon">
              <img style={{width:85,height:85,borderRadius:5}} src='/sellerControlPageImg/icon_warehouse.png'></img>
            </div>
            <div className="scp-widget-info">
              <h4>TỔNG SỐ KHO HÀNG</h4>
              <p><strong>{info?.warehouses.length || 0} kho hàng</strong></p>
              <p>Tổng số kho đang hoạt động</p>
            </div>
          </div>
          <div className="scp-widget">
            <div className= "scp-icon">
              <img style={{width:85,height:85,borderRadius:5}} src='/sellerControlPageImg/icon_shop.png'></img>
            </div>
            <div className="scp-widget-info">
              <h4>TỔNG SỐ GIAN HÀNG</h4>
              <p><strong>{info?.sellers.length || 0} gian hàng</strong></p>
              <p>Tổng số gian hàng được quản lý.</p>
            </div>
          </div>
          <div className="scp-widget">
            <div className= "scp-icon">
              <img  src='/sellerControlPageImg/icon_order.png'></img>
            </div>
            <div className="scp-widget-info">
              <h4>TỔNG ĐƠN HÀNG</h4>
              <p><strong>{info?.orders?.length || 5} đơn hàng</strong></p>
              <p>Tổng số đơn hàng đã đặt.</p>
            </div>
          </div>
          <div className="scp-widget">
            <div className= "scp-icon">
              <img  src='/sellerControlPageImg/icon_customer.png'></img>
            </div>
            <div className="scp-widget-info">
              <h4>TỔNG SỐ KHÁCH HÀNG</h4>
              <p><strong>{countProductsWithLowQuantity || 0} sản phẩm</strong></p>
              <p>Số sản phẩm sắp hết hàng.</p>
            </div>
          </div>
        </section>
        {orderLinesAndCustomerList && <DashboardShipperProviderCharts orderLines={orderLinesAndCustomerList?.orderLines}/>}
        {orderLinesAndCustomerList && <DashboardShipperProviderTables listOrder={orderLinesAndCustomerList?.orderLines} listCustomer={orderLinesAndCustomerList?.customers}/>} 
      </main>
    </div>
    </div>
  );
};

export default WarehouseStaticPage;
