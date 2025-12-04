import * as yup from "yup";

const birthdayValidate = new Date();
birthdayValidate.setFullYear(birthdayValidate.getFullYear() - 7);

const birthdayErrorMessage = `Người dùng phải lớn hơn ${
  2025 - birthdayValidate.getFullYear()
} tuổi`;
const phoneErrorMessage =
  "Số điện thoại phải bắt đầu bằng 09, 03, 07, 08, hoặc 05 và có đúng 10 chữ số";

export const createUserSchema = yup.object({
  firstName: yup
    .string()
    .required("Vui lòng nhập tên")
    .min(2, "Tên phải ít nhất 2 ký tự")
    .max(30, "Tên tối đa 30 ký tự"),

  lastName: yup
    .string()
    .required("Vui lòng nhập họ lót")
    .min(2, "Họ lót phải ít nhất 2 ký tự")
    .max(30, "Họ lót tối đa 30 ký tự"),

  username: yup
    .string()
    .required("Vui lòng nhập tên đăng nhập")
    .min(5, "Tên đăng nhập phải ít nhất 5 ký tự")
    .max(30, "Tên đăng nhập tối đa 30 ký tự"),

  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải ít nhất 6 ký tự")
    .max(120, "Mật khẩu tối đa 120 ký tự"),

  gender: yup
    .string()
    .required("Vui lòng chọn giới tính")
    .oneOf(["male", "female"], "Giới tính không hợp lệ"),

  birthDate: yup
    .date()
    .required("Vui lòng nhập ngày sinh")
    .max(birthdayValidate, birthdayErrorMessage)
    .typeError("Ngày sinh không hợp lệ"),

  address: yup
    .string()
    .required("Vui lòng nhập địa chỉ")
    .max(100, "Địa chỉ tối đa 100 ký tự"),

  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^(09|03|07|08|05)/, phoneErrorMessage)
    .min(10, "Số điện thoại phải có 10 chữ số")
    .max(10, "Số điện thoại phải có 10 chữ số"),
});

export const updateUserSchema = yup.object({
  firstName: yup
    .string()
    .required("Vui lòng nhập tên")
    .min(2, "Tên phải ít nhất 2 ký tự")
    .max(30, "Tên tối đa 30 ký tự"),

  lastName: yup
    .string()
    .required("Vui lòng nhập họ lót")
    .min(2, "Họ lót phải ít nhất 2 ký tự")
    .max(30, "Họ lót tối đa 30 ký tự"),

  username: yup
    .string()
    .min(5, "Tên đăng nhập phải ít nhất 5 ký tự")
    .max(30, "Tên đăng nhập tối đa 30 ký tự"),

  password: yup
    .string()
    .min(6, "Mật khẩu phải ít nhất 6 ký tự")
    .max(120, "Mật khẩu tối đa 120 ký tự")
    .notRequired()
    .nullable(),

  gender: yup
    .string()
    .required("Vui lòng chọn giới tính")
    .oneOf(["male", "female"], "Giới tính không hợp lệ"),

  birthDate: yup
    .date()
    .required("Vui lòng nhập ngày sinh")
    .max(birthdayValidate, birthdayErrorMessage)
    .typeError("Ngày sinh không hợp lệ"),

  address: yup
    .string()
    .required("Vui lòng nhập địa chỉ")
    .max(100, "Địa chỉ tối đa 100 ký tự"),

  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^(09|03|07|08|05)/, phoneErrorMessage)
    .min(10, "Số điện thoại phải có 10 chữ số")
    .max(10, "Số điện thoại phải có 10 chữ số"),
});

export const loginUserSchema = yup.object({
  username: yup
    .string()
    .min(5, "Tên đăng nhập phải ít nhất 5 ký tự")
    .max(30, "Tên đăng nhập tối đa 30 ký tự"),

  password: yup
    .string()
    .min(6, "Mật khẩu phải ít nhất 6 ký tự")
    .max(120, "Mật khẩu tối đa 120 ký tự")
    .notRequired()
    .nullable(),
});
