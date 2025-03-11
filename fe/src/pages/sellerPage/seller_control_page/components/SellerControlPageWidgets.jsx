import React from 'react';

const SellerControlPageWidgets = ({totalCustomer,totalProduct,totalOrder,totalLowQuantity}) => (
  <section className="scp-widgets">
    <div className="scp-widget">
      <div className= "scp-icon">
        <img  src='/sellerControlPageImg/icon_customer.png'></img>
      </div>
      <div className="scp-widget-info">
        <h4>TỔNG KHÁCH HÀNG</h4>
        <p><strong>56 khách hàng</strong></p>
        <p>Tổng số khách hàng được quản lý.</p>
      </div>
    </div>
    <div className="scp-widget">
      <div className= "scp-icon">
        <img  src='/sellerControlPageImg/icon_product.png'></img>
      </div>
      <div className="scp-widget-info">
        <h4>TỔNG SẢN PHẨM</h4>
        <p><strong>1850 sản phẩm</strong></p>
        <p>Tổng số sản phẩm được quản lý.</p>
      </div>
    </div>
    <div className="scp-widget">
      <div className= "scp-icon">
        <img  src='/sellerControlPageImg/icon_order.png'></img>
      </div>
      <div className="scp-widget-info">
        <h4>TỔNG ĐƠN HÀNG</h4>
        <p><strong>247 đơn hàng</strong></p>
        <p>Tổng số đơn hàng trong tháng.</p>
      </div>
    </div>
    <div className="scp-widget">
      <div className= "scp-icon">
        <img  src='/sellerControlPageImg/icon_notice.png'></img>
      </div>
      <div className="scp-widget-info">
        <h4>SẮP HẾT HÀNG</h4>
        <p><strong>4 sản phẩm</strong></p>
        <p>Số sản phẩm sắp hết hàng.</p>
      </div>
    </div>
  </section>
);

export default SellerControlPageWidgets;
