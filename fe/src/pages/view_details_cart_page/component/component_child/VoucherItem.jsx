import React from 'react';
import './voucher_item.css';

function VoucherItem({ item, image,totalPrice,choosen, setVoucherChoose }) {
    // Hàm format giá thành VND
    function formatPriceToVND(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    }

    // Hàm tính thời gian còn lại
    const calculateTimeRemaining = (targetDate) => {
        const now = new Date();
        const target = new Date(targetDate);
        const difference = target - now;

        if (difference <= 0) {
            return 'Hết hạn';
        }

        // Tính toán số ngày, giờ, phút, giây còn lại
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        // Trả về chuỗi thời gian còn lại
        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else {
            return `${minutes}m ${seconds}s`;
        }
    };

    return (
        <div className='voucher-item-container'>
            {/* Thêm layout overlay */}
            {totalPrice<item?.conditionAmount &&<div className='voucher-item-overlay'></div>}
            <div style={{display:"flex"}}>
            <div className='voucher-item-img'>
                <img src={item.type== "Giảm tiền ship" ? "/free_ship_voucher.png":"/discount_voucher.png"} alt='Voucher'></img>
                
            </div>
            <div className='voucher-item-content' >
                {item.type === "Giảm tiền ship" ? <div style={{ fontSize: 16 }}>{`Giảm tối đa ${formatPriceToVND(item?.reduceMaxAmount)}`}</div>:
                <div style={{ fontSize: 16 }}>{`Giảm ${item?.percentReduce} %, tối đa ${formatPriceToVND(item?.reduceMaxAmount)}`}</div>}
                <div style={{ fontSize: 14 }}>{`Đơn tối thiểu ${formatPriceToVND(item?.conditionAmount)}`}</div>
                <div style={{ fontSize: 12 }}>
                    {item?.endDate ? (
                        <>
                            {item?.maxQuantity != null && `Số lượng: ${item?.maxQuantity}, `}
                            HSD: {calculateTimeRemaining(item?.endDate)}
                        </>
                    ) : (
                        'Không có hạn sử dụng'
                    )}
                </div>
            </div>
            </div>
            <div className='voucher-item-action'>
                <input type='radio' style={{ width: 16 }} checked={choosen} onClick={() => setVoucherChoose(item)}></input>
            </div>
        </div>
    );
}

export default VoucherItem;
