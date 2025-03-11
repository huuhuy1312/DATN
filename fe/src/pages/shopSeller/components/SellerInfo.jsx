import React from 'react';
import './shopInfo.css';

function SellerInfo () {
    return (
        <div className="shop-header">
            <div className="shop-info">
                <img src="logo.png" alt="Logo" className="shop-logo" />
                <div className="shop-details">
                    <h1>v7men</h1>
                    <p className="status">Online 44 phút trước</p>
                    <div className="buttons">
                        <button className="follow-btn">+ THEO DÕI</button>
                        <button className="chat-btn">CHAT</button>
                    </div>
                </div>
            </div>
            <div className="shop-stats">
                <div className="stat-item">
                    <p>Sản Phẩm</p>
                    <span>41</span>
                </div>
                <div className="stat-item">
                    <p>Người Theo Dõi</p>
                    <span>68.3k</span>
                </div>
                <div className="stat-item">
                    <p>Đánh Giá</p>
                    <span>4.7 (119.2k Đánh Giá)</span>
                </div>
                <div className="stat-item">
                    <p>Tỉ Lệ Phản Hồi Chat</p>
                    <span>87% (Trong vài giờ)</span>
                </div>
                <div className="stat-item">
                    <p>Tỉ Lệ Shop Hủy Đơn</p>
                    <span>4%</span>
                </div>
                <div className="stat-item">
                    <p>Tham Gia</p>
                    <span>3 Năm Trước</span>
                </div>
            </div>
        </div>
    );
};

export default SellerInfo;
