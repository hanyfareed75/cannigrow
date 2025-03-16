const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const users={"email":"yG8aE@example.com","password":"123456"}
exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.json({ message: "تم التسجيل بنجاح" });
  } catch (error) {
    res.status(500).json({ error: "حدث خطأ أثناء التسجيل" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
   
    const user = await users.findOne({ email });
    console.log(user);
    if (!user || !(await bcrypt.compare(password, users.password))) {
      return res.status(401).json({ message: "بيانات غير صحيحة" });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "حدث خطأ أثناء تسجيل الدخول" });
  }
};

exports.getUserProfile = (req, res) => {
  res.json({ message: `مرحبًا ${req.user.email}, هذه بياناتك المحمية!` });
};
