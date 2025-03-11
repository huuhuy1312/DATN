import axios from "axios";
import { useEffect, useState } from "react";
import "./AddAddressComponent.css";
import addressService from "../../services/address.service";

const AddAddressComponent = ({ addressDefault, setAddAddressVisible }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(addressDefault)
  // Đảm bảo rằng formData được khởi tạo với addressDefault
  const [formData, setFormData] = useState(addressDefault);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  // Các trạng thái cho thành phố, quận, phường
  const [selectedCity, setSelectedCity] = useState(addressDefault?.city || "");
  const [selectedDistrict, setSelectedDistrict] = useState(addressDefault?.district || "");
  const [selectedWard, setSelectedWard] = useState(addressDefault?.ward || "");

  // Khi addressDefault thay đổi, cập nhật selectedCity, selectedDistrict, selectedWard
  useEffect(() => {
    setSelectedCity(addressDefault?.city || "");
    setSelectedDistrict(addressDefault?.district || "");
    setSelectedWard(addressDefault?.ward || "");
    setFormData(addressDefault); // Cập nhật formData nếu cần thiết
  }, [addressDefault]);

  // Lấy dữ liệu tỉnh/thành phố
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCities();
  }, []);

  // Fetch districts when selectedCity changes
  useEffect(() => {
    if (selectedCity) {
      const city = cities.find((c) => c.Name === selectedCity);
      setDistricts(city ? city.Districts : []);
    }
  }, [selectedCity, cities]);

  // Fetch wards when selectedDistrict changes
  useEffect(() => {
    if (selectedDistrict) {
      const district = districts.find((d) => d.Name === selectedDistrict);
      setWards(district ? district.Wards : []);
    }
  }, [selectedDistrict, districts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addAddress = async (body) => {
    const response = await addressService.addAddress(body);
    console.log(response);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      city: selectedCity,
      district: selectedDistrict,
      ward: selectedWard,
      customerId: user?.id,
    };
    console.log(updatedFormData);
    addAddress(updatedFormData);
    setAddAddressVisible(false);
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setSelectedDistrict(""); // Reset quận khi thành phố thay đổi
    setSelectedWard(""); // Reset phường khi quận thay đổi
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setSelectedWard(""); // Reset phường khi quận thay đổi
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  return (
    <div className="acc-container">
      <form className="acc-form" onSubmit={handleSubmit}>
        <div className="acc-form-group">
          <label htmlFor="nameUser" style={{ width: "35%", margin: "auto" }}>
            Họ & Tên
          </label>
          <input
            type="text"
            id="nameUser"
            name="nameUser"
            value={formData.nameUser}
            onChange={handleChange}
            placeholder="Nhập vào"
            required
          />
        </div>

        <div className="acc-form-group">
          <label htmlFor="phoneNumberUser" style={{ width: "35%", margin: "auto" }}>
            Số điện thoại
          </label>
          <input
            type="text"
            id="phoneNumberUser"
            name="phoneNumberUser"
            value={formData.phoneNumberUser}
            onChange={handleChange}
            placeholder="Nhập vào"
            required
          />
        </div>

        <div className="acc-form-group">
          <label htmlFor="city" style={{ width: "35%", margin: "auto" }}>
            Chọn tỉnh/thành phố
          </label>
          <select
            className="acc-form-select"
            id="city"
            onChange={handleCityChange}
            value={selectedCity || ""}
          >
            <option value="" disabled>
              Chọn tỉnh thành
            </option>
            {cities.map((city) => (
              <option key={city.Id} value={city.Name}>
                {city.Name}
              </option>
            ))}
          </select>
        </div>

        <div className="acc-form-group" style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "45%" }}>
            <label htmlFor="district">Chọn quận huyện</label>
            <select
              className="acc-form-select"
              id="district"
              onChange={handleDistrictChange}
              value={selectedDistrict || ""}
            >
              <option value="" disabled>
                Chọn quận huyện
              </option>
              {districts.map((district) => (
                <option key={district.Id} value={district.Name}>
                  {district.Name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ width: "45%" }}>
            <label htmlFor="ward">Chọn phường xã</label>
            <select
              className="acc-form-select"
              id="ward"
              onChange={handleWardChange}
              value={selectedWard || ""}
            >
              <option value="" disabled>
                Chọn phường xã
              </option>
              {wards.map((ward) => (
                <option key={ward.Id} value={ward.Name}>
                  {ward.Name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="acc-form-group">
          <label htmlFor="addressDetails" style={{ width: "35%", margin: "auto" }}>
            Địa chỉ chi tiết
          </label>
          <input
            id="addressDetails"
            name="addressDetails"
            value={formData.addressDetails}
            onChange={handleChange}
            placeholder="Số nhà, tên đường...v.v."
            required
          />
        </div>

        <div className="acc-form-group" style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="submit" className="acc-save-btn">
            Lưu
          </button>
          <button type="button" onClick={() => setAddAddressVisible(false)} className="acc-cancel-btn">
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressComponent;
