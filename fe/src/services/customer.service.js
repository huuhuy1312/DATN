import axios from "axios";
const API_URL = "http://localhost:8080/api/customer/";

class CustomerService {
    async getByCustomerID(customer_id) {
        const response = await axios.get(API_URL + "get-info?customerId="+customer_id);
        return response;
    }

    async findAll() {
        const response = await axios.get(API_URL + "all");
        return response;
    }
}
export default new CustomerService();