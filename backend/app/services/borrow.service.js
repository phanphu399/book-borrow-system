import Borrow from "./../models/borrow.model.js";
class BorrowService {
  extractData(payload) {
    const borrow = {
      reader_id: payload.reader_id,
      staff_id: payload.staff_id,
      book_id: payload.book_id,
      borrowDate: payload.borrowDate || new Date(),
      returnDate:
        payload.returnDate ||
        (() => {
          const date = new Date();
          date.setDate(date.getDate() + 15);
          return date;
        })(),
      status: payload.status || "pending",
    };

    Object.keys(borrow).forEach((key) => {
      return borrow[key] === undefined && delete borrow[key];
    });
    return borrow;
  }

  async create(payload) {
    try {
      const borrow = this.extractData(payload);
      const result = new Borrow(borrow);
      return await result.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async find(filter) {
    return await Borrow.find(filter)
      .populate({ path: "reader_id", model: "Reader" })
      .populate({
        path: "book_id",
        populate: {
          path: "publisher_id",
          model: "Publisher",
        },
      })
      .populate({
        path: "staff_id",
        model: "Staff",
      });
  }

  async findByID(id) {
    return await Borrow.findById({ _id: id })
      .populate({ path: "reader_id", model: "Reader" })
      .populate({
        path: "book_id",
        populate: {
          path: "publisher_id",
          model: "Publisher",
        },
      })
      .populate({
        path: "staff_id",
        model: "Staff",
      });
  }
  async findByReaderId(reader_id) {
    return await Borrow.find({ reader_id: reader_id });
  }

  async update(id, payload) {
    const update = this.extractData(payload);
    return await Borrow.findOneAndUpdate(
      { _id: id },
      { $set: update },
      { new: true }
    );
  }

  async delete(id) {
    return await Borrow.findOneAndDelete({ _id: id });
  }

  async deleteAll() {
    return (await Borrow.deleteMany({})).deletedCount;
  }
}

export default BorrowService;
