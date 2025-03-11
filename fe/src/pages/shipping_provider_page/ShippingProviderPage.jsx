import React, { useEffect, useState } from "react";
import Sidebar from "./components/SideBar";
import MainContent from "./components/MainContent";
import './ShippingProviderPage.css';
import ManageOrderPage from "./components/manage_order_page/ManageOrderPage";
import StaticShipperProviderPage from "./components/static_shipper_provider_page/StaticShipperProviderPage";
import ManageWarehouse from "./components/manage_warehouse/ManageWarehouse";
import ManageSeller from "./components/manage_seller/ManageSeller";
import ManageOrderDeliveryPage from "./components/manage_order_page_delivery/ManageOrderDeliveryPage";
import ManageVoucher from "./components/manage_voucher/ManageVoucher";
import ManageShipper from "./components/manage_shipper/ManageShipper";
import ManageCategory from "./components/manage_category/ManageCategory";
import { useNavigate } from "react-router-dom";
import WarehouseStaticPage from "./components/static_shipper_provider_page/WarehouseStaticPage";

function ShippingProviderPage() {
  const navigate = useNavigate();
  const [content,setContent] = useState("OrdersManagement");
    useEffect(()=>{
      const user = JSON.parse(localStorage.getItem("user"));
      if(user?.role != "ROLE_WAREHOUSE_OWNER"){
        navigate("/register")
      }
    },[])
  return (
    <div className="spp-container">
      <Sidebar content = {content} setContent = {setContent}/>
      {content == "OrdersManagement" &&<ManageOrderPage />}
      {content == "OrdersManagement2" &&<ManageOrderDeliveryPage />}
      {/* {content == "Dashboard" && <WarehouseStaticPage/>} */}
      {content == "ManageShipper" && <ManageShipper/>}
    </div>
  );
}

export default ShippingProviderPage;
