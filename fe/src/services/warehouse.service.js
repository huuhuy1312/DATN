import axios from "axios";
const API_URL = "http://localhost:8085/api/warehouse/";

class WarehouseService {
    async getAll() {
        const response = await axios.get(API_URL+"static-admin")
        return response.data;
    }
    async save(body){
        const response = await axios.post(API_URL+"save",body);
        return response;
    }
    async deleteById(id){
        const response = await axios.delete(API_URL+"delete-by-id?id="+id);
        return response;
    }
    async getAllNoStatic()
    {
        const response = await axios.get(API_URL+"all")
        return response;
    }
}
export default new WarehouseService();