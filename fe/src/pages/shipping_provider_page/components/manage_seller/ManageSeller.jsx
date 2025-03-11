import React, { useEffect, useState } from "react";
import orderlineService from "../../../../services/orderline.service";
import warehouseService from "../../../../services/warehouse.service";
import orderService from "../../../../services/order.service";
import productService from "../../../../services/product.service";
import voucherService from "../../../../services/voucher.service";
import sellerService from "../../../../services/seller.service";

const listStatus = [
  "Chờ xác nhận", // 0
  "Đã xác nhận", // 1
  "Đang xử lý", // 2
  "Đang lấy hàng", // 3
  "Đã lấy hàng", // 4
  "Đang vận chuyển tới kho đích", // 5
  "Đã tới kho đích", // 6
  "Đang vận chuyển tới người nhận", // 7
  "Đã hoàn thành", // 8
];

const ManageSeller = () => {
  const [listSeller, setListSeller] = useState(null);
  const [openShopVisible, setOpenShopVisible] = useState(true); // Trạng thái thu gọn bảng gian hàng
  const [pendingSellerVisible, setPendingSellerVisible] = useState(true); // Trạng thái thu gọn bảng yêu cầu
  const [lockedShopVisible, setLockedShopVisible] = useState(true); // Trạng thái thu gọn bảng shop bị khóa
  const [lockReason,setLockReason] = useState("");
  const [chooseShopLock,setChooseShopLock] = useState(null);
  const formatPriceToVND = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  function mergeSellerStatistics(sellers, statistics, orderlines) {
    return sellers.map((seller) => {
      const stat = statistics.find((stat) => stat.sellerId === seller.idAccount);
      const sellerOrderlines = orderlines.filter(
        (orderline) => orderline.sellerId === seller.idAccount
      );

      // Tính tổng totalAmount cho mỗi seller
      const totalAmount = sellerOrderlines.reduce(
        (sum, orderline) => sum + (orderline.totalAmount || 0),
        0
      );

      return {
        id: seller.id,
        ownerName: seller.ownerName,
        phoneNumber: seller.phoneNumber,
        shopName: seller.shopName,
        createdAt: seller.createdAt,
        isActive: seller.isActive,
        isDeleted: seller.isDeleted,
        CIN: seller.CIN,
        imageCICard: seller?.imageCICard,
        imageHoldCICard: seller?.imageHoldCICard,
        reasonLock: seller?.reasonLock,
        dateLock: seller?.dateLock,
        countProduct: stat ? stat.countProduct : 0,
        countRate: stat ? stat.countRate : 0,
        rateStar: stat ? stat.rateStar : 0,
        orderlines: sellerOrderlines,
        totalAmount: totalAmount,
      };
    });
  }

  const staticSeller = async () => {
    const response = await sellerService.staticSeller();
    const response2 = await productService.staticBySeller();
    const orderlines = await orderlineService.getByCondition({});
    console.log(mergeSellerStatistics(response, response2, orderlines))
    setListSeller(mergeSellerStatistics(response, response2, orderlines));
  };

  useEffect(() => {
    staticSeller();
  }, []);

  function formatDate(dateString) {
    let date = new Date(dateString);

    let day = date.getDate().toString().padStart(2, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  const handleLockShop = async () =>{
    const body = {
      id: chooseShopLock,
      reasonLock: lockReason,
      isDeleted : true
    }
    const response = await sellerService.updateSeller(body)
    setChooseShopLock(null)
    staticSeller()
  }
  const handleUnLockShop = async (id) =>{
    const body = {
      id: id,
      isDeleted : false
    }
    const response = await sellerService.updateSeller(body)
    staticSeller()
  }
  const handleAcceptShop = async(id)=>{
    const response = await sellerService.acceptRequest(id);
    console.log(response.data);
    staticSeller()
  }
  return (
    <div style={{ width: "100%" }}>
      {chooseShopLock != null && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent gray background
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
          }}>
            <h2 style={{ marginBottom: '15px' }}>Nhập lý do khóa shop</h2>
            <textarea
              value={lockReason}
              onChange={(e) => setLockReason(e.target.value)}
              placeholder="Lý do khóa shop..."
              rows={4}
              style={{ width: '100%', padding: '10px' }}
            />
            <div>
              <button onClick={handleLockShop} style={{
                marginTop: '10px',
                marginRight: '10px',
                padding: '8px 16px',
                cursor: 'pointer',
                backgroundColor:"#ff5722",
                color:"white",
                border:"none"
              }}>
                Khóa Shop
              </button>
              <button onClick={() => setChooseShopLock(null)} style={{
                marginTop: '10px',
                padding: '8px 16px',
                cursor: 'pointer',
              }}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="spp-main-content">
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <h1 className="spp-title">Quản lý gian hàng</h1>
        </div>

        {/* Bảng gian hàng đang mở */}
        <div>
          <div
            onClick={() => setOpenShopVisible(!openShopVisible)}
            style={{
              cursor: "pointer",
              padding: "10px",
              backgroundColor: "#f1f1f1",
              fontWeight: "bold",
            }}
          >
            Gian hàng đang mở
            <span style={{ float: "right" }}>
              {openShopVisible ? "[-]" : "[+]" }
            </span>
          </div>
          {openShopVisible && (
            <table className="spp-order-table">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Tên shop</th>
                  <th>Thông tin chủ shop</th>
                  <th style={{ width: "15%" }}>Số lượng sản phẩm</th>
                  <th style={{ width: "10%" }}>Doanh thu</th>
                  <th style={{ width: "10%" }}>Đánh giá</th>
                  <th style={{ width: "10%" }}>Ngày tạo shop</th>
                  <th style={{ width: "20%" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
              {listSeller &&
                listSeller
                  .filter(seller => seller.isActive === true && seller.isDeleted === false) // Filter out inactive or deleted sellers
                  .map((seller, index) => (
                    <tr key={index}>
                      <td>
                        <div>{seller.shopName}</div>
                        <a
                          style={{ cursor: "pointer", color: "#ff6600" }}
                          href={`/admin/view-details-seller/${seller.id}`}
                        >
                          Xem chi tiết...
                        </a>
                      </td>
                      <td>
                        <div>Họ và tên: {seller.ownerName}</div>
                        <div>Số điện thoại: {seller.phoneNumber}</div>
                      </td>
                      <td>
                        {seller.countProduct === 0
                          ? "Chưa có sản phẩm nào"
                          : `${seller.countProduct} sản phẩm`}
                      </td>
                      <td>
                        {seller.orderlines.length === 0
                          ? "Chưa có đơn hàng nào"
                          : `${formatPriceToVND(seller.totalAmount)} / ${seller.orderlines.length} đơn hàng`}
                      </td>
                      <td>
                        {seller.countRate === 0 ? (
                          "Chưa có đánh giá nào"
                        ) : (
                          <>
                            {seller.rateStar}
                            <i
                              className="fas fa-star"
                              style={{ color: "gold", marginLeft: "4px" }}
                            ></i>
                            / {seller.countRate} đánh giá
                          </>
                        )}
                      </td>
                      <td>{formatDate(seller.createdAt)}</td>
                      <td>
                        <button style={{ marginRight: 10 }} onClick={()=>setChooseShopLock(seller?.id)}>Khóa Shop</button>
                        <button>Gửi thông báo</button>
                      </td>
                    </tr>
                  ))}

              </tbody>
            </table>
          )}
        </div>

      

        {/* Bảng shop bị khóa */}
        <div>
          <div
            onClick={() => setLockedShopVisible(!lockedShopVisible)}
            style={{
              cursor: "pointer",
              padding: "10px",
              backgroundColor: "#f1f1f1",
              fontWeight: "bold",
              marginTop: "20px",
            }}
          >
            Shop bị khóa
            <span style={{ float: "right" }}>
              {lockedShopVisible ? "[-]" : "[+]" }
            </span>
          </div>
          {lockedShopVisible && (
            <table className="spp-order-table">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Tên shop</th>
                  <th>Thông tin chủ shop</th>
                  <th style={{ width: "15%" }}>Ngày khóa</th>
                  <th style={{ width: "15%" }}>Lý do khóa</th>
                  <th style={{ width: "15%" }}>Số lượng sản phẩm</th>
                  <th style={{ width: "20%" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
              {listSeller &&
                listSeller
                  .filter(seller => seller.isActive === true && seller.isDeleted === true) // Filter out inactive or deleted sellers
                  .map((seller, index) => (
                    <tr key={index}>
                      <td>
                        <div>{seller.shopName}</div>
                        <a
                          style={{ cursor: "pointer", color: "#ff6600" }}
                        >
                          Xem chi tiết...
                        </a>
                      </td>
                      <td>
                        <div>Họ và tên: {seller.ownerName}</div>
                        <div>Số điện thoại: {seller.phoneNumber}</div>
                      </td>
                      <td>{formatDate(seller.dateLock)}</td>
                      <td>{seller.reasonLock}</td>
                      <td>
                        {seller.countProduct === 0
                          ? "Chưa có sản phẩm nào"
                          : `${seller.countProduct} sản phẩm`}
                      </td>
                      <td>
                        <button style={{ marginRight: 10 }} onClick={()=>handleUnLockShop(seller?.id)}>Mở Shop</button>
                        <button>Gửi thông báo</button>
                      </td>
                    </tr>
                  ))}

              </tbody>
            </table>
          )}
        </div>
        {/* Bảng yêu cầu trở thành người bán */}
        <div>
          <div
            onClick={() => setPendingSellerVisible(!pendingSellerVisible)}
            style={{
              cursor: "pointer",
              padding: "10px",
              backgroundColor: "#f1f1f1",
              fontWeight: "bold",
              marginTop: "20px",
            }}
          >
            Yêu cầu trở thành người bán
            <span style={{ float: "right" }}>
              {pendingSellerVisible ? "[-]" : "[+]" }
            </span>
          </div>
          {pendingSellerVisible && (
            <table className="spp-order-table">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Tên shop</th>
                  <th>Thông tin chủ shop</th>
                  <th style={{ width: "10%" }}>Ngày yêu cầu</th>
                  <th style={{ width: "15%" }}>Ảnh thẻ định danh</th>
                  <th style={{ width: "15%" }}>Ảnh cầm thẻ định danh</th>
                  <th style={{ width: "20%" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
              {listSeller &&
                listSeller
                  .filter(seller => seller.isActive === false && seller.isDeleted === false) // Filter out inactive or deleted sellers
                  .map((seller, index) => (
                    <tr key={index}>
                      <td>
                        <div>{seller.shopName}</div>
                        <a
                          style={{ cursor: "pointer", color: "#ff6600" }}
                        >
                          Xem chi tiết...
                        </a>
                      </td>
                      <td>
                        <div>Họ và tên: {seller.ownerName}</div>
                        <div>Số điện thoại: {seller.phoneNumber}</div>
                        <div>Số định danh: {seller.CIN}</div>
                      </td>
                      <td>
                        {formatDate(seller?.createdAt)}
                      </td>
                      <td>
                        <img src = {seller?.imageCICard}></img>
                      </td>
                      <td>
                        <img src = {seller?.imageHoldCICard}></img>
                      </td>
                      <td>
                        <button onClick = {()=>handleAcceptShop(seller?.id)}style={{ marginRight: 10 }}>Chấp thuận</button>
                        <button>Từ chối</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSeller;
