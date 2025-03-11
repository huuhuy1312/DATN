import React from 'react';
import './HeaderSeller.css';

function HeaderSeller  () {
    return (
        <header className="header-seller">
            <div className="logo-header-seller">
                <img style={{width:200}}src="/icon_shop_main.png" alt="KenhQuanLy" className="logo" />
            </div>
            <div className="user-actions">
                <span className="username">Shop Sỉ Lẻ Hot Trend</span>
                <img src="/avatar.png" alt="User Avatar" className="avatar-seller" />
            </div>
        </header>
    );
};

export default HeaderSeller;
