require("dotenv").config();
const userSchema = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validationMW = require("../middlewares/validationMW");
/**
 * register new user 
 * check email avilability
 * check password
 * validate email useing verification link
 * activate the new user 
 * redirect to login
 * redirect to profile
 * 
 */
// Register a new user Email / Password
module.exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new userSchema({ email, password: hashedPassword });
    await user.save();
    const token = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
await userSchema.findOneAndUpdate(
  { email },
  { verificationToken: token },
  { upsert: true }
);
     await validationMW.sendEmailValidationLink(email, "Email Verification", token);
    
    res.json({ message: "   تم التسجيل بنجاح , سيتم التحقق من البريد الالكتروني لتفعيل الحساب" });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "حدث خطاء اثناء التسجيل" });
  }
};
//verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) return res.status(400).json({ message: "Token is required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await userSchema.findOne({ email: decoded.email });
   
    if (!user || user.verificationToken !== token) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = null; // Remove token after verification
    user.active = true;
    await user.save();

    res.json({ message: "Account verified successfully!" });
    //redirect to sign in routes
    res.redirect("/signin");
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" + error.message });
  }
};

module.exports.checkEmailAvilability = async(req, res) => {
    const {email} = req.params.email;

  try {
    const user = await userSchema.findOne({ email: req.params.email });

    if (!user) return res.json({ message: "Email address avilable" });

    res.json({ message: "Email Already Exists" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  } 
};
exports.changepassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await userSchema.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { upsert: true }
    );
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: "حدث خطاء اثناء تغيير كلمة المرور" });
  }
};    