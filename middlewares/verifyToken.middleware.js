const JWT = require("jsonwebtoken");

// Just simply verify the token, user has a token or not, valid or not valid
const verifyToken = async (req, res, next) => {
  const token = req.header("token");
  if (!token) return res.status(401).send("Access Denied!");
  try {
    const verified = JWT.verify(token, process.env.JWT_SEC);
    req.user = verified;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ success: false, data: null, error: "invalid token" });
  }
};

// Verify the token and verify the user as well that the logged in user is authenticated or not
const verifyTokenAndAuthorization = async (req, res, next) => {
  verifyToken(req, res, () => {
    // check if the requested user is the logged in user or not or check if it is admin
    if (req.user.id === req.params.userId || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({
        success: false,
        data: null,
        error: "You are not allowed to do that.",
      });
    }
  });
};

// Verify token and admin
const verifyTokenAndAdmin = async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res
        .status(403)
        .json({
          success: false,
          data: null,
          error: "You are not allowed to do that. Possible By Admin",
        });
    }
  });
};

module.exports = {
  verifyTokenAndAuthorization,
  verifyToken,
  verifyTokenAndAdmin,
};
