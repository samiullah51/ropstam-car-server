const {
  addCar,
  getCars,
  userCars,
  carDetails,
  editCar,
  deleteCar,
} = require("../controllers/car.controller");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken.middleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = require("express").Router();

// Add a car  -- to add a car, user has to be logged in and has a valid token
router.post(
  "/",
  verifyToken,
  upload.fields([{ name: "image", maxCount: 1 }]), // upload image
  addCar
);
// Get cars -- only admin can gets all users' cars
router.get("/", verifyTokenAndAdmin, getCars);
// Get user's cars
router.get("/:userId", verifyTokenAndAuthorization, userCars);
// Get car's details
router.get("/details/:carId", verifyToken, carDetails);
// update car
router.put("/edit/:carId", verifyToken, editCar);
// delete car
router.delete("/delete/:carId", verifyToken, deleteCar);

module.exports = router;
