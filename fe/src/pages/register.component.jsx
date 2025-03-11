import React, { useState,useEffect } from 'react';
import '../css/registerPage1.css';
import authService from '../services/auth.service';
import emailService from '../services/email.service';
import { useNavigate } from 'react-router-dom';
import OTPForm from './components/OTPForm';
const Register = () => {
  const navigate = useNavigate();
  const [requestRegister, setRequestRegister] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    gender: ''
  });
  // useEffect(()=>{
  //   localStorage.removeItem("user");
  // },[])
  const [requestLogin,setRequestLogin] = useState({
    username:"",
    password:""
  })
  const [step,setStep] = useState("login")
  const [confirmPassword, setConfirmPassword] = useState('');
  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setRequestRegister(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const onChangeHandleLogin = (e) => {
    const { name, value } = e.target;
    setRequestLogin(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const onGenderChange = (e) => {
    setRequestRegister(prevState => ({
      ...prevState,
      gender: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    // Simple validation for password match
    if (requestRegister.password === confirmPassword) {
      const response = await emailService.sendEmail(requestRegister.email);
      console.log(response.data)
      if(response.status ==200){
      }else{
        alert('Registration failed. Please try again.');
      }
    }
    setStep("validate-email")
  };
  const submitRegister = async()=>{
    try {
      const response = await authService.register(requestRegister);
      return response;
    } catch (error) {
      // Handle error
      console.error('Error during registration:', error);
      alert('Registration failed. Please try again.');
    }
  }
  const moveToNext = (e, nextFieldId) => {
    if (e.target.value.length === 1) {
      document.getElementById(nextFieldId)?.focus();
    }
  };
  const handleSubmitLogin =  async (e)=>{
    e.preventDefault()
    try{
      console.log(requestLogin)
      const response = await authService.login(requestLogin);
      console.log(response.data)
      if(response.status ==200){
        if(response?.data?.role == "ROLE_ADMIN")
        {
            navigate("/admin")
        }else if(response?.data?.role == "ROLE_SELLER" || response?.data?.role == "ROLE_USER"){
          navigate("/")

        }else if(response?.data?.role == "ROLE_WAREHOUSE_OWNER"){
          navigate("/warehouse-owner")
        }else if(response?.data?.role == "ROLE_SHIPPER"){
          navigate("/shipper")
        }
      }else{
        alert("Vui lòng nhập lại mật khẩu!");
      }
    }catch (error) {
      // Handle error
      console.error('Error during registration:', error);
      alert('Registration failed. Please try again.');
    }
  }
  return (
    <div style={{display:"flex",padding:"0px 30px",alignItems:"center"}} className='pageRegister'>
      <div style={{width:"50%"}}>
        <img src="/icon_shop_main.png"></img>
      </div>
      {
       step == "register" &&(
          <div style={{width:"40%"}} className="container1">
            <div className="title">Đăng Ký</div>
            <div className="content" style={{width:"100%",background:"none"}}>
              <form onSubmit={handleSubmit}>
                <div className="user-details">
                  <div className="input-box">
                    <span className="details">Tên đầy đủ</span>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      name="fullName"
                      value={requestRegister.fullName}
                      onChange={onChangeHandle}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">Tên đăng nhập</span>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      name="username"
                      value={requestRegister.username}
                      onChange={onChangeHandle}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">Email</span>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={requestRegister.email}
                      onChange={onChangeHandle}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">Số điện thoại</span>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      name="phoneNumber"
                      value={requestRegister.phoneNumber}
                      onChange={onChangeHandle}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">Mật khẩu</span>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      name="password"
                      value={requestRegister.password}
                      onChange={onChangeHandle}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">Xác nhận mật khẩu</span>
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="gender-details">
                  <input
                    type="radio"
                    name="gender"
                    id="dot-1"
                    value="Nam"
                    checked={requestRegister.gender === 'Nam'}
                    onChange={onGenderChange}
                  />
                  <input
                    type="radio"
                    name="gender"
                    id="dot-2"
                    value="Nữ"
                    checked={requestRegister.gender === 'Nữ'}
                    onChange={onGenderChange}
                  />
                  <input
                    type="radio"
                    name="gender"
                    id="dot-3"
                    value="Giới tính khác"
                    checked={requestRegister.gender === 'Giới tính khác'}
                    onChange={onGenderChange}
                  />
                  <span className="gender-title">Giới tính</span>
                  <div className="category">
                    <label htmlFor="dot-1">
                      <span className="dot one"></span>
                      <span className="gender">Nam</span>
                    </label>
                    <label htmlFor="dot-2">
                      <span className="dot two"></span>
                      <span className="gender">Nữ</span>
                    </label>
                    <label htmlFor="dot-3">
                      <span className="dot three"></span>
                      <span className="gender">Giới tính khác</span>
                    </label>
                  </div>
                </div>
                <div className="button1">
                  <input type="submit" value="Đăng ký" />
                </div>
                <div className='btn-convert' onClick={()=>setStep("login")}>Bạn đã có tài khoản?</div>
              </form>
              
            </div>
          </div>
       )
      }
      {
        step === "validate-email" && (
          <div style={{ width: "30%"  }} className="container-email">
            <OTPForm email={requestRegister.email} setStep={setStep} sendEmailFunc ={handleSubmit} submitRegister={submitRegister}/>
          </div>
        )
      }
      {
        step === "login" && (
          <div style={{width:"40%"}} className="container1">
            <div className="title">Đăng Nhập</div>
            <div className="content" style={{width:"100%",background:"none"}}>
              <form onSubmit={handleSubmitLogin}>
                <div className="user-details">
                  <div className="input-box" style={{width:"100%"}}>
                    <span className="details">Tên đăng nhập</span>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      name="username"
                      value={requestLogin.username}
                      onChange={onChangeHandleLogin}
                      required
                    />
                  </div>
                </div>
                <div className="user-details">
                  <div className="input-box" style={{width:"100%"}}>
                      <span className="details">Mật khẩu</span>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        value={requestLogin.password}
                        onChange={onChangeHandleLogin}
                        required
                      />
                  </div>
                </div>
                <div className="button1">
                  <input type="submit" value="Đăng Nhập" />
                </div>
                <div className='btn-convert' onClick={()=>setStep("register")}>Bạn chưa có tài khoản?</div>
              </form>
              
            </div>
          </div>
        )
      }
    </div>
    
  );
};

export default Register;
{/* <div className="title" style={{ textAlign: "center" }}>Xác nhận mã OTP</div>
            <div> Mã xác thực đã được gửi qua email: {maskEmail(requestRegister.email)}</div>
            
            <div className="otp-container" style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <input
                type="text"
                maxLength="1"
                onInput={(e) => moveToNext(e, 'otp2')}
                id="otp1"
                autoFocus
              />
              <input
                type="text"
                maxLength="1"
                onInput={(e) => moveToNext(e, 'otp3')}
                id="otp2"
              />
              <input
                type="text"
                maxLength="1"
                onInput={(e) => moveToNext(e, 'otp4')}
                id="otp3"
              />
              <input
                type="text"
                maxLength="1"
                onInput={(e) => moveToNext(e, 'otp5')}
                id="otp4"
              />
              <input
                type="text"
                maxLength="1"
                onInput={(e) => moveToNext(e, 'otp6')}
                id="otp5"
              />
              <input type="text" maxLength="1" id="otp6" />
            </div> */}