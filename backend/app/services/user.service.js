import User from "./../models/user.model.js";
import bcrypt from "bcrypt";
class UserService {
  async extractData(payload) {
    const User = {
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
    if (User.password) {
      User.password = await bcrypt.hash(User.password, 12);
    }

    Object.keys(User).forEach((key) => {
      return User[key] === undefined && delete User[key];
    });
    return User;
  }

  async create(payload) {
    try {
      const User = await this.extractData(payload);
      const result = new User(User);

      return await result.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async find(filter) {
    return await User.find(filter);
  }

  async findByName(firstName) {
    return await User.find({
      firstName: { $regex: firstName, $options: "i" },
    });
  }

  async findByID(id) {
    return await User.findById({ _id: id });
  }

  async findByUserName(userName) {
    return await User.findOne({
      username: userName,
    });
  }

  async update(id, payload) {
    const update = await this.extractData(payload);
    return await User.findOneAndUpdate(
      { _id: id },
      { $set: update },
      { new: true }
    );
  }

  async delete(id) {
    return await User.findOneAndDelete({ _id: id });
  }

  async deleteAll() {
    return (await User.deleteMany({})).deletedCount;
  }
}

export default UserService;
