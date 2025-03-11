import React from "react";
import { useNavigate } from "react-router-dom";
import "./SuccessComponent.css";

const SuccessComponent = ({ content,setContent}) => {
  const lines = content.split("\n");
  const navigate = useNavigate(); 

  const redirectToLogin = () => {
    if(content === "Đặt hàng thành công" 
        || content == "Yêu cầu trở thành người bán đã được gửi"
        || content == "Yêu cầu trở thành người bán của bạn đã được gửi. \nVui lòng chờ quản trị viên xác nhận !!!"
    ) {
      navigate("/");
    } else if(content == "Thêm mới sản phẩm thành công"){
      setContent("Tất cả sản phẩm")
    }
  };

  return (
    <div className="sc-modal-background">
      <div className="sc-modal-content">
        {content == "Yêu cầu trở thành người bán của bạn đã được gửi. \nVui lòng chờ quản trị viên xác nhận !!!"
        ?<img src="/wait_icon.png" alt="Success" />
        :<img src="/success.png" alt="Success" />}
        <div style={{ color: "black", fontSize: 20 }}>
          {lines.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
        <button onClick={redirectToLogin}>
          {content === "Đặt hàng thành công" ? "Quay trở lại Trang Chủ" : ""}
          {content === "Yêu cầu trở thành người bán đã được gửi" ? "Quay trở lại Trang Chủ" : ""}
          {content === "Thêm mới sản phẩm thành công" ? "Quay trở lại" : ""}
          {content === "Yêu cầu trở thành người bán của bạn đã được gửi. \nVui lòng chờ quản trị viên xác nhận !!!" ? "Quay trở lại Trang Chủ":""}
        </button>
      </div>
    </div>
  );
};

export default SuccessComponent;
