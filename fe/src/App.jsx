import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthService from "./services/auth.service";
import Home from "./pages/home.component";
import HomePage from "./pages/customer/homePage";
import EventBus from "./common/EventBus";
import ManagerProducts from "./pages/seller/manageProducts";
import ViewDetailsProductPage from "./pages/customer/viewDetailsProductsPage";
import AddProductPage from "./pages/seller/pages/addProductPage";
import EditProductPage from "./pages/seller/editProduct";
import ViewDetailsCartPage from "./pages/view_details_cart_page/viewDetailsCartPage";
import RegisterPage1 from "./pages/RegisterPage/RegisterPage";
import RegisterToSellerPage from "./pages/seller/pages/registerToSellerPage";
import Test from "./pages/test/test";
import ConfirmOrderPage from "./pages/confirm_order_page/ConfirmOrderPage";
import MyAccountPage from "./pages/MyAccountPage/MyAccountPage";
import SellerPage from "./pages/sellerPage/SellerPage";
import ShippingProviderPage from "./pages/shipping_provider_page/ShippingProviderPage";
import ShipperPage from "./pages/shipper_page/ShipperPage";
import ChatPage from "./pages/chat_page/ChatPage";
import ChatBox from "./pages/customer/components/chatBox/ChatBox";
import StaticShipperProviderPage from "./pages/shipping_provider_page/components/static_shipper_provider_page/StaticShipperProviderPage";
import RequestRegisterSellerDetails from "./pages/shipping_provider_page/components/static_shipper_provider_page/components/RequestRegisterSellerDetails";
import SuccessPayment from "./pages/components/SuccessPayment";
import AdminPage from "./pages/admin_page/AdminPage";
import ViewDetailsSeller from "./pages/admin_page/ViewDetailsSeller";
import NotificationPage from "./pages/notification_page/NotificationPage";

const App = () => {
  const [selectedPartnerChatBox, setSelectedPartnerChatBox] = useState(undefined);
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [showChatBox,setShowChatBox] = useState(false);
  const user = AuthService.getCurrentUser();
  useEffect(()=>{
    console.log(selectedPartnerChatBox)
  },[selectedPartnerChatBox])
  useEffect(() => {

    const user = AuthService.getCurrentUser();
    if (user) {
      setShowModeratorBoard(user === "ROLE_MODERATOR");
      setShowAdminBoard(user === "ROLE_ADMIN");
    }

    EventBus.on("logout", logOut);

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
  };

  return (
    <div>
      {(user?.role == "ROLE_SELLER" ||  user?.role == "ROLE_USER") &&<ChatBox selectedPartnerChatBox={selectedPartnerChatBox} setSelectedPartnerChatBox={setSelectedPartnerChatBox} showChatBox={showChatBox} setShowChatBox={setShowChatBox} />}
    <Router>
      <div>
  
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage1 />} />
          <Route path="/seller/managerProducts" element={<ManagerProducts />} />
          <Route path="/test" element={<StaticShipperProviderPage />} />
          <Route path="/detailsProduct" element={<ViewDetailsProductPage setSelectedPartnerChatBox={setSelectedPartnerChatBox} setShowChatBox={setShowChatBox}/>} />
          <Route path="/seller/addProduct" element={<AddProductPage />} />
          <Route path="/seller/editProduct/:id" element={<EditProductPage />} />
          <Route path="/user/cart-details" element={<ViewDetailsCartPage />} />
          <Route path="/seller/register" element={<RegisterToSellerPage />} />
          <Route path="/seller/test" element={<Test />} />
          <Route path="/user/confirm-order" element={<ConfirmOrderPage />} />
          <Route path="/user/view-account" element={<MyAccountPage />} />
          <Route path="/seller/page" element={<SellerPage />} />
          <Route path="/warehouse-owner" element={<ShippingProviderPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/view-details-seller/:id" element={<ViewDetailsSeller />} />
          <Route path="/shipper" element={<ShipperPage />} />
          <Route path="/chat" element={<ChatPage username="user2" recipient="user1" />} />
          <Route path="/chat-rec" element={<ChatPage username="user2" recipient="user1" />} />
          <Route path="/details-request-to-seller/:id" element={<RequestRegisterSellerDetails />} />
          <Route path="/success" element={<SuccessPayment />} />
          <Route path="/notification" element={<NotificationPage />} />
        </Routes>
      </div>
    </Router>
    </div>
  );
};

export default App;
