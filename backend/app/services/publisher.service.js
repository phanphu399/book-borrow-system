import Publisher from "./../models/publisher.model.js";
class PublisherService {
  extractData(payload) {
    const publisher = {
      name: payload.name,
      address: payload.address,
    };
    Object.keys(publisher).forEach((key) => {
      return publisher[key] === undefined && delete publisher[key];
    });
    return publisher;
  }

  async create(payload) {
    try {
      const book = this.extractData(payload);
      const result = new Publisher(book);
      return await result.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async find(filter) {
    return await Publisher.find(filter);
  }

  async findByName(name) {
    return await Publisher.find({
      name: { $regex: name, $options: "i" },
    });
  }

  async findByID(id) {
    return await Publisher.findById({ _id: id });
  }

  async update(id, payload) {
    const update = this.extractData(payload);
    return await Publisher.findOneAndUpdate(
      { _id: id },
      { $set: update },
      { new: true }
    );
  }

  async delete(id) {
    return await Publisher.findOneAndDelete({ _id: id });
  }

  async deleteAll() {
    return (await Publisher.deleteMany({})).deletedCount;
  }
}

export default PublisherService;
