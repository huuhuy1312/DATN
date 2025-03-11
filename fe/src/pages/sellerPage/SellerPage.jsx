import React, { useEffect, useState } from 'react';
import './SellerPage.css';
import HeaderSeller from './header_seller/HeaderSeller';
import SidebarSeller from './sidebar_seller/SideBarSeller';
import ContentSeller from './content_seller/ContentSeller';
import AddProductPage from '../seller/pages/addProductPage';
import AllProductSellerPage from './all_product_page/AllProductSellerPage';
import SellerControlPage from './seller_control_page/SellerControlPage';
import { useNavigate } from 'react-router-dom';
function SellerPage() {
    const [content,setContent] = useState("Bảng điều khiển");
    const navigate = useNavigate();
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("user"));
        if(user?.role != "ROLE_SELLER"){
          navigate("/register")
        }
      },[])
    return (
        <div>
            <div className="app">
                <HeaderSeller/>
                <div className="container-seller">
                    <SidebarSeller setContent={setContent}/>
                    {content === "Quản lý đơn hàng" &&<ContentSeller />}
                    {content === "Thêm sản phẩm" &&<AddProductPage setContent={setContent}/>}
                    {content === "Tất cả sản phẩm" &&<AllProductSellerPage />}
                    {content === "Bảng điều khiển" &&<SellerControlPage />}
                </div>
            </div>
        </div>
        
    );
}

export default SellerPage;
