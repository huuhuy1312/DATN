import React, { useEffect, useState } from 'react';
import './AllProductSellerPage.css';
import productService from '../../../services/product.service';

function AllProductSellerPage() {
    const [listProduct, setListProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [productsPerPage] = useState(10); // Số sản phẩm mỗi trang
    const [selectedProducts, setSelectedProducts] = useState([]); // Danh sách sản phẩm đã chọn
    const user = JSON.parse(localStorage.getItem("user"));
    
    const getProductBySellerId = async () => {
        try {
            const response = await productService.findBySellerId(user?.id);

            for (let i = 0; i < response.length; i++) {
                const product = response[i];

                // Tính maxPrice và minPrice cho typeOfProducts của từng sản phẩm
                const maxPrice = Math.max(...product.typeOfProducts.map(item => item.price));
                const minPrice = Math.min(...product.typeOfProducts.map(item => item.price));

                // Tính tổng revenue cho typeOfProducts của từng sản phẩm
                const totalRevenue = product.typeOfProducts.reduce((sum, item) => sum + item.revenue, 0);
                const totalQuantity = product.typeOfProducts.reduce((sum, item) => sum + item.quantity - item.soldQuantity, 0);

                // Gán các giá trị đã tính toán vào đối tượng sản phẩm
                product.maxPrice = maxPrice;
                product.minPrice = minPrice;
                product.totalRevenue = totalRevenue;
                product.totalQuantity = totalQuantity;
            }

            setListProduct(response); // Cập nhật listProduct với dữ liệu đã xử lý
            setTotalPages(Math.ceil(response.length / productsPerPage)); // Tính tổng số trang
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const formatPriceToVND = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const getImageByLabel = (imageLabel, label) => {
        const foundImageLabel = imageLabel.find(item => item.label1 === label);
        return foundImageLabel ? foundImageLabel.image : null;
    };

    // Phân trang: Tính toán các sản phẩm sẽ được hiển thị trong trang hiện tại
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = listProduct.slice(indexOfFirstProduct, indexOfLastProduct);

    const handleSelectProduct = (productId) => {
        setSelectedProducts(prevSelected => {
            if (prevSelected.includes(productId)) {
                return prevSelected.filter(id => id !== productId); // Xóa nếu đã có trong danh sách
            } else {
                return [...prevSelected, productId]; // Thêm vào danh sách
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === listProduct.length) {
            setSelectedProducts([]); // Nếu đã chọn tất cả, bỏ chọn
        } else {
            const allProductIds = listProduct.map(product => product.id);
            setSelectedProducts(allProductIds); // Chọn tất cả sản phẩm
        }
    };
    const handleDelelte= async (ids)=>{
        console.log(ids)
        const response = await productService.deleteByIds(ids);
        getProductBySellerId()
    }
    useEffect(() => {
        getProductBySellerId();
    }, []);

    return (
        <div>
            <main className="app-content" style={{ width: "calc(100vw - 250px)" }}>
                <div className="app-title">
                    <ul className="app-breadcrumb breadcrumb side">
                        <li className="breadcrumb-item active"><a href="#"><b>Danh sách sản phẩm</b></a></li>
                    </ul>
                    <div id="clock"></div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="tile">
                            <div className="tile-body">
                                <div className="row element-button">
                                
                                    <div className="col-sm-2">
                                        <a className="btn btn-delete btn-sm nhap-tu-file" type="button" title="Nhập" onClick={() => {}}>
                                            <i className="fas fa-file-upload"></i> Tải từ file
                                        </a>
                                    </div>
                                    <div className="col-sm-2">
                                        <a className="btn btn-delete btn-sm print-file" type="button" title="In" onClick={() => {}}>
                                            <i className="fas fa-print"></i> In dữ liệu
                                        </a>
                                    </div>
                                    <div className="col-sm-2">
                                        <a className="btn btn-delete btn-sm print-file js-textareacopybtn" type="button" title="Sao chép" onClick={() => {}}>
                                            <i className="fas fa-copy"></i> Sao chép
                                        </a>
                                    </div>
                                    <div className="col-sm-2">
                                        <a className="btn btn-excel btn-sm" href="#" title="In">
                                            <i className="fas fa-file-excel"></i> Xuất Excel
                                        </a>
                                    </div>
                                    <div className="col-sm-2">
                                        <a className="btn btn-delete btn-sm pdf-file" type="button" title="In" onClick={() => {}}>
                                            <i className="fas fa-file-pdf"></i> Xuất PDF
                                        </a>
                                    </div>
                                    <div className="col-sm-2">
                                        <a className="btn btn-delete btn-sm" type="button" title="Xóa" onClick={() => {handleDelelte(selectedProducts)}}>
                                            <i className="fas fa-trash-alt"></i> Xóa tất cả
                                        </a>
                                    </div>
                                </div>

                                <table className="table table-hover table-bordered" id="sampleTable" style={{border:"1px solid black"}}>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle',backgroundColor:"#3498db" }}>
                                                <input
                                                    type="checkbox"
                                                    id="all"
                                                    style={{ width: '1.5rem', margin: '0' }}
                                                    checked={selectedProducts.length === listProduct.length}
                                                    onChange={handleSelectAll}
                                                />
                                            </th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle', width:"7.5%",backgroundColor:"#3498db"}}>Mã sản phẩm</th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle', width:"15%",backgroundColor:"#3498db"}}>Tên sản phẩm</th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle', width:"10%",backgroundColor:"#3498db" }}>Danh mục</th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle', width:"15%",backgroundColor:"#3498db" }}>Ảnh</th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle',width:"5%",backgroundColor:"#3498db"}}>Số lượng</th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle',width:"7.5%",backgroundColor:"#3498db" }}>Tình trạng</th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle',width:"10%",backgroundColor:"#3498db" }}>Giá tiền</th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle',width:"10%",backgroundColor:"#3498db" }}>Doanh thu</th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle',width:"10%",backgroundColor:"#3498db" }}>Chức năng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProducts.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                    <input
                                                        style={{ width: '1.5rem', margin: '0' }}
                                                        type="checkbox"
                                                        checked={selectedProducts.includes(item.id)}
                                                        onChange={() => handleSelectProduct(item.id)}
                                                    />
                                                </td>
                                                <td style={{ textAlign: 'center', verticalAlign: 'middle', width:"7.5%"}}>71309005</td>
                                                <td>
                                                    <div>{item.name}</div>
                                                    {item.title1 !==null && <div style={{fontSize:12,color:"rgba(0,0,0,0.5)"}}>{`${item.title1}:${item.listLabel1.join(",")}`}</div>}
                                                    {item.title2 !==null && <div style={{fontSize:12,color:"rgba(0,0,0,0.5)"}}>{`${item.title2}:${item.listLabel2.join(",")}`}</div>}
                                                </td>
                                                <td>{item.category.name}</td>
                                                <td>
                                                    <div style={{ display: "flex",gap:"1rem" }}>
                                                        {item.imageProducts.map((image, index) => (
                                                            <div key={index} >
                                                                <img style={{ width: 50, height: 50 }} src={image.content} alt="product" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>{item.totalQuantity}</td>
                                                {item.totalQuantity>=30 && <td><span className="badge bg-success">Còn hàng</span></td>}
                                                {item.totalQuantity<30 && <td><span className="badge" style={{background:"#ffd43b4d",color:"#f3c009"}}>Sắp hết hàng</span></td>}
                                                <td>
                                                    {item.minPrice === item.maxPrice
                                                    ? formatPriceToVND(item.minPrice)
                                                    : `${formatPriceToVND(item.minPrice)} - ${formatPriceToVND(item.maxPrice)}`}
                                                </td>

                                                <td>{formatPriceToVND(item.totalRevenue)}</td>
                                                <td style={{ textAlign: 'center', verticalAlign: 'middle',width:"10%" }}>
                                                    <button className="btn btn-primary btn-sm trash" type="button" style={{width:"3.5rem",padding:"0.5rem",marginRight:"1rem"}} title="Xóa" onClick={()=>handleDelelte([item.id])}>
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                    <button className="btn btn-primary btn-sm edit" type="button" style={{width:"3.5rem",padding:"0.5rem"}} title="Sửa" id="show-emp" data-toggle="modal" data-target="#ModalUP">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Nút phân trang */}
                                <div className="pagination">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Prev
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={currentPage === index + 1 ? 'active' : ''}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AllProductSellerPage;
