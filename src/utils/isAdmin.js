const isAdmin = (req, res, next) => {
  console.log(req.user.isAdmin, "is admin?");
  if (req.user.isAdmin) {
    next();
  } else {
    res
      .status(401)
      .send({ msg: "Denied access to the route for non-admin users" });
  }
};

module.exports = isAdmin;
