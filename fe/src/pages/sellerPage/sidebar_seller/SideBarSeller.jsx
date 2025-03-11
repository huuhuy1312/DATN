import React from 'react';
import './SidebarSeller.css';

const SidebarSeller = ({setContent}) => {
    return (
        <nav className="sidebar">
            <ul>
                <li><a href="#">Tổng quan</a></li>
                <li><a href="#">Shop</a>
                    <ul>
                        <li><a href="#" onClick={()=>setContent("Bảng điều khiển")}>Quản lý Shop</a></li>
                    </ul>
                </li>
                <li><a href="#">Sản phẩm</a>
                    <ul>
                        <li><a href="#" onClick={()=>setContent("Thêm sản phẩm")}>Thêm sản phẩm</a></li>
                        <li><a href="#" onClick={()=>setContent("Tất cả sản phẩm")}>Tất cả sản phẩm</a></li>
                    </ul>
                </li>
                <li><a href="#">Quản lý đơn hàng</a>
                    <ul>
                        <li><a href="#" onClick={()=>setContent("Quản lý đơn hàng")}>Quản lý đơn hàng</a></li>
                    </ul>
                </li>
                <li><a href="#">Kho hàng</a>
                    <ul>
                        <li><a href="#" onClick={()=>setContent("Quản lý đơn hàng")}>Danh sách kho hàng</a></li>
                    </ul>
                </li>
               
            </ul>
        </nav>
    );
};

export default SidebarSeller;
