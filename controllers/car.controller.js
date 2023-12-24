const Car = require("../models/car.model");

// @description       Add a car
// @route             POST http://localhost:8000/ropstam-car/api/v1/car
// @access            Private -- Token is required
const addCar = async (req, res) => {
  try {
    // Get all the required fileds from body
    const newCar = new Car(req.body);
    // saved the car into the database
    const savedCar = await newCar.save();

    res.status(201).json({ success: true, data: savedCar, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// @description       Get all Cars
// @route             GET http://localhost:8000/ropstam-car/api/v1/car
// @access            Private -- only admin can views all the user's cars
const getCars = async (req, res) => {
  try {
    // fetch cars from the database  - - in sorted order -- limit is 12
    const cars = await Car.find().limit(12).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: cars, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// @description       Get Cars of the specific user
// @route             GET http://localhost:8000/ropstam-car/api/v1/car/:userId
// @access            Private -- a user can view all his own cars only
const userCars = async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.params.userId })
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: cars, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// @description       Single Car Details
// @route             GET http://localhost:8000/ropstam-car/api/v1/car/details/:carId
// @access            Private -- should have a valid token
const carDetails = async (req, res) => {
  try {
    // get details of the car and by whom the car is added, the user details as well
    const car = await Car.findById(req.params.carId).populate("userId");
    res.status(200).json({ success: true, data: car, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// @description       Update Car
// @route             PUT http://localhost:8000/ropstam-car/api/v1/car/edit/:carId
// @access            Private
const editCar = async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.carId, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      data: { updatedCar, message: "car updated successfully" },
      error: null,
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// @description       delete Car
// @route             DELETE http://localhost:8000/ropstam-car/api/v1/car/delete/:carId
// @access            Private
const deleteCar = async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.carId);
    res.status(200).json({
      success: true,
      data: { message: "car deleted successfully" },
      error: null,
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

module.exports = {
  addCar,
  getCars,
  userCars,
  carDetails,
  editCar,
  deleteCar,
};
