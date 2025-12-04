import ApiClient from "./api.service";

class BookService {
  constructor(baseUrl = "/api/book") {
    this.api = ApiClient(baseUrl);
  }

  async getAllBooks() {
    return (await this.api.get("/")).data;
  }

  async getBook(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async createBook(data) {
    try {
      const response = await this.api.post("/", data);
      return response.data;
    } catch (error) {
      console.error("Error create book:", error.response || error);
      throw error;
    }
  }

  async updateBook(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async deleteBook(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async deleteAllBooks() {
    return (await this.api.delete("/")).data;
  }
}

export default BookService;
