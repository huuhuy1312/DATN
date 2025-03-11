import React, { useEffect, useState } from 'react';

const Menu = ({sellerInfo}) => {
    const [activeMenuItem, setActiveMenuItem] = useState('');
    useEffect(() => {

        const currentUrl = window.location.pathname;
        setActiveMenuItem(currentUrl);
        console.log(sellerInfo)
    }, []);

    return (
        <aside class="app-sidebar">
            <div class="app-sidebar__user"><img class="app-sidebar__user-avatar" src="/images1/admin/avatar.jpg" width="100px" alt="User Image" />
                <div>
                    <p class="app-sidebar__user-name"><b>{sellerInfo?.shopName}</b></p>
                    <p class="app-sidebar__user-designation">Chào mừng bạn trở lại</p>
                </div>
            </div>
            <div>
                <ul className="app-menu">
                    <li>
                        <a className={`app-menu__item ${activeMenuItem === '/seller' ? 'active' : ''}`} href="/seller">
                            <i className="app-menu__icon bx bx-tachometer" />
                            <span className="app-menu__label">Bảng điều khiển</span>
                        </a>
                    </li>
                    <li>
                        <a
                            className={`app-menu__item ${activeMenuItem === '/seller/managerProducts' ? 'active' : ''}`}
                            href="/seller/managerProducts"
                        >
                            <i className="app-menu__icon bx bx-purchase-tag-alt" />
                            <span className="app-menu__label">Quản lý sản phẩm</span>
                        </a>
                    </li>
                    <li>
                        <a className={`app-menu__item ${activeMenuItem === '/seller/manage-order' ? 'active' : ''}`} href="table-data-oder.html">
                            <i className="app-menu__icon bx bx-task" />
                            <span className="app-menu__label">Quản lý đơn hàng</span>
                        </a>
                    </li>
                    <li>
                        <a className={`app-menu__item ${activeMenuItem === '/quan-ly-bao-cao.html' ? 'active' : ''}`} href="quan-ly-bao-cao.html">
                            <i className="app-menu__icon bx bx-pie-chart-alt-2" />
                            <span className="app-menu__label">Báo cáo doanh thu</span>
                        </a>
                    </li>
                </ul>

            </div>
        </aside>

    );
};

export default Menu;
