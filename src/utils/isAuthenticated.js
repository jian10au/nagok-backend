const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const onlyToken = token.slice(6, token.length);
    jwt.verify(onlyToken, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ msg: "Invalid token" });
        // normally I will put a return in here if you use if without an else
        return;
      }
      req.user = decode;
      console.log(req.user);
      next();
    });
  } else {
    res.status(401).send({ msg: "No authToken" });
  }
};

// protect all the routes required user is signed in or registered
module.exports = isAuthenticated;
