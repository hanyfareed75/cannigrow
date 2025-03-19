const jwt = require("jsonwebtoken");

const userSchema = require("../models/User");

const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("this from /login " + req.body);
    const user = await userSchema.findOne({ email });

    if (!user) return res.status(400).json({ error: "المستخدم غير موجود" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "كلمة المرور غير صحيحة" });

    const token = user.generateJWT();

    res.cookie("auth_token", token, {
      httpOnly: true, // الحماية من الهجمات
      secure: process.env.NODE_ENV === "production", // تأمين الكوكيز في بيئة الإنتاج
      sameSite: "strict",
      maxAge: 3600000, // انتهاء بعد ساعة
    });

    res.json({ message: "تم تسجيل الدخول بنجاح", token });
  } catch (error) {
    res.status(500).json({ error: "حدث خطأ في السيرفر" });
  }
};
