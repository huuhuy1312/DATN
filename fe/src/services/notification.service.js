import axios from "axios";
const API_URL = "http://localhost:8040/api/notifications"; // The endpoint to manage notifications

class NotificationService {
  // Add a new notification
  async addNotification(notificationData) {
    const response = await axios.post(API_URL, notificationData);
    return response.data;
  }

  // Get notifications by objectName and objectId
  async getNotificationsByObject(objectName, objectId) {
    const response = await axios.get(API_URL + "/object", {
      params: { objectName, objectId }
    });
    return response.data;
  }
}

export default new NotificationService();
