import React, { useState } from 'react';
import '../../css/OTPForm.css'; // Import CSS từ file riêng
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
function OTPForm({email,setStep,sendEmailFunc,submitRegister}) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const navigate = useNavigate();
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  function maskEmail(email) {
    const [localPart, domain] = email.split("@");  // Tách phần local và domain của email
    const maskedLocalPart = localPart.slice(0, 5) + "*****";  // Giữ 3 ký tự đầu và thêm dấu '*'
    return `${maskedLocalPart}@${domain}`;
  } 
  const handleSubmit1 = async ()=>{
    try{

      const response = await authService.checkOTPRegister(email,otp.join(''))
      console.log(response)
      if(response.status == 200){
        const response2 = await submitRegister();

        if(response2.status === 200){
          navigate('/user');
        }
      }else{
        alert(response.data)
      }
    }catch(error){
      console.error("Error during registration:",error)
      alert('Registration failed. Please try again.');
    }
    
  }
  return (
    <div className="otp-form">
      <div className="otp-header">
        <h4>Xác thực mã OTP</h4>
        <p>Mã xác thực đã được gửi qua Email: {maskEmail(email)}</p>
        <p>Vui lòng kiểm tra email để nhận mã OTP!</p>
      </div>
      <div className="otp-inputs">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            value={data}
            maxLength="1"
            onChange={e => handleChange(e.target, index)}
            onFocus={e => e.target.select()}
          />
        ))}
      </div>
      <div className="otp-actions">
        <button onClick={handleSubmit1}>Xác nhận</button>
        <button 
          onClick={(e) => {
            setOtp([...otp.map(v => "")]);  // Đặt lại OTP thành chuỗi rỗng
            sendEmailFunc(e);  
          }}
        >
          Gửi lại OTP
        </button>

      </div>
        <button className='button-back' onClick={() => setStep("register")}>Quay lại</button>
    </div>
  );
}

export default OTPForm;
