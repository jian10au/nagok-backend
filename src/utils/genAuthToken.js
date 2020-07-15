const jwt = require("jsonwebtoken");

const genAuthToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
};

module.exports = genAuthToken;
