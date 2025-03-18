const userSchema = require("../models/User");
const bcrypt = require("bcryptjs");
module.exports.checkEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

module.exports.checkPassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
};

module.exports.checkName = (name) => {
    const regex = /^[A-Za-z\s]+$/;  
    return regex.test(name);
};

module.exports.checkPhone = (phone) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
};

module.exports.checkAddress = (address) => {
    const regex = /^[A-Za-z\s]+$/;  
    return regex.test(address);
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
module.exports.register = async (req, res) => { 
     
  try {
    const { email, password } = req.body;
console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new userSchema({ email, password: hashedPassword });
    await user.save();
    res.json({ message: "تم التسجيل بنجاح" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "حدث خطاء اثناء التسجيل" });
  }
};
