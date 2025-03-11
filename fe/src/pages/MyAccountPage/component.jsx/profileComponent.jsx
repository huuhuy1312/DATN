import React, { useState } from "react";
import "./profileComponent.css";

function ProfileComponent({customerInfo}) {
  // Function to get current date
  const getCurrentDate = () => {
    const today = new Date();
    return {
      day: today.getDate(),
      month: today.getMonth() + 1, // Months are zero-indexed
      year: today.getFullYear(),
    };
  };
  console.log(customerInfo)
  const [username, setUsername] = useState(customerInfo?.username);
  const [name, setName] = useState(customerInfo?.fullName);
  const [email, setEmail] = useState(customerInfo?.email);
  const [phone, setPhone] = useState(customerInfo?.phoneNumber);
  const [gender, setGender] = useState(customerInfo?.gender);
  const [dob, setDob] = useState(getCurrentDate());

  // Handle phone input change
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  // Handle gender selection change
  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  // Handle date of birth change
  const handleDobChange = (e) => {
    const { name, value } = e.target;
    setDob({
      ...dob,
      [name]: parseInt(value, 10),
    });
  };

  // Get the number of days in a month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate(); // Get the last date of the month
  };

  return (
    <div >
      <div className="profile-header">
        <div>Hồ Sơ Của Tôi</div>
        <div style={{fontWeight:400, color:"rgba(0,0,0,0.5)",fontSize:14}}>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <div className="profile-body">
        <div className="profile-body-content col-md-8">
          <div className="item-profile">
            <div className="item-profile-header ">Tên đăng nhập</div>
            <div className="item-profile-content ">
              <input type="text" value={username} disabled />
            </div>
          </div>

          <div className="item-profile">
            <div className="item-profile-header ">Tên</div>
            <div className="item-profile-content">
              <input type="text" value={name} />
            </div>
          </div>

          <div className="item-profile">
            <div className="item-profile-header">Email</div>
            <div className="item-profile-content ">{email}</div>
          </div>

          <div className="item-profile">
            <div className="item-profile-header ">Số điện thoại</div>
            <div className="item-profile-content">
              <input
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Thêm"
              />
            </div>
          </div>

          <div className="item-profile">
            <div className="item-profile-header ">Giới tính</div>
            <div className="item-profile-content" style={{ display: "flex" }}>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Nam"
                  checked={gender === "Nam"}
                  onChange={handleGenderChange}
                />
                Nam
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Nữ"
                  checked={gender === "Nữ"}
                  onChange={handleGenderChange}
                />
                Nữ
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Khác"
                  checked={gender === "Khác"}
                  onChange={handleGenderChange}
                />
                Khác
              </label>
            </div>
          </div>

          <div className="item-profile">
            <div className="item-profile-header">Ngày sinh</div>
            <div className="item-profile-content" style={{ display: "flex" }}>
              {/* Day dropdown */}
              <select name="day" value={dob.day} onChange={handleDobChange}>
                {[...Array(getDaysInMonth(dob.month, dob.year)).keys()].map(
                  (day) => (
                    <option key={day + 1} value={day + 1}>
                      {day + 1}
                    </option>
                  )
                )}
              </select>

              {/* Month dropdown */}
              <select name="month" value={dob.month} onChange={handleDobChange}>
                {[...Array(12).keys()].map((month) => (
                  <option key={month + 1} value={month + 1}>
                    Tháng {month + 1}
                  </option>
                ))}
              </select>

              {/* Year dropdown */}
              <select name="year" value={dob.year} onChange={handleDobChange}>
                {[...Array(101).keys()].map((year) => (
                  <option key={2024 - year} value={2024 - year}>
                    {2024 - year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="item-profile">
            <button className="save-btn">Lưu</button>
          </div>
        </div>
        <div className="profile-body-image col-md-4">

        </div>
      </div>
    </div>
  );
}

export default ProfileComponent;
