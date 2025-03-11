import axios from "axios";
const API_URL = "http://localhost:8085/api/order-line/";

class OrderLineService {
    async getByCondition(condition) {
        const response = await axios.post(API_URL + `search`,condition);
        return response.data;
    }
    async updateOrderLine(body)
    {
        const response = await axios.post(API_URL+`update`,body);
        console.log(response)
        return response;
    }
    async countOrderLineByType(id)
    {
        const response = await axios.post(API_URL+`count-order-line-by-type${id==null?"":`?idAccountWarehouse=${id}`}`);
        console.log(response)
        return response;
    }
    async countOrderLineOfShipperByType(id)
    {
        const response = await axios.post(API_URL+`count-order-line-of-shipper-by-type${id==null?"":`?idAccountShipper=${id}`}`);
        console.log(response)
        return response;
    }

    async getOrderLinesAndCustomerOfSeller(sellerId){
        const response = await axios.get(API_URL + `order-and-customer-of-seller?idSeller=${sellerId}`);
        return response.data;
    }
    async getProcess(id)
    {
        const response = await axios.get(API_URL+ `get-process?id=${id}`);
        return response.data;
    }
    async staticByAdmin()
    {
        const response = await axios.get(API_URL+"static-by-admin");
        return response;
    }
}
export default new OrderLineService();