import ApiClient from "./api.service";

class StaffService {
  constructor(baseUrl = "/api/Staff") {
    this.api = ApiClient(baseUrl);
  }

  async getAllStaff() {
    return (await this.api.get("/")).data;
  }

  async getStaff(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async updateStaff(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async deleteStaff(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async deleteAllStaf() {
    return (await this.api.delete("/")).data;
  }

  async register(data) {
    try {
      const response = await this.api.post("/register", data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async login(username, password) {
    try {
      const response = await this.api.post("/login", { username, password });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default StaffService;
