import axios from "axios";
const API_URL = "http://localhost:8085/api/address";

class AddressService {
    async getByCustomerId(customerId) {
        const response = await axios.get(API_URL + `/find-by-customer-id?customerId=${customerId}`);
        return response.data;
    }

    async findAddressNearAddress(addressId) {
        const response = await axios.get(API_URL + `/find-address-near-address?addressId=${addressId}&page=0&size=5`);
        return response.data;
    }
    async addAddress(body){
        const response = await axios.post(API_URL +"/add",body)
        return response.data;
    }

    async updateAddress(body){
        const response = await axios.post(API_URL +"/update",body)
        return response.data;
    }

    async getBySellerId(sellerId) {
        const response = await axios.get(API_URL + `/find-by-seller-id?sellerId=${sellerId}`);
        return response.data;
    }

}
export default new AddressService();