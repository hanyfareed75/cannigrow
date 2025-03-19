const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const token = req.cookies.auth_token;
  console.log(token);
  console.log(req.body);
  if (!token) return res.status(401).json({ error: "يجب تسجيل الدخول" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // إضافة بيانات المستخدم إلى الطلب
    next();
  } catch (error) {
    res.status(401).json({ error: "توكن غير صالح" + error.message });
  }
};

module.exports = authMiddleware;
