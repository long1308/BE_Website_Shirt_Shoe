import Size from "../models/size";
import { sizeSchema } from "../Schema/product";
export const getAllSize = async (req, res) => {
  try {
    const size = await Size.find();
    if (size.length === 0) {
      return res.json({
        message: "Không có size nào !",
      });
    }
    return res.json({
      message: "Lấy danh sách size thành công !",
      size,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const getSize = async (req, res) => {
  try {
    const size = await Size.findById(req.params.id);
    if (!size) {
      return res.json({
        message: "Lấy size không thành công !",
      });
    }
    return res.json({
      message: "Lấy 1 size thành công !",
      size,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Id không hợp lệ" });
    }
  }
};
export const createSize = async (req, res) => {
  try {
    //validate
    const { error } = sizeSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details.map((error) => error.message),
      });
    }
    //check name
    const sizeAll = await Size.find();
    const sizeName = sizeAll.find(
      (size) => size.name.toLowerCase() === req.body.name.toLowerCase()
    );
    if (sizeName) {
      return res.status(400).json({
        message: "Tên size đã tồn tại !",
      });
    }
    const size = await Size.create(req.body);
    if (!size) {
      return res.json({
        message: "Thêm size không thành công! ",
      });
    }
    return res.json({
      message: "Thêm size thành công ",
      size,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
export const updateSize = async (req, res) => {
  try {
    //validate
    const { error } = sizeSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details.map((error) => error.message),
      });
    }
    //check name
    const sizeAll = await Size.find();
    const sizeName = sizeAll.find(
      (size) => size.name.toLowerCase() === req.body.name.toLowerCase()
    );
    if (sizeName) {
      return res.status(400).json({
        message: "Tên size đã có trong danh sách hoặc đã tồn tại !!",
      });
    }
    const size = await Size.findByIdAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });
    if (!size) {
      return res.json({
        message: "Cập nhật size không thành công !",
      });
    }
    return res.json({
      message: "Cập nhật size thành công !",
      size,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Id không hợp lệ" });
    }
  }
};
export const removeSize = async (req, res) => {
  try {
    const size = await Size.findByIdAndDelete(req.params.id);
    if (!size) {
      return res.json({
        message: "Xóa size không thành công !",
      });
    }
    return res.json({
      message: "Xóa size thành công !",
      size,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Id không hợp lệ" });
    }
  }
};
