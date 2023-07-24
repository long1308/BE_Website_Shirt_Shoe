import Product from "../models/product";
import { productSchema } from "../Schema/product";
export const getAll = async (req, res) => {

  //asc tăng dần
  const { order = "createdAt", _limit = 100, keyword = "asc", size, color, category, seach } = req.query;
  const filter = {};
  if (size) {
    filter["colorSizes.sizes.size"] = size;

  }
  if (color) {
    filter["colorSizes.color"] = color;
  }
  if (category) {

    filter["categoryId"] = category; // Tạo bộ lọc cho trường categoryId
  }


  let option = {
    limit: _limit,
    sort: {
      [order]: keyword === "asc" ? 1 : -1,
    },
    populate: {
      path: "categoryId", // Thêm đường dẫn để populate thông tin của danh mục
      select: "name", // Chỉ lấy trường "name" của danh mục
    },
  };
  try {
    const product = await Product.paginate(filter, option);

    if (product.length === 0) {
      return res.json({
        message: "Không có sản phẩm nào !",
      });
    }
    return res.json({
      message: "Lấy danh sách sản phẩm thành công !",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const getSearch = async (req, res) => {
  try {
    const search = req.query.search;
    const regex = new RegExp(search, 'i')
    const product = await Product.paginate({ name: regex });
    if (product.length === 0) {
      return res.json({
        message: "Không tìm thấy sản phẩm phù hợp !",
      });
    }
    return res.json({
      message: "Lấy sản phẩm thành công !",
      product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Không có sản phẩm nào có tên đó" });
    }
    return res.status(500).json({ message: "Lỗi server" });
  }
};
export const get = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.json({
        message: "Lấy sản phẩm không thành công !",
      });
    }
    return res.json({
      message: "Lấy 1 sản phẩm thành công !",
      product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Id không hợp lệ" });
    }
  }
};
export const create = async (req, res) => {
  try {
    //validate
    const { error } = productSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details.map((error) => error.message),
      });
    }
    // Lấy thông tin từ request body
    const {
      name,
      price,
      priceSale,
      image,
      rating,
      description,
      description_short,
      isVisible,
      featured,
      hot_sale,
      categoryId,
      colorSizes,
    } = req.body;

    // Tạo một mảng mới để lưu trữ thông tin chi tiết về màu sắc, kích thước và số lượng
    const formattedColorSizes = colorSizes.map((colorSize) => {
      const { color, sizes } = colorSize;
      const formattedSizes = sizes.map((size) => {
        return {
          size: size.size,
          quantity: size.quantity,
        };
      });
      return {
        color,
        sizes: formattedSizes,
      };
    });

    // Tạo sản phẩm mới với thông tin đã được format
    const product = await Product.create({
      name,
      price,
      priceSale,
      image,
      rating,
      description,
      description_short,
      isVisible,
      featured,
      hot_sale,
      categoryId,
      colorSizes: formattedColorSizes,
    });

    if (!product) {
      return res.json({
        message: "Thêm sản phẩm không thành công!",
      });
    }
    return res.json({
      message: "Thêm sản phẩm thành công",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    // Validate
    const { error } = productSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details.map((error) => error.message),
      });
    }

    // Lấy thông tin sản phẩm từ yêu cầu
    const updatedProduct = req.body;
    const { quantity, colorSizes } = updatedProduct;

    // Tính toán số lượng tổng cộng từng kích thước và màu sắc
    let totalQuantity = 0;
    colorSizes.forEach((colorSize) => {
      colorSize.sizes.forEach((size) => {
        totalQuantity += size.quantity;
      });
    });

    // Cập nhật số lượng tổng cộng và trạng thái tồn kho
    updatedProduct.quantity = totalQuantity;
    switch (true) {
      case totalQuantity <= 0:
        updatedProduct.inventoryStatus = "OUTOFSTOCK";
        break;
      case totalQuantity <= 10:
        updatedProduct.inventoryStatus = "LOWSTOCK";
        break;
      default:
        updatedProduct.inventoryStatus = "INSTOCK";
    }

    // Cập nhật sản phẩm
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedProduct,
      {
        new: true,
      }
    );

    if (!product) {
      return res.json({
        message: "Cập nhật sản phẩm không thành công!",
      });
    }

    return res.json({
      message: "Cập nhật sản phẩm thành công!",
      product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Id không hợp lệ" });
    }
    return res.status(400).json({ message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.json({
        message: "Xóa sản phẩm không thành công",
      });
    }
    return res.json({
      message: "Xóa sản phẩm thành công",
      product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Id không hợp lệ" });
    }
  }
};
export const updatePartial = async (req, res) => {
  try {
    // validate

    // Update product partially
    const updatedProduct = req.body;
    if (updatedProduct.hot_sale >= 0 && updatedProduct.price) {
      updatedProduct.priceSale =
        updatedProduct.price * (1 - updatedProduct.hot_sale / 100);
    }
    switch (true) {
      case updatedProduct.quantity <= 0:
        updatedProduct.inventoryStatus = "OUTOFSTOCK";
        break;
      case updatedProduct.quantity <= 10:
        updatedProduct.inventoryStatus = "LOWSTOCK";
        break;
      default:
        updatedProduct.inventoryStatus = "INSTOCK";
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updatedProduct }, // Sử dụng $set để chỉ cập nhật các trường được gửi trong yêu cầu
      {
        new: true,
      }
    );

    if (!product) {
      return res.json({
        message: "Cập nhật sản phẩm không thành công!",
      });
    }

    return res.json({
      message: "Cập nhật sản phẩm thành công!",
      product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Id không hợp lệ" });
    }
  }
};
