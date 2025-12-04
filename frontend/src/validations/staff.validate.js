import * as yup from "yup";

const birthdayValidate = new Date();
birthdayValidate.setFullYear(birthdayValidate.getFullYear() - 7);

const phoneErrorMessage =
  "Số điện thoại phải bắt đầu bằng 09, 03, 07, 08, hoặc 05 và có đúng 10 chữ số";

export const staffCreateSchema = yup.object({
  fullName: yup
    .string()
    .required("Vui lòng nhập đầy đủ họ tên")
    .min(8, "Họ tên phải ít nhất 8 ký tự")
    .max(30, "Họ tên tối đa 30 ký tự"),

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

export const staffUpdateSchema = yup.object({
  fullName: yup
    .string()
    .required("Vui lòng nhập đầy đủ họ tên")
    .min(8, "Họ tên phải ít nhất 8 ký tự")
    .max(30, "Họ tên tối đa 30 ký tự"),

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

export const staffLoginSchema = yup.object({
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
});
