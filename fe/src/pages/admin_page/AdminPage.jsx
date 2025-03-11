import React, { useEffect, useState } from "react";
import '../shipping_provider_page/ShippingProviderPage.css';
import SidebarAdmin from "./SideBarAdmin";
import { useNavigate } from 'react-router-dom';
import MainContent from "../shipping_provider_page/components/MainContent";
import StaticShipperProviderPage from "../shipping_provider_page/components/static_shipper_provider_page/StaticShipperProviderPage";
import ManageWarehouse from "../shipping_provider_page/components/manage_warehouse/ManageWarehouse";
import ManageSeller from "../shipping_provider_page/components/manage_seller/ManageSeller";
import ManageVoucher from "../shipping_provider_page/components/manage_voucher/ManageVoucher";
import ManageCategory from "../shipping_provider_page/components/manage_category/ManageCategory";
import { use } from "react";
import ManagePayment from "./ManagePayment";
import SendNotification from "./SendNotification";

function AdminPage() {
  const navigate = useNavigate();
  const [content,setContent] = useState("Dashboard");
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if(user?.role != "ROLE_ADMIN"){
      navigate("/register")
    }
  },[])
  return (
    <div className="spp-container">
      <SidebarAdmin content = {content} setContent = {setContent}/>
      {content == "OperationsManagement" &&<MainContent />}
      {content == "Dashboard" && <StaticShipperProviderPage/>}
      {content == "ManageWarehouse" && <ManageWarehouse/>}
      {content == "ManageSeller" && <ManageSeller/>}
      {content == "ManageVoucher" && <ManageVoucher/>}
      {content == "ManageCategory" && <ManageCategory/>}
      {content == "ManagePayment" && <ManagePayment/>}
      {content == "SendNotification" && <SendNotification/>}
    </div>
  );
}

export default AdminPage;
