import "../../css/seller/main.css"
import LineChart from "./components/LineChart";
import { useNavigate} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Menu from "./components/Menu";
import sellerService from "../../services/seller.service";
function SellerDashBoard() {
    const navigate = useNavigate();
    const[userInfo,setUserInfo] = useState(null);
    const[sellerInfo,setSellerInfo] = useState(null);
    const loadSeller = async(account_id)=>{
        try {
            const response = await sellerService.findByAccountId(account_id)
            console.log(response.data)
            setSellerInfo(response.data)
          } catch (error) {
            // Handle error
            console.error('Không tồn tại seller');
          }
    }
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("user"));
        if(user){
            setUserInfo(user);
            console.log(user?.id)
            loadSeller(user?.id);
        }else{
            navigate("/register")
        }
    },[])
    
    return (
        <div>
            {/* <div className="awesome" style={{ border: '1px solid red' }}>
                <label htmlFor="name">Enter your name: </label>
                <input type="text" id="name" />
            </div> */}
            <title>Danh sách nhân viên | Quản trị Admin</title>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css" />
            <link rel="stylesheet" href="https://unpkg.com/boxicons@latest/css/boxicons.min.css" />
            <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css" />
            <body onload="time()" class="app sidebar-mini rtl">
                <header class="app-header">
                    <a class="app-sidebar__toggle" href="#" data-toggle="sidebar"
                        aria-label="Hide Sidebar"></a>
                    <ul class="app-nav">
                        <li><a class="app-nav__item" href="/index.html"><i class='bx bx-log-out bx-rotate-180'></i> </a>

                        </li>
                    </ul>
                </header>

                <div class="app-sidebar__overlay" data-toggle="sidebar"></div>
                <Menu sellerInfo={sellerInfo}/>
                <main class="app-content">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="app-title">
                                <ul class="app-breadcrumb breadcrumb">
                                    <li class="breadcrumb-item"><a href="#"><b>Bảng điều khiển</b></a></li>
                                </ul>
                                <div id="clock"></div>
                            </div>
                        </div>
                    </div>
                    <div class="row">

                        <div class="col-md-12 col-lg-12">
                            <div class="row">

                                <div class="col-md-6">
                                    <div class="widget-small primary coloured-icon"><i class='icon bx bxs-user-account fa-3x'></i>
                                        <div class="info">
                                            <h4>Tổng khách hàng</h4>
                                            <p><b>56 khách hàng</b></p>
                                            <p class="info-tong">Tổng số khách hàng được quản lý.</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="widget-small info coloured-icon"><i class='icon bx bxs-data fa-3x'></i>
                                        <div class="info">
                                            <h4>Tổng sản phẩm</h4>
                                            <p><b>1850 sản phẩm</b></p>
                                            <p class="info-tong">Tổng số sản phẩm được quản lý.</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="widget-small warning coloured-icon"><i class='icon bx bxs-shopping-bags fa-3x'></i>
                                        <div class="info">
                                            <h4>Tổng đơn hàng</h4>
                                            <p><b>247 đơn hàng</b></p>
                                            <p class="info-tong">Tổng số hóa đơn bán hàng trong tháng.</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="widget-small danger coloured-icon"><i class='icon bx bxs-error-alt fa-3x'></i>
                                        <div class="info">
                                            <h4>Sắp hết hàng</h4>
                                            <p><b>4 sản phẩm</b></p>
                                            <p class="info-tong">Số sản phẩm cảnh báo hết cần nhập thêm.</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-12">
                                    <div class="tile">
                                        <h3 class="tile-title">Tình trạng đơn hàng</h3>
                                        <div>
                                            <table class="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>ID đơn hàng</th>
                                                        <th>Tên khách hàng</th>
                                                        <th>Tổng tiền</th>
                                                        <th>Trạng thái</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>AL3947</td>
                                                        <td>Phạm Thị Ngọc</td>
                                                        <td>
                                                            19.770.000 đ
                                                        </td>
                                                        <td><span class="badge bg-info">Chờ xử lý</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td>ER3835</td>
                                                        <td>Nguyễn Thị Mỹ Yến</td>
                                                        <td>
                                                            16.770.000 đ
                                                        </td>
                                                        <td><span class="badge bg-warning">Đang vận chuyển</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td>MD0837</td>
                                                        <td>Triệu Thanh Phú</td>
                                                        <td>
                                                            9.400.000 đ
                                                        </td>
                                                        <td><span class="badge bg-success">Đã hoàn thành</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td>MT9835</td>
                                                        <td>Đặng Hoàng Phúc	</td>
                                                        <td>
                                                            40.650.000 đ
                                                        </td>
                                                        <td><span class="badge bg-danger">Đã hủy	</span></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                </div>

                                <div class="col-md-12">
                                    <div class="tile">
                                        <h3 class="tile-title">Khách hàng mới</h3>
                                        <div>
                                            <table class="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Tên khách hàng</th>
                                                        <th>Ngày sinh</th>
                                                        <th>Số điện thoại</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>#183</td>
                                                        <td>Hột vịt muối</td>
                                                        <td>21/7/1992</td>
                                                        <td><span class="tag tag-success">0921387221</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td>#219</td>
                                                        <td>Bánh tráng trộn</td>
                                                        <td>30/4/1975</td>
                                                        <td><span class="tag tag-warning">0912376352</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td>#627</td>
                                                        <td>Cút rang bơ</td>
                                                        <td>12/3/1999</td>
                                                        <td><span class="tag tag-primary">01287326654</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td>#175</td>
                                                        <td>Hủ tiếu nam vang</td>
                                                        <td>4/12/20000</td>
                                                        <td><span class="tag tag-danger">0912376763</span></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* <div class="col-md-12 col-lg-6">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="tile">
                                        <h3 class="tile-title">Dữ liệu 6 tháng đầu vào</h3>
                                        <div class="embed-responsive embed-responsive-16by9">
                                            <canvas class="embed-responsive-item" id="lineChartDemo"></canvas>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="tile">
                                        <h3 class="tile-title">Thống kê 6 tháng doanh thu</h3>
                                        <div class="embed-responsive embed-responsive-16by9">
                                            <canvas class="embed-responsive-item" id="barChartDemo"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div> */}
                    </div>


                    {/* <div class="text-center" style="font-size: 13px">
                        <p><b>Copyright
                            <script type="text/javascript">
                                document.write(new Date().getFullYear());
                            </script> Phần mềm quản lý bán hàng | Dev By Trường
                        </b></p>
                    </div> */}
                </main>

            </body>
        </div>
    )
}
export default SellerDashBoard;