import * as yup from "yup";

const date = new Date();
date.setDate(date.getDay() + 15);
export const borrowSchema = yup.object({
  borrowDate: yup
    .date()
    .required("Vui lòng cung cấp ngày mượn")
    .typeError("Ngày mượn không hợp lệ"),

  deadline: yup
    .date()
    .nullable(true)
    .typeError("Ngày trả không hợp lệ")
    .min(yup.ref("borrowDate"), "Ngày trả không được trước ngày mượn")
    .max(date, "Lưu ý: Mỗi phiếu chỉ được mượn tối đa 15 ngày"),
});
