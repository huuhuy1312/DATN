import { useEffect, useState } from "react";
import "./ViewDetailsSeller.css";
import sellerService from "../../services/seller.service";
import { useParams } from "react-router-dom";
import productService from "../../services/product.service";

const ViewDetailsSeller = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [sellerInfo, setSellerInfo] = useState(null);
  const [listProduct, setListProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [productsPerPage] = useState(8); // Số sản phẩm mỗi trang

  // Hàm để lấy sản phẩm của seller và tính toán phân trang
  const getProductBySellerId = async (idSeller) => {
    try {
      const response = await productService.findBySellerId(idSeller);

      for (let i = 0; i < response.length; i++) {
        const product = response[i];

        // Tính maxPrice và minPrice cho typeOfProducts của từng sản phẩm
        const maxPrice = Math.max(...product.typeOfProducts.map((item) => item.price));
        const minPrice = Math.min(...product.typeOfProducts.map((item) => item.price));

        // Tính tổng revenue cho typeOfProducts của từng sản phẩm
        const totalRevenue = product.typeOfProducts.reduce((sum, item) => sum + item.revenue, 0);
        const totalQuantity = product.typeOfProducts.reduce((sum, item) => sum + item.quantity - item.soldQuantity, 0);

        // Gán các giá trị đã tính toán vào đối tượng sản phẩm
        product.maxPrice = maxPrice;
        product.minPrice = minPrice;
        product.totalRevenue = totalRevenue;
        product.totalQuantity = totalQuantity;
      }
      console.log(response)
      setListProduct(response); // Cập nhật listProduct với dữ liệu đã xử lý
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // Hàm để lấy thông tin seller
  const getSellerInfo = async () => {
    const response = await sellerService.findById(id);
    if (response.status === 200) {
      setSellerInfo(response.data);
      getProductBySellerId(response.data.idAccount);
    }
  };

  const formatPriceToVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Xử lý phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = listProduct.slice(indexOfFirstProduct, indexOfLastProduct);

  // Chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    getSellerInfo();
  }, [id]);

  return (
    <div className="vdsp-container">
      <h1 className="vdsp-header">Thông tin chi tiết gian hàng</h1>

      <div className="vdsp-shop-info">
        <div className="vdsp-shop-info-item">
          <label htmlFor="shop-name">Tên Shop: </label>
          <p id="shop-name">{sellerInfo?.shopName}</p>
        </div>

        <div className="vdsp-shop-info-item">
          <label htmlFor="email">Email chủ shop: </label>
          <p id="email">{sellerInfo?.email}</p>
        </div>

        <div className="vdsp-shop-info-item">
          <label htmlFor="phone">Số điện thoại chủ shop: </label>
          <p id="phone">{sellerInfo?.phoneNumber}</p>
        </div>

        <div className="vdsp-shop-info-item">
          <label htmlFor="id-number">Số định danh chủ shop: </label>
          <p id="id-number">{sellerInfo?.CIN}</p>
        </div>

        <div className="vdsp-shop-info-item">
          <label htmlFor="full-name">Tên đầy đủ chủ shop: </label>
          <p id="full-name">{sellerInfo?.fullName}</p>
        </div>

        <div className="vdsp-shop-info-item">
          <label htmlFor="shop-created-time">Thời gian tạo shop: </label>
          <p id="shop-created-time">01/01/2023</p>
        </div>
        <div className="vdsp-shop-info-item" style={{ display: "block" }}>
          <label htmlFor="id-card-img">Ảnh thẻ định danh: </label>
          <img id="id-card-img" src={sellerInfo?.imageCICard} alt="Ảnh thẻ định danh" />
        </div>

        <div className="vdsp-shop-info-item" style={{ display: "block" }}>
          <label htmlFor="holding-id-card-img">Ảnh cầm thẻ định danh: </label>
          <img id="holding-id-card-img" src={sellerInfo?.imageHoldCICard} alt="Ảnh cầm thẻ định danh" />
        </div>
      </div>

      {/* Bảng danh sách sản phẩm */}
      <table className="table table-hover table-bordered" id="sampleTable" style={{ border: "1px solid black" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "center", verticalAlign: "middle", width: "7.5%" }}>Mã sản phẩm</th>
            <th style={{ textAlign: "center", verticalAlign: "middle", width: "15%" }}>Tên sản phẩm</th>
            <th style={{ textAlign: "center", verticalAlign: "middle", width: "10%" }}>Danh mục</th>
            <th style={{ textAlign: "center", verticalAlign: "middle", width: "15%" }}>Ảnh</th>
            <th style={{ textAlign: "center", verticalAlign: "middle", width: "5%" }}>Số lượng</th>
            <th style={{ textAlign: "center", verticalAlign: "middle", width: "7.5%" }}>Tình trạng</th>
            <th style={{ textAlign: "center", verticalAlign: "middle", width: "10%" }}>Giá tiền</th>
            <th style={{ textAlign: "center", verticalAlign: "middle", width: "10%" }}>Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((item, index) => (
            <tr key={index}>
              <td style={{ textAlign: "center", verticalAlign: "middle", width: "7.5%" }}>71309005</td>
              <td>
                <div>{item.name}</div>
                {item.title1 !== null && <div style={{ fontSize: 12, color: "rgba(0,0,0,0.5)" }}>{`${item.title1}:${item.listLabel1.join(",")}`}</div>}
                {item.title2 !== null && <div style={{ fontSize: 12, color: "rgba(0,0,0,0.5)" }}>{`${item.title2}:${item.listLabel2.join(",")}`}</div>}
              </td>
              <td>{item.category.name}</td>
              <td>
                <div style={{ display: "flex", gap: "1rem" }}>
                  {item.imageProducts.map((image, index) => (
                    <div key={index}>
                      <img style={{ width: 50, height: 50 }} src={image.content} alt="product" />
                    </div>
                  ))}
                </div>
              </td>
              <td>{item.totalQuantity}</td>
              {item.totalQuantity >= 30 && <td><span className="badge bg-success">Còn hàng</span></td>}
              {item.totalQuantity < 30 && <td><span className="badge" style={{ background: "#ffd43b4d", color: "#f3c009" }}>Sắp hết hàng</span></td>}
              <td>
                {item.minPrice === item.maxPrice
                  ? formatPriceToVND(item.minPrice)
                  : `${formatPriceToVND(item.minPrice)} - ${formatPriceToVND(item.maxPrice)}`}
              </td>
              <td>{formatPriceToVND(item.totalRevenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="vdsp-pagination">
        {Array.from({ length: Math.ceil(listProduct.length / productsPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`vdsp-pagination-button ${currentPage === index + 1 ? "active" : ""}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewDetailsSeller;
