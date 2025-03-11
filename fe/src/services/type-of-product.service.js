import axios from "axios";
const API_URL = "http://localhost:8083/api/type-of-product/";

class TypeOfProductService {
    async updateQuantity(quantity,topid){
        const response = await axios.get(API_URL+`update-quantity?soldQuantity=${quantity}&topId=${topid}`);
        return response;
    }
}
export default new TypeOfProductService();