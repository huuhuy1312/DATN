import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import sellerService from "../../../../../services/seller.service";
import "./RequestRegisterSellerDetails.css";
import addressService from "../../../../../services/address.service";
import { useNavigate } from "react-router-dom";
const RequestRegisterSellerDetails = () => {

  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL
  const [infoDetails, setInfoDetails] = useState(null);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [addressInfo,setAddressInfo] = useState(null);

  // Hàm lấy thông tin chi tiết từ API
  const getInfoDetails = async () => {
    try {
      const response = await sellerService.findById(id);
      console.log(response) // Gọi API với ID
      setInfoDetails(response); // Lưu thông tin trả về vào state
    } catch (error) {
      console.error("Error fetching seller details:", error);
    }
  };
  const getAddress=async ()=>{
    const response = await addressService.getBySellerId(id);
    setAddressInfo(response);
  }
  useEffect(() => {
    getInfoDetails(); // Gọi API khi component mount
    getAddress();
  }, []);

  const handleReject = () => {
    setShowRejectPopup(true);
  };

  const handleAccept = () => {
    setShowAcceptPopup(true);
  };

  const closePopup = () => {
    setShowRejectPopup(false);
    setShowAcceptPopup(false);
    setRejectReason("");
  };
  const submitHandle=async ()=>{
    const body = {
      "idAddress": addressInfo.id,
      "idSeller" : infoDetails?.id,
      "reason":rejectReason
    }
    const response = await sellerService.rejectRequest(body);
    
      navigate(`/ship-provider/page`); // Chuyển hướng đến URL chi tiết với ID
    
  }
  return (
    <div className="rrsd-container">
      <h1 className="rrsd-title">Chi tiết yêu cầu</h1>

      {infoDetails ? (
        <div className="rrsd-table">
          <div className="rrsd-table-row">
            <div className="rrsd-label">Tên shop:</div>
            <div className="rrsd-value">{infoDetails.shopName}</div>
          </div>
          <div className="rrsd-table-row">
            <div className="rrsd-label">Email:</div>
            <div className="rrsd-value">{infoDetails.email}</div>
          </div>
          <div className="rrsd-table-row">
            <div className="rrsd-label">Số điện thoại:</div>
            <div className="rrsd-value">{infoDetails.phoneNumber}</div>
          </div>
          <div className="rrsd-table-row">
            <div className="rrsd-label">Số định dang:</div>
            <div className="rrsd-value">{infoDetails.CIN}</div>
          </div>
          <div className="rrsd-table-row">
            <div className="rrsd-label">Tên chủ shop:</div>
            <div className="rrsd-value">{infoDetails.fullName}</div>
          </div>
          <div className="rrsd-table-row">
            <div className="rrsd-label">Địa chỉ shop:</div>
            <div className="rrsd-value">{`${addressInfo?.addressDetails},  ${addressInfo?.ward}, ${addressInfo?.district},${addressInfo?.city}`}</div>
          </div>
          <div className="rrsd-table-row">
            <div className="rrsd-label">Thẻ định danh:</div>
            <div className="rrsd-value">
              <img
                className="rrsd-image"
                src={infoDetails.imageCICard}
                alt="CIC Card"
              />
            </div>
          </div>
          <div className="rrsd-table-row">
            <div className="rrsd-label">Ảnh chụp cầm thẻ:</div>
            <div className="rrsd-value">
              <img
                className="rrsd-image"
                src={infoDetails.imageHoldCICard}
                alt="Holding CIC Card"
              />
            </div>
          </div>

        </div>
      ) : (
        <p>Loading seller details...</p>
      )}

      <div className="rrsd-actions">
        <button className="rrsd-button rrsd-accept" onClick={handleAccept}>
          Accept
        </button>
        <button className="rrsd-button rrsd-reject" onClick={handleReject}>
          Reject
        </button>
      </div>

      {showRejectPopup && (
        <div className="rrsd-popup">
          <div className="rrsd-popup-content">
            <h2>Lý do từ chối</h2>
            <textarea
              className="rrsd-textarea"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Vui lòng nhập lý do..."
            />
            <div className="rrsd-popup-buttons">
              <button className="rrsd-button rrsd-cancel" onClick={closePopup}>
                Cancel
              </button>
              <button className="rrsd-button rrsd-submit" onClick={()=>submitHandle()}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

    
    </div>
  );
};

export default RequestRegisterSellerDetails;
