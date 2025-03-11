import React, { useEffect, useState } from "react";
import "../../../css/seller/registerToSellerPage.css";
import AddAddressForm from "../components/AddAddressForm";
import sellerService from "../../../services/seller.service";
import { useNavigate } from "react-router-dom";
import SuccessComponent from "../../components/SuccessComponent";
const RegisterToSellerPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [addAddressVisible, setAddAddressVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const navigate = useNavigate(); // Quản lý lỗi theo từng trường
  const [formData, setFormData] = useState({
    nameShop: "",
    addressShop: null,
    avatarShop : null,
    email: "",
    phoneNumber: "",
    CIN: "",
    fullName: "",
    imageCICard: null,
    imageHoldCICard: null,
  });
  const [showNoticeSuccess,setShowNoticeSuccess] = useState(false);
  const [imageFrontPreview, setImageFrontPreview] = useState(null);
  const [imageHoldPreview, setImageHoldPreview] = useState(null);
  const [avatarShop, setAvatarShop] = useState(null);
  const [isHaveRequest,setIsHaveRequest] = useState(false)
  const getRequest = async (user)=>{
    const response = await sellerService.findByAccountId(user?.id);
    console.log(response)
    if(response?.isActive == false && response?.isDeleted == false)
    {
      setIsHaveRequest(true)
    }
  }
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserInfo(user);
    }
    getRequest(user)

  }, []);

  const validateFields = () => {
    const errors = {};
    if (currentStep === 1) {
      if (!formData.nameShop.trim()) errors.nameShop = "Tên shop không được để trống.";
      if (!formData.addressShop) errors.addressShop = "Vui lòng chọn địa chỉ lấy hàng.";
      if (!formData.email.trim()) errors.email = "Email không được để trống.";
      if (!formData.phoneNumber.trim()) errors.phoneNumber = "Số điện thoại không được để trống.";
    } else if (currentStep === 2) {
      if (!formData.CIN.trim()) errors.CIN = "Số CCCD không được để trống.";
      if (!formData.fullName.trim()) errors.fullName = "Họ và tên không được để trống.";
      if (!formData.avatarShop) errors.avatarShop = "Vui lòng tải lên hình ảnh avatar của shop";
      if (!formData.imageCICard) errors.imageCICard = "Vui lòng tải lên hình ảnh CCCD.";
      if (!formData.imageHoldCICard) errors.imageHoldCICard = "Vui lòng tải lên hình ảnh đang cầm CCCD.";
      if (!isConfirmed) errors.isConfirmed = "Bạn cần xác nhận thông tin trước khi tiếp tục.";
    }
    return errors;
  };

  const handleNext = () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors);
      return;
    }
    setErrorMessage({});
    setCurrentStep((prev) => prev + 1);
    if (currentStep === 2) {
      sendRequestAddSeller();
    }
  };

  const handlePrev = () => {
    if(currentStep == 1)
    {
        navigate("/user")
    }
    setCurrentStep((prev) => prev - 1);
  };

  const sendRequestAddSeller = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("accountId", userInfo?.id);
      formDataToSend.append("shopName", formData.nameShop);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("CIN", formData.CIN);
      formDataToSend.append("fullName", formData.fullName);
      if (formData.avatarShop) {
        formDataToSend.append("avatarShop", formData.avatarShop);
      }
      if (formData.imageCICard) {
        formDataToSend.append("imageCICard", formData.imageCICard);
      }
      if (formData.imageHoldCICard) {
        formDataToSend.append("imageHoldCICard", formData.imageHoldCICard);
      }
      formDataToSend.append("city", formData.addressShop?.city);
      formDataToSend.append("nameUser", formData.addressShop?.name);
      formDataToSend.append("phoneNumberUser", formData.addressShop?.phone);
      formDataToSend.append("district", formData.addressShop?.district);
      formDataToSend.append("ward", formData.addressShop?.ward);
      formDataToSend.append("addressDetails", formData.addressShop?.addressDetails);

      const response = await sellerService.add(formDataToSend);

      if (response.status === 200) {
        alert("Thành công");
        setShowNoticeSuccess(true)
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const showAddress = () => {
    return (
      formData.addressShop?.addressDetails +
      ", " +
      formData.addressShop?.ward +
      ", " +
      formData.addressShop?.district +
      ", " +
      formData.addressShop?.city
    );
  };

  const handleChangeAddressShop = (value) => {
    setFormData({
      ...formData,
      addressShop: value,
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        [e.target.name]: file,
      });
      const imageUrl = URL.createObjectURL(file);
      if (e.target.name === "imageCICard") setImageFrontPreview(imageUrl);
      else if (e.target.name === "imageHoldCICard") setImageHoldPreview(imageUrl);
      else setAvatarShop(imageUrl)
    }
  };

  return (
    <div className="shop-form-container">
      {isHaveRequest == true && <SuccessComponent content={"Yêu cầu trở thành người bán của bạn đã được gửi. \nVui lòng chờ quản trị viên xác nhận !!!"}/>}
      {showNoticeSuccess == true && <SuccessComponent content={"Yêu cầu trở thành người bán đã được gửi"}/>}
      {addAddressVisible && (
        <div className="overlay">
          <AddAddressForm
            address={formData.addressShop}
            setAddAddressVisible={setAddAddressVisible}
            handleChangeAddressShop={handleChangeAddressShop}
          />
        </div>
      )}
      <div className="stepper">
        <div className={`step ${currentStep === 1 ? "active" : ""}`}>
          <span className="circle"></span>
          Thông tin Shop
        </div>
        <div className={`step ${currentStep === 2 ? "active" : ""}`}>
          <span className="circle"></span>
          Thông tin định danh
        </div>
        <div className={`step ${currentStep === 3 ? "active" : ""}`}>
          <span className="circle"></span>
          Hoàn tất
        </div>
      </div>

      {currentStep === 1 && (
        <form className="shop-form">
          <div className="form-group">
            <label>Tên Shop</label>
            <input
              type="text"
              value={formData.nameShop}
              name="nameShop"
              onChange={handleInputChange}
              maxLength="30"
              required
            />
            <div className="char-count">{formData.nameShop.length}/30</div>
            {errorMessage.nameShop && <span className="error">{errorMessage.nameShop}</span>}
          </div>
          <div className="form-group">
              <label>Avatar Shop</label>
              {avatarShop && (
                <div>
                  <img
                    src={avatarShop}
                    alt="Preview"
                    style={{ maxWidth: "200px", marginTop: "10px" }}
                  />
                </div>
              )}
              <input
                type="file"
                name="avatarShop"
                onChange={handleFileChange}
                accept="image/*"
              />
              {errorMessage.avatarShop && <span className="error">{errorMessage.avatarShop}</span>}
            </div>
          <div className="form-group">
            <label>Địa chỉ lấy hàng</label>
            <button
              type="button"
              className="add-address-btn"
              onClick={() => setAddAddressVisible(!addAddressVisible)}
            >
              {formData.addressShop == null ? "+ Thêm" : `${showAddress()}`}
            </button>
            {errorMessage.addressShop && <span className="error">{errorMessage.addressShop}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              value={formData.email}
              name="email"
              onChange={handleInputChange}
              required
            />
            {errorMessage.email && <span className="error">{errorMessage.email}</span>}
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              name="phoneNumber"
              onChange={handleInputChange}
              placeholder="+84 367"
              required
            />
            {errorMessage.phoneNumber && <span className="error">{errorMessage.phoneNumber}</span>}
          </div>
        </form>
      )}

      {currentStep === 2 && (
        <div className="form-step-placeholder shop-form">
          <h2>Điền các Thông tin Định danh</h2>
          <form>
            <div className="form-group">
              <label>Số Căn Cước Công Dân (CCCD)</label>
              <input
                type="text"
                name="CIN"
                maxLength="12"
                value={formData.CIN}
                onChange={handleInputChange}
                placeholder="Nhập vào"
              />
              {errorMessage.CIN && <span className="error">{errorMessage.CIN}</span>}
            </div>
            <div className="form-group">
              <label>Họ & Tên</label>
              <input
                type="text"
                name="fullName"
                maxLength="100"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Nhập vào"
              />
              {errorMessage.fullName && <span className="error">{errorMessage.fullName}</span>}
            </div>
            <div className="form-group">
              <label>Hình chụp của thẻ CMND/CCCD/Hộ chiếu</label>
              {imageFrontPreview && (
                <div>
                  <img
                    src={imageFrontPreview}
                    alt="Preview"
                    style={{ maxWidth: "200px", marginTop: "10px" }}
                  />
                </div>
              )}
              <input
                type="file"
                name="imageCICard"
                onChange={handleFileChange}
                accept="image/*"
              />
              {errorMessage.imageCICard && <span className="error">{errorMessage.imageCICard}</span>}
            </div>
            <div className="form-group">
              <label>Ảnh đang cầm CMND/CCCD/Hộ chiếu của bạn</label>
              {imageHoldPreview && (
                <div>
                  <img
                    src={imageHoldPreview}
                    alt="Preview"
                    style={{ maxWidth: "200px", marginTop: "10px" }}
                  />
                </div>
              )}
              <input
                type="file"
                name="imageHoldCICard"
                onChange={handleFileChange}
                accept="image/*"
              />
              {errorMessage.imageHoldCICard && (
                <span className="error">{errorMessage.imageHoldCICard}</span>
              )}
            </div>
            <div className="form-group" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  name="agreement"
                  checked={isConfirmed}
                  onChange={() => setIsConfirmed((prev) => !prev)}
                  style={{ width: "20px" }}
                />
                <div style={{ lineHeight: "20px", marginLeft: "10px" }}>
                  Tôi xác nhận tất cả dữ liệu đã cung cấp là chính xác và trung thực. Tôi đã đọc và đồng ý với Chính Sách Bảo Mật của Hyyang.
                </div>
              </div>
              {errorMessage.isConfirmed && (
                <span className="error">{errorMessage.isConfirmed}</span>
              )}
            </div>
          </form>
        </div>
      )}


      { currentStep <3 &&(
      <div className="form-buttons">
        <button type="button" className="prev-btn" onClick={handlePrev}>
          {currentStep == 1?"Quay trở lại trang chủ":"Quay lại"}
        </button>
        <button type="button" className="next-btn" onClick={handleNext}>
        {currentStep == 1?"Tiếp theo":"Gửi yêu cầu"}
        </button>
      </div>)
      }
    </div>
  );
};

export default RegisterToSellerPage;
