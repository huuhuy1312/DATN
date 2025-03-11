import axios from "axios";

const API_URL = "http://localhost:8085/api/shipper";
class ShipperService{
    
    async findByWarehouse(whid){
        try{
            const response = await axios.get(API_URL +`/find-by-warehouse?warehouseId=${whid}`)
            return response.data;
        }catch (error) {
            console.error("Error find shipper:", error);
            throw error;
        }
    }

    async findByAccountWarehouse(whid){
        try{
            const response = await axios.get(API_URL +`/find-by-account-warehouse?accountId=${whid}`)
            return response.data;
        }catch (error) {
            console.error("Error find shipper:", error);
            throw error;
        }
    }
    async statisByWarehouse(whid){
        try{
            const response = await axios.get(API_URL +`/static-by-warehouse?warehouseId=${whid}`)
            return response.data;
        }catch (error) {
            console.error("Error find shipper:", error);
            throw error;
        }
    }
    async add(body)
    {
        const response = await axios.post(API_URL+"/add",body)
        return response;
    }
    async all()
    {
        const response = await axios.get(API_URL+"/all")
        return response;
    }
}
export default new ShipperService();