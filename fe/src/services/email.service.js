import axios from "axios";
const API_URL = "http://localhost:8080/api/email/";

class EmailService {
    async sendEmail(email) {
        const response = await axios.post(API_URL + `send?email=${email}`);
        return response;
    }

}
export default new EmailService();