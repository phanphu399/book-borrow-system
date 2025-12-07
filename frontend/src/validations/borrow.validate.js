import * as yup from "yup";

export const borrowSchema = yup.object({
  borrowDate: yup
    .date()
    .required("Vui lòng cung cấp ngày mượn")
    .typeError("Ngày mượn không hợp lệ")
    .test(
      "borrowDate-deadline-check",
      "Lưu ý: ngày mượn phải trước ngày trả và không quá 15 ngày",
      function (borrowDate) {
        const deadline = this.resolve(yup.ref("deadline"));
        if (!borrowDate || !deadline) return true;

        const max = new Date(borrowDate);
        max.setDate(max.getDate() + 15);

        return deadline >= borrowDate && deadline <= max;
      }
    ),

  deadline: yup
    .date()
    .nullable(true)
    .typeError("Ngày trả không hợp lệ")
    .test(
      "deadline-valid",
      "Lưu ý: Ngày trả phải sau ngày mượn và không quá 15 ngày",
      function (deadline) {
        const borrowDate = this.resolve(yup.ref("borrowDate"));
        if (!borrowDate || !deadline) return true;

        const max = new Date(borrowDate);
        max.setDate(max.getDate() + 15);

        return deadline >= borrowDate && deadline <= max;
      }
    ),
});
