import ApiClient from "./api.service";

class BorrowService {
  constructor(baseUrl = "/api/borrow") {
    this.api = ApiClient(baseUrl);
  }

  async getAllBorrow() {
    return (await this.api.get("/")).data;
  }

  async getBorrow(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async createBorrow(data) {
    // console.log(data);
    try {
      const response = await this.api.post("/", data);
      return response.data;
    } catch (error) {
      console.error("Error while creating Borrow:", error.response || error);
      throw error;
    }
  }

  async updateBorrow(id, data) {
    // console.log(id);
    return (await this.api.put(`/${id}`, data)).data;
  }

  async deleteBorrow(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async deleteAllBorrow() {
    return (await this.api.delete("/")).data;
  }
}

export default BorrowService;
