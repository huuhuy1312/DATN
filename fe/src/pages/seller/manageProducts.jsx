import "../../css/seller/main.css"

import Menu from "./components/Menu";
import React, { useEffect, useState } from 'react';
import RichTextEditor from "./components/RichTextEditor";
function ManagerProducts() {
    const [products, setProducts] = useState(null);
    const getProduct = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/product/all", {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error("Network reponse was not ok");
            }
            const data = await response.json();
            console.log(data)
            setProducts(data)
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(()=>{
        getProduct();
    },[])
    
    useEffect(() => {
        console.log(products)
    }, [products])
    const handleClick = (pid) => {
        window.location.href = `http://localhost:3000/seller/editProduct/${pid}`;
    };
    const deleteProductByID = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/product/${id}`, {
                method: "DELETE"
            });
    
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
    
            // Assuming getProduct is an asynchronous function, you might want to await it as well.
            await getProduct();
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <div>
            <title>Danh sách nhân viên | Quản trị Admin</title>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            <link rel="stylesheet" type="text/css" href="css/main.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css" />

            <link rel="stylesheet" href="https://unpkg.com/boxicons@latest/css/boxicons.min.css" />

            <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css" />

            <header className="app-header">
                <a className="app-sidebar__toggle" href="#" data-toggle="sidebar" aria-label="Hide Sidebar" />
                <ul className="app-nav">
                    <li><a className="app-nav__item" href="/index.html"><i className="bx bx-log-out bx-rotate-180" /> </a>
                    </li>
                </ul>
            </header>
            <div className="app-sidebar__overlay" data-toggle="sidebar" />
            <aside className="app-sidebar">
                <div className="app-sidebar__user"><img className="app-sidebar__user-avatar" src="/images/hay.jpg" width="50px" alt="User Image" />
                    <div>
                        <p className="app-sidebar__user-name"><b>Võ Trường</b></p>
                        <p className="app-sidebar__user-designation">Chào mừng bạn trở lại</p>
                    </div>
                </div>
                <hr />
                <Menu />
                {/* <LineChart /> */}
            </aside>
            <main className="app-content">
                <div className="app-title app-title-product">
                    <ul className="app-breadcrumb breadcrumb side">
                        <li className="breadcrumb-item active"><a href="#"><b>Danh sách sản phẩm</b></a></li>
                    </ul>
                    <div id="clock" />
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="tile">
                            <div className="tile-body">
                                <div className="row element-button">
                                    <div className="col-sm-2">
                                        <a className="btn btn-add btn-sm" href="addProduct" title="Thêm"><i className="fas fa-plus" />
                                            Tạo mới sản phẩm</a>
                                    </div>
                                    <div className="col-sm-2">
                                        <a className="btn btn-delete btn-sm nhap-tu-file" type="button" title="Nhập" onclick="myFunction(this)"><i className="fas fa-file-upload" /> Tải từ file</a>
                                    </div>
                                    <div className="col-sm-2">
                                        <a className="btn btn-delete btn-sm print-file" type="button" title="In" onclick="myApp.printTable()"><i className="fas fa-print" /> In dữ liệu</a>
                                    </div>
                                    <div className="col-sm-2">
                                        <a className="btn btn-delete btn-sm print-file js-textareacopybtn" type="button" title="Sao chép"><i className="fas fa-copy" /> Sao chép</a>
                                    </div>
                                    <div className="col-sm-2">
                                        <a className="btn btn-excel btn-sm" href title="In"><i className="fas fa-file-excel" /> Xuất Excel</a>
                                    </div>
                                    <div className="col-sm-2">
                                        <a className="btn btn-delete btn-sm pdf-file" type="button" title="In" onclick="myFunction(this)"><i className="fas fa-file-pdf" /> Xuất PDF</a>
                                    </div>
                                    <div className="col-sm-2">
                                        <a className="btn btn-delete btn-sm" type="button" title="Xóa" onclick="myFunction(this)"><i className="fas fa-trash-alt" /> Xóa tất cả </a>
                                    </div>
                                </div>
                                <table className="table table-hover table-bordered" id="sampleTable">
                                    <thead>
                                        <tr>
                                            <th width={10}><input type="checkbox" id="all" /></th>
                                            <th>Mã sản phẩm</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Ảnh</th>
                                            <th>Số lượng</th>
                                            <th>Tình trạng</th>
                                            <th>Giá tiền</th>
                                            <th>Danh mục</th>
                                            <th>Chức năng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        {products && products.map((product, index) => (
                                            <tr key={product.id}>
                                                <td width={10}><input type="checkbox" name="check1" defaultValue={1} /></td>
                                                <td>{product.id}</td>
                                                <td>{product.name}</td>
                                                <td><img src={product.image} alt="" width="100px;" /></td>
                                                <td>{product.quantity}</td>
                                                <td><span className={`badge ${product.quantity ? 'bg-success' : 'bg-danger'}`}>{product.quantity ? 'Còn hàng' : 'Hết hàng'}</span></td>
                                                <td>{product.priceMax === product.priceMin ? product.priceMax : `${product.priceMin} - ${product.priceMax}`} đ</td>
                                                <td>{product.category.name}</td>
                                                <td>
                                                    <button className="btn btn-primary btn-sm trash" type="button" title="Xóa" onClick={()=>deleteProductByID(product.id)}>
                                                        <i className="fas fa-trash-alt" />
                                                    </button>
                                                    <button className="btn btn-primary btn-sm edit" type="button" title="Sửa" id="show-emp" data-toggle="modal" data-target="#ModalUP" onClick={()=>handleClick(product.id)}>
                                                        <i className="fas fa-edit" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}



                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* <LineChart /> */}
            </main>

            <div className="modal fade" id="ModalUP" tabIndex={-1} role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="row">
                                <div className="form-group  col-md-12">
                                    <span className="thong-tin-thanh-toan">
                                        <h5>Chỉnh sửa thông tin sản phẩm cơ bản</h5>
                                    </span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label className="control-label">Mã sản phẩm </label>
                                    <input className="form-control" type="number" defaultValue={71309005} />
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">Tên sản phẩm</label>
                                    <input className="form-control" type="text" required defaultValue="Bàn ăn gỗ Theresa" />
                                </div>
                                <div className="form-group  col-md-6">
                                    <label className="control-label">Số lượng</label>
                                    <input className="form-control" type="number" required defaultValue={20} />
                                </div>
                                <div className="form-group col-md-6 ">
                                    <label htmlFor="exampleSelect1" className="control-label">Tình trạng sản phẩm</label>
                                    <select className="form-control" id="exampleSelect1">
                                        <option>Còn hàng</option>
                                        <option>Hết hàng</option>
                                        <option>Đang nhập hàng</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">Giá bán</label>
                                    <input className="form-control" type="text" defaultValue="5.600.000" />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="exampleSelect1" className="control-label">Danh mục</label>
                                    <select className="form-control" id="exampleSelect1">
                                        <option>Bàn ăn</option>
                                        <option>Bàn thông minh</option>
                                        <option>Tủ</option>
                                        <option>Ghế gỗ</option>
                                        <option>Ghế sắt</option>
                                        <option>Giường người lớn</option>
                                        <option>Giường trẻ em</option>
                                        <option>Bàn trang điểm</option>
                                        <option>Giá đỡ</option>
                                    </select>
                                </div>
                            </div>
                            <br />
                            <a href="#" style={{ float: 'right', fontWeight: 600, color: '#ea0000' }}>Chỉnh sửa sản phẩm nâng cao</a>
                            <br />
                            <br />
                            <button className="btn btn-save" type="button">Lưu lại</button>
                            <a className="btn btn-cancel" data-dismiss="modal" href="#">Hủy bỏ</a>
                            <br />
                        </div>
                        <div className="modal-footer">
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );

}
export default ManagerProducts;