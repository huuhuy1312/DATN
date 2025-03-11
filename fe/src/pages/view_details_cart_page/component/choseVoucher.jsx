import React, { useState, useEffect } from 'react';
import VoucherItem from './component_child/VoucherItem';
import voucherService from '../../../services/voucher.service';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

function ChooseVoucher({ setShowChooseVoucher, totalPrice, setVoucherShipping, setVoucherDiscount, voucherDiscount, voucherShipping }) {
    const [listVoucherShipping, setListVoucherShipping] = useState([]);
    const [listVoucherDiscount, setListVoucherDiscount] = useState([]);
    const [imageShippingVoucher, setImageShippingVoucher] = useState('');
    const [imageDiscountVoucher, setImageDiscountVoucher] = useState('');
    const [showAllShipping, setShowAllShipping] = useState(false);
    const [showAllDiscount, setShowAllDiscount] = useState(false);
    const [voucherChooseShipping, setVoucherChooseShipping] = useState(voucherShipping);
    const [voucherChooseDiscount, setVoucherChooseDiscount] = useState(voucherDiscount);

    const handleShowMoreShipping = () => setShowAllShipping(!showAllShipping);
    const handleShowMoreDiscount = () => setShowAllDiscount(!showAllDiscount);

    const sortVouchers = (vouchersList) => {
        return vouchersList
            .sort((a, b) => {
                const isActiveA = a.conditionAmount <= totalPrice;
                const isActiveB = b.conditionAmount <= totalPrice;

                if (isActiveA && !isActiveB) return -1;
                if (!isActiveA && isActiveB) return 1;

                const aReduceAmount = a.percentReduce
                    ? (a.percentReduce / 100) * totalPrice
                    : a.reduceMaxAmount;
                const bReduceAmount = b.percentReduce
                    ? (b.percentReduce / 100) * totalPrice
                    : b.reduceMaxAmount;

                return bReduceAmount - aReduceAmount;
            });
    };

    const loadVouchers = async () => {
        try {
            const response = await voucherService.getAll();
            console.log(response)
            setListVoucherShipping(sortVouchers(response.listShippingVoucher));
            setListVoucherDiscount(sortVouchers(response.listDiscountVoucher));
        } catch (error) {
            console.error(error);
        }
    };

    const loadVoucherImages = async () => {
        try {
            const shippingImageResponse = await axios.get('http://localhost:8081/file/read-image/free_ship_voucher.png');
            const discountImageResponse = await axios.get('http://localhost:8081/file/read-image/discount_voucher.png');
            setImageShippingVoucher(shippingImageResponse.data);
            setImageDiscountVoucher(discountImageResponse.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadVouchers();
        loadVoucherImages();
    }, []);

    const handleConfirm = () => {
        setVoucherShipping(voucherChooseShipping);
        setVoucherDiscount(voucherChooseDiscount);
        setShowChooseVoucher(false);
    };

    return (
        <div style={{ width: "100%", height: "100%", backgroundColor: "#0006", position: "fixed", zIndex: 1, display: "flex" }}>
            <div className="voucher-container">
                <div className="voucher-header">
                    <div>Chọn Hyang Voucher</div>
                </div>
                <div className="voucher-body">
                    <div className="shipping-voucher" style={{ marginTop: 10 }}>
                        <div style={{ fontSize: 16 }}>Mã Giảm Chi Phí Vận Chuyển</div>
                        <div style={{ fontSize: 12, marginBottom: 10 }}>Có thể chọn 1 Voucher</div>
                        <div className="list-vouchers">
                            {(showAllShipping ? listVoucherShipping : listVoucherShipping.slice(0, 2)).map((item, index) => (
                                <VoucherItem
                                    key={index}
                                    item={item}
                                    totalPrice={totalPrice}
                                    choosen={item?.id === voucherChooseShipping?.id}
                                    setVoucherChoose={setVoucherChooseShipping}
                                    image={imageShippingVoucher}
                                />
                            ))}
                        </div>
                        {listVoucherShipping.length > 2 && (
                            <button className="btn-show" onClick={handleShowMoreShipping}>
                                {!showAllShipping ? "Xem thêm" : "Thu gọn"}
                                <FontAwesomeIcon icon={!showAllShipping ? faChevronDown : faChevronUp} />
                            </button>
                        )}
                    </div>
                    <div className="shipping-voucher" style={{ marginTop: 10 }}>
                        <div style={{ fontSize: 16 }}>Mã Giảm Tiền Sản Phẩm</div>
                        <div style={{ fontSize: 12, marginBottom: 10 }}>Có thể chọn 1 Voucher</div>
                        <div className="list-vouchers">
                            {(showAllDiscount ? listVoucherDiscount : listVoucherDiscount.slice(0, 2)).map((item, index) => (
                                <VoucherItem
                                    key={index}
                                    item={item}
                                    totalPrice={totalPrice}
                                    choosen={item?.id === voucherChooseDiscount?.id}
                                    setVoucherChoose={setVoucherChooseDiscount}
                                    image={imageDiscountVoucher}
                                />
                            ))}
                        </div>
                        {listVoucherDiscount.length > 2 && (
                            <button className="btn-show" onClick={handleShowMoreDiscount}>
                                {!showAllDiscount ? "Xem thêm" : "Thu gọn"}
                                <FontAwesomeIcon icon={!showAllDiscount ? faChevronDown : faChevronUp} />
                            </button>
                        )}
                    </div>
                </div>
                <div className="voucher-footer">
                    <button className='voucher-btn voucher-btn-back' onClick={() => setShowChooseVoucher(false)}>
                        TRỞ LẠI
                    </button>
                    <button className='voucher-btn btn-submit' onClick={handleConfirm}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChooseVoucher;
