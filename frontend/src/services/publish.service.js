import ApiClient from "./api.service";

class PublisherService {
  constructor(baseUrl = "/api/publisher") {
    this.api = ApiClient(baseUrl);
  }

  async getAllPublisher() {
    return (await this.api.get("/")).data;
  }

  async getPublisher(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async createPublisher(data) {
    try {
      console.log(data);
      const response = await this.api.post("/", data);
      return response.data;
    } catch (error) {
      console.error("Error while creating Publisher:", error.response || error);
      throw error;
    }
  }

  async updatePublisher(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async deletePublisher(id) {
    console.log(id);
    return (await this.api.delete(`/${id}`)).data;
  }

  async deleteAllPublisher() {
    return (await this.api.delete("/")).data;
  }
}

export default PublisherService;
