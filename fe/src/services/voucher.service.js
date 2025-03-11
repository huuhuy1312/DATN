import axios from "axios";
const API_URL = "http://localhost:8085/api/voucher/";

class VoucherService {
    async getAll() {
        const response = await axios.get(API_URL+"all")
        return response.data;
    }
    async staticRateByPid(product_id){
        const response = await axios.get(API_URL+"static-by-product-id?pid="+product_id)
        return response.data;
    }
    async add(body)
    {
        console.log(body)
        const response = await axios.post(API_URL+"add",body)
        return response;
    }
}
export default new VoucherService();