import React from 'react';

const SellerControlPageTables = ({ listOrder, listCustomer }) => {
  // Format the price to VND currency format
  function formatPriceToVND(price) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }

  return (
    <section className="scp-tables">
      <div className="scp-table-container">
        <h3>Tình trạng đơn hàng</h3>
        <div className="scp-table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID đơn hàng</th>
                <th>Tên khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {listOrder.map((item, index) => (
                <tr key={index}>
                  <td>{item.waybillCode}</td>
                  <td>{item?.addressCustomer?.nameUser}</td>
                  <td>{formatPriceToVND(item.totalAmount)}</td>
                  <td><span className="scp-status scp-status-info">{item?.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="scp-table-container">
        <h3>Khách hàng mới</h3>
        <div className="scp-table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên khách hàng</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
              </tr>
            </thead>
            <tbody>
              {listCustomer.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.id}</td>
                  <td>{customer.nameUser}</td>
                  <td>{customer.phoneNumberUser}</td>
                  <td>{`${customer.addressDetails}, ${customer.ward}, ${customer.district}, ${customer.city}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default SellerControlPageTables;
