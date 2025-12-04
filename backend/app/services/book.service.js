import Book from "./../models/book.model.js";
class BookService {
  extractBookData(payload) {
    const book = {
      title: payload.title,
      price: payload.price,
      quantity: payload.quantity,
      publishYear: payload.publishYear,
      publisher_id: payload.publisher_id,
      author: payload.author,
      categories: payload.categories,
      image_URL: payload.image_URL,
    };
    Object.keys(book).forEach((key) => {
      return book[key] === undefined && delete book[key];
    });
    return book;
  }

  async create(payload) {
    try {
      const book = this.extractBookData(payload);
      const result = new Book(book);
      return await result.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async find(filter) {
    return await Book.find(filter).populate("publisher_id");
  }

  async findByName(name) {
    return await Book.find({
      name: { $regex: name, $options: "i" },
    }).populate("publisher_id");
  }

  async findByID(id) {
    return await Book.findById({ _id: id }).populate("publisher_id");
  }

  async update(id, payload) {
    const update = this.extractBookData(payload);
    return await Book.findOneAndUpdate(
      { _id: id },
      { $set: update },
      { new: true }
    );
  }

  async delete(id) {
    return await Book.findOneAndDelete({ _id: id });
  }

  async deleteAll() {
    return (await Book.deleteMany({})).deletedCount;
  }
}

export default BookService;
