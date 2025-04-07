/**
 * 
 
 * verify token
 * if no token require sign in 
 * if token valid redirect to profile
 */

exports.signin = async (req, res) => {
  
  return res.redirect(req.session.returnTo);
};

exports.signout = (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "تم تسجيل الخروج بنجاح" });
};
