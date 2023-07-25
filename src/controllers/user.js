import User from "../models/user";
import { signinSchema, signupSchema, updateSchema } from "../Schema/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Product from "../models/product";
dotenv.config();

const { SECRET_CODE, EMAIL_USERNAME, EMAIL_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD,
  },
});

export const signup = async (req, res) => {
  const { name, email, password, image_url } = req.body;
  try {
    // validate đầu vào
    const { error } = signupSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);

      return res.status(400).json({
        messages: errors,
      });
    }
    // Kiểm tra trong db có tk không?
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(400).json({
        messages: "Email đã tồn tại",
      });
    }
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name,
      email,
      image_url,
      password: hashedPassword,
    });
    user.password = undefined;

    // Gửi email thông báo tạo tài khoản thành công
    const mailOptions = {
      from: "your-email@example.com", // Địa chỉ email gửi
      to: email, // Địa chỉ email người nhận
      subject: "Chào Mừng", // Tiêu đề email
      text: "Chúc mừng bạn đã đăng ký thành công tài khoản", // Nội dung email
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    return res.status(201).json({
      message: "Tạo tài khoản thành công",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const signin = async (req, res) => {
  try {
    const { error } = signinSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);

      return res.status(400).json({
        messages: errors,
      });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        messages: "Email không tồn tại",
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        messages: "Sai mật khẩu",
      });
    }
    const token = jwt.sign({ id: user._id }, SECRET_CODE, { expiresIn: "1d" });
    user.password = undefined;
    return res.status(200).json({
      message: "Đăng nhập thành công",
      accessToken: token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Loi server!",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const user = await User.find();
    if (user.length === 0) {
      return res.json({
        message: "Không có user nào !",
      });
    }
    return res.json({
      message: "Lấy danh sách user thành công !",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.json({
        message: "Xóa sản phẩm không thành công",
      });
    }
    return res.json({
      message: "Xóa user thành công",
      user,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Id không hợp lệ" });
    }
  }
};

export const update = async (req, res) => {
  try {
    // Lấy thông tin user từ cơ sở dữ liệu
    const user = await User.findById(req.params.id).populate('addressUser');
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // So sánh mật khẩu cũ đã hash với mật khẩu mới được gửi từ client
    const passwordsMatch = await bcrypt.compare(req.body.confirmPassword, user.password);
    if (!passwordsMatch) {
      return res.status(400).json({ message: "Mật khẩu không khớp" });
    }

    // Validate thông tin cần update
    const { error } = updateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details.map((error) => error.message),
      });
    }

    // Thực hiện update thông tin user
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.json({
      message: "Cập nhật sản phẩm thành công!",
      user: updatedUser,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Id không hợp lệ" });
    }
    return res.status(500).json({ message: "Lỗi server" });
  }
};


export const get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('addressUser')
    const favoriteProduct = await Product.find({
      _id: { $in: user.favoriteProducts },
    });
    if (!user) {
      return res.json({
        message: "Lấy user không thành công!",
      });
    }
    return res.json({
      message: "Lấy thông tin user thành công!",
      user,
      favoriteProduct,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Id không hợp lệ" });
    }
  }
}

