import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../../../css/seller/addAddressForm.css';

const AddAddressForm = ({ address, setAddAddressVisible, handleChangeAddressShop }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: null,
    district: null,
    ward: null,
    addressDetails: ''
  });
  
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Update formData with the existing address when the component mounts or address changes
  useEffect(() => {
    if (address) {
      setFormData(address);
      setSelectedCity(address.city);
      setSelectedDistrict(address.district);
      setSelectedWard(address.ward);
    }
  }, [address]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      city: selectedCity,
      district: selectedDistrict,
      ward: selectedWard,
    };
    setAddAddressVisible(false);
    handleChangeAddressShop(updatedFormData);
    
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setSelectedDistrict('');
    setSelectedWard('');
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setSelectedWard('');
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  return (
    <div className="address-form-container">
      <form className="address-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Họ & Tên</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập vào"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập vào"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">Chọn tỉnh/thành phố</label>
          <select
            className="form-select form-select-sm mb-3"
            id="city"
            aria-label=".form-select-sm"
            onChange={handleCityChange}
            value={selectedCity || ''}
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

        <div className="form-group" style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "45%" }}>
            <label htmlFor="district">Chọn quận huyện</label>
            <select
              className="form-select form-select-sm mb-3"
              id="district"
              aria-label=".form-select-sm"
              onChange={handleDistrictChange}
              value={selectedDistrict || ''}
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
              className="form-select form-select-sm"
              id="ward"
              aria-label=".form-select-sm"
              onChange={handleWardChange}
              value={selectedWard || ''}
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

        <div className="form-group">
          <label htmlFor="address">Địa chỉ chi tiết</label>
          <input
            id="address"
            name="addressDetails"
            value={formData.addressDetails}
            onChange={handleChange}
            placeholder="Số nhà, tên đường...v.v."
            required
          ></input>
        </div>

        <div className="form-group">
          <button type="submit" className="save-btn">Lưu</button>
          <button type="button" onClick={() => setAddAddressVisible(false)} className="cancel-btn">Hủy</button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressForm;
