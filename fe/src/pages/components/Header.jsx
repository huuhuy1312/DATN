import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css"; 
import itemService from "../../services/item.service";
import axios from "axios";
import { use } from "react";
import notificationService from "../../services/notification.service";
const Header=( {userInfo,cartData,getCartData,handleApplyFilters,setProductNameSearch })=>{

        function formatPriceToVND(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    }
    const deleteItem=async (id)=>{
        const response = await itemService.deleteItemById(id);
        getCartData()
    }
    // const [notification,setNotification] = useState([]);
    //     const getNotification = async ()=>{
    //         const user = JSON.parse(localStorage.getItem("user"));
    //         const resposne = await notificationService.getNotificationsByObject("customer",user?.id);
    //         setNotification(resposne);
    //     }
    // useEffect(()=>{
    //     getNotification()
    // },[])
    return(
        <div class="header">
            <div style={{width:"80%",margin:"auto"}}>
                <div class="grid">
                    <nav class="header__navbar">
                        <ul class="header__navbar-list">
                            <li class="header__navbar-item header__navbar-item--has-qr header__navbar-item--separate">
                                {userInfo?.role === "ROLE_USER" ? <a className= "header__navbar-item header__navbar-item--has-qr" href="/seller/register">Trở thành người bán hàng</a>: <a className="header__navbar-item header__navbar-item--has-qr " href="/seller/page">Kênh người bán</a>}
                                {/* {userInfo?.username} */}
                            {/* <div class="header__qr">
                                <img src="./assets/img/qrcode.png" alt="QR CODE" class="header__qr-img"/>
                                <div class="header__qr-apps">
                                    <a href="https://play.google.com/store/apps/details?id=com.shopee.vn&hl=vi&gl=US" class="header__qr-link">
                                        <img src="./assets/img/ggplay.png" alt="CH PLAY" class="header__qr-download-img"/>
                                    </a>
                                    <a href="https://apps.apple.com/vn/app/shopee-mua-s%E1%BA%AFm-online-1/id959841449" class="header__qr-link">
                                        <img src="./assets/img/appstore.png" alt="appstore" class="header__qr-download-img"/>
                                    </a>
                                </div>
                            </div>  */}
                            </li>
                            <li class="header__navbar-item">
                                <span class="header__navbar-title--no-pointer">Kết nối</span>
                                <a href="" class="header__navbar-icon-link">
                                    <i class="header__navbar-icon fab fa-facebook"></i>
                                </a>
                                <a href="" class="header__navbar-icon-link">
                                    <i class="header__navbar-icon fab fa-instagram"></i>
                                </a>
                                
                            </li>
                            
                        </ul>
                    <ul class="header__navbar-list">
                        <li class="header__navbar-item header__navbar-item--has-notify">
                            <a href="" class="header__navbar-link">
                                <i class="header__navbar-icon far fa-bell"></i>
                                Thông báo
                            </a>
                            <div class="header__notify">
                                <header class="header__notify-header">
                                    <h3>Thông mới được nhận</h3>
                                </header>
                                <ul class="header__notify-list">
                                    {/* {
                                        notification.map((item)=>(
                                            <li class="header__notify-item header__notify-item--viewed">
                                                <a href="" class="header__notify-link">
                                                    <img src={"data:image/jpeg;base64,"+item?.image} alt="" class="header__notify-img"/>
                                                    <div class="header__notify-info">
                                                        <span class="header__notify-name">{item?.title}</span>
                                                        <span class="header__notify-description">{item?.content}</span>
                                                    </div>
                                                </a>
                                            </li>
                                        ))
                                    } */}
                                    {/* <li class="header__notify-item header__notify-item--viewed">
                                        <a href="" class="header__notify-link">
                                            <img src="./assets/img/Mỹ phẩm.jpeg" alt="" class="header__notify-img"/>
                                            <div class="header__notify-info">
                                                <span class="header__notify-name">Mỹ phẩm Shoppe chính hãng</span>
                                                <span class="header__notify-description">Mô tả sản phẩm chính hãng đến từ thương hiệu Luôn vui tươi made in Việt nam</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li class="header__notify-item">
                                        <a href="" class="header__notify-link">
                                            <img src="./assets/img/Mỹ phẩm 2.jpg" alt="" class="header__notify-img"/>
                                            <div class="header__notify-info">
                                                <span class="header__notify-name">Mỹ phẩm Shoppe chính hãng đến từ thương hiệu Chanel cao cấp</span>
                                                <span class="header__notify-description">Mô tả sản phẩm chính hãng đến từ thương hiệu Luôn vui tươi made in Việt nam</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li class="header__notify-item">
                                        <a href="" class="header__notify-link">
                                            <img src="./assets/img/Mỹ phẩm 3.jpg" alt="" class="header__notify-img"/>
                                            <div class="header__notify-info">
                                                <span class="header__notify-name">Boy De Chanel Foundation</span>
                                                <span class="header__notify-description">KEM NỀN LÂU TRÔI HIỆU ỨNG RẠNG RỠ</span>
                                            </div>
                                        </a>
                                    </li> */}
                                </ul>
                                <footer class="header__notify-footer">
                                    <a href="" class="header__notify-footer-btn">Xem tất cả</a>
                                </footer>
                            </div>
                            
                        </li>
                        <li class="header__navbar-item">
                            <a href="" class="header__navbar-link">
                                <i class="header__navbar-icon far fa-question-circle"></i>
                                Trợ giúp</a>
                        </li>
                        <li class="header__navbar-item header__navbar-user">
                            <img src={userInfo?.avatar} alt="" class="header__navbar-user-avatar"/>
                            <span class="header__navbar-user-name">Hữu Huy</span>
                            <ul class="header__navbar-user-menu">
                                <li class="header__navbar-user-item" >
                                    <a href="/user/view-account">Tài khoản của tôi</a>
                                </li>
                                <li class="header__navbar-user-item">
                                    <a href="">Địa chỉ của tôi</a>
                                </li>
                                <li class="header__navbar-user-item">
                                    <a href="">Đơn mua</a>
                                </li>
                                <li class="header__navbar-user-item header__navbar-user-item--separate">
                                    <a href="">Đăng xuất</a>
                                </li>
                            </ul>
                        </li>

                        {/* <li class="header__navbar-item header__navbar-item--strong  header__navbar-item--separate">Đăng kí</li>
                        <li class="header__navbar-item header__navbar-item--strong">Đăng nhập</li>  */}
                    </ul>
                    </nav>
                </div>
                <div class="header-with-search">
                        <div class="header__logo">
                            <a href="/" class="header__logo-link">
                                <img src="/icon_shop_main.png"></img>
                            </a>                    
                        </div>
                        <div class="header__search">
                            <div class="header__search-input-wrap">    
                                <input type="text" class="header__search-input" placeholder="Tìm kiếm sản phẩm" onChange={(e)=>setProductNameSearch(e.target.value)}/>
                                <div class="header__search-history">
                                        <h3 class="header__search-history-heading">Lịch sử tìm kiếm</h3>
                                        <ul class="header__search-history-list">
                                            <li class="header__search-history-item">
                                                <a href="">Kem dưỡng da</a>
                                            </li>
                                            <li class="header__search-history-item">
                                                <a href="">Kem trị mụn</a>
                                            </li>
                                        </ul>
                                </div>
                            </div>
                            {/* <div class="header__search-select">
                                <span class="header__search-select-label">Trong shop</span>
                                <i class="header__search-select-icon fas fa-angle-down"></i>
                                <ul class="header__search-option">
                                    <li class="header__search-option-item header__search-option-item--active">
                                    <span>  Trong shop</span>
                                        <i class="fas fa-check"></i>
                                    </li>
                                    <li class="header__search-option-item"><span>Ngoài shop</span>
                                        <i class="fas fa-check"></i>
                                    </li>
                                </ul>
                            </div> */}
                            <button class="header__search-btn" onClick={()=>handleApplyFilters()}>
                                <i class="header__search-btn-icon fas fa-search"></i>
                            </button>
                        </div>
                        <div class="header__cart">
                            <div class="header__cart-wrap">
                                <i class="header__cart-icon fas fa-shopping-cart"></i>
                                <span class="header__cart-notice">3</span>
                            <div class="header__cart-list">
                                <img src="./assets/img/no-cart.png" alt="" class="header__cart-no-cart-img"/>
                                <span class="header__cart-list-no-cart-msg">Chưa có sản phẩm</span>
                                <h4 class="header__cart-heading">Sản phẩm đã thêm</h4>
                                <ul class="header__cart-list-item">
                                    {cartData!=null && cartData.map((item,index)=>{
                                        return(
                                            <li class="header__cart-item">
                                                <img src={item?.image} alt="" class="header__cart-img"/>
                                                <div class="header__cart-item-info">
                                                    <div class="header__cart-item-head">
                                                        <h5 class="header__cart-item-name">{item?.productName}</h5>
                                                        <div class="header__cart-item-price-wrap">
                                                            <span class="header__cart-item-price">{formatPriceToVND(item?.price)}</span>
                                                            <span class="header__cart-item-mul" style={{padding:"0px 5px"}}>x</span>
                                                            <span class="header__cart-item-qnt">{item?.quantity}</span>
                                                        </div>
                                                    </div>
                                                    <div class="header__cart-item-body">
                                                    <span className="header__cart-item-description">
                                                        {item.label1 && item.label2 
                                                            ? `Phân loại: ${item.label1}, ${item.label2}` 
                                                            : item.label1 
                                                                ? `Phân loại: ${item.label1}` 
                                                                : ''}
                                                    </span>
                                                        <span class="header__cart-item-remove" onClick={()=>{deleteItem(item?.id)}}>Xóa</span>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                    
                                </ul>
                                <button class="header__cart-view-cart btn btn--primary">
                                    <a style={{fontSize:14}} href="/user/cart-details">Xem giỏ hàng</a>    
                                </button>
                            </div>
                            </div>
                            
                        </div>
                </div>
            </div>
        </div>
    )
}

export default Header