import Reader from "./../models/reader.model.js";
import bcrypt from "bcrypt";
class ReaderService {
  async extractData(payload) {
    const Reader = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      gender: payload.gender,
      birthDay: payload.birthDay,
      address: payload.address,
      phone: payload.phone,
      role: payload.role,
      username: payload.username,
      password: payload.password,
    };
    //Truong hop update field khac,tranh hash undefine
    if (Reader.password) {
      Reader.password = await bcrypt.hash(Reader.password, 12);
    }

    Object.keys(Reader).forEach((key) => {
      return Reader[key] === undefined && delete Reader[key];
    });
    return Reader;
  }

  async create(payload) {
    try {
      const reader = await this.extractData(payload);
      const result = new Reader(reader);

      return await result.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async find(filter) {
    return await Reader.find(filter);
  }

  async findByName(firstName) {
    return await Reader.find({
      firstName: { $regex: firstName, $options: "i" },
    });
  }

  async findByID(id) {
    return await Reader.findById({ _id: id });
  }
  async findByUserName(userName) {
    return await Reader.find({
      username: userName,
    });
  }

  async update(id, payload) {
    const update = await this.extractData(payload);
    return await Reader.findOneAndUpdate(
      { _id: id },
      { $set: update },
      { new: true }
    );
  }

  async delete(id) {
    return await Reader.findOneAndDelete({ _id: id });
  }

  async deleteAll() {
    return (await Reader.deleteMany({})).deletedCount;
  }
}

export default ReaderService;
