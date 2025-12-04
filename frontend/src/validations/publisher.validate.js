import * as yup from "yup";

export const publisherSchema = yup.object({
  name: yup
    .string()
    .required("Vui lòng tên nhà xuất bản")
    .min(3, "Vui lòng nhập ít nhất 3 ký tự")
    .max(50, "Tên nhà xuất bản tối đa 50 ký tự"),
  address: yup
    .string()
    .required("Vui lòng nhập địa chỉ")
    .max(100, "Địa chỉ tối đa 100 ký tự."),
  email: yup
    .string()
    .required("Vui lòng nhập thông tin email")
    .max(100, "Địa chỉ email tối đa 30 ký tự."),
});
