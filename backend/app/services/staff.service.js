import Staff from "./../models/staff.model.js";
import bcrypt from "bcrypt";
class StaffService {
  async extractData(payload) {
    const Staff = {
      fullName: payload.fullName,
      address: payload.address,
      phone: payload.phone,
      role: payload.role,
      username: payload.username,
      password: payload.password,
    };
    //Truong hop update field khac,tranh hash undefine
    if (Staff.password) {
      Staff.password = await bcrypt.hash(Staff.password, 12);
    }

    Object.keys(Staff).forEach((key) => {
      return Staff[key] === undefined && delete Staff[key];
    });
    return Staff;
  }

  async create(payload) {
    try {
      const doc = await this.extractData(payload);
      const result = new Staff(doc);

      return await result.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async find(filter) {
    return await Staff.find(filter);
  }

  async findByName(fullName) {
    return await Staff.find({
      fullName: { $regex: fullName, $options: "i" },
    });
  }

  async findByUserName(userName) {
    return await Staff.findOne({
      username: userName,
    });
  }

  async findByID(id) {
    return await Staff.findById({ _id: id });
  }

  async update(id, payload) {
    const update = await this.extractData(payload);
    return await Staff.findOneAndUpdate(
      { _id: id },
      { $set: update },
      { new: true }
    );
  }

  async delete(id) {
    return await Staff.findOneAndDelete({ _id: id });
  }

  async deleteAll() {
    return (await Staff.deleteMany({})).deletedCount;
  }
}

export default StaffService;
