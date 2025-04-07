const nodemailer = require("nodemailer");
const validationMW = require("../middlewares/validationMW");
const { token } = require("morgan");

exports.sendEmail=async (req, res) => {
  try {
    const { to, subject, text } = req.body;
  //get token mmmmmmmmmmmmmmmmmmmmmmm
    const info = await validationMW.sendEmailValidationLink(to, subject, token);
        res.json({ message: "تم إرسال البريد بنجاح", info });
  } catch (error) {
    res
      .status(500)
      .json({ error: "فشل في إرسال البريد", details: error.message });
  }
}

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString(); // إنشاء OTP عشوائي

    otpStorage[email] = otp; // حفظ OTP مؤقتًا
    
    const mailOptions = {
      from: "hanyfareed75@gmail.com",
      to: email,
      subject: "رمز التحقق OTP",
      text: `رمز التحقق الخاص بك هو: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "تم إرسال OTP بنجاح" });
  } catch (error) {
    res.status(500).json({ error: "حدث خطاء اثناء ارسال OTP" + error.message });
  }
};