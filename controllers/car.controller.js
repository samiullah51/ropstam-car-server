const Car = require("../models/car.model");
const { v4: uuidv4 } = require("uuid");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../utils/s3Config");
// @description       Add a car
// @route             POST http://localhost:8000/ropstam-car/api/v1/car
// @access            Private -- Token is required
const addCar = async (req, res) => {
  try {
    const { userId, category, model, madeIn, registrationNo } = req.body;
    const { image } = req.files;

    let imageURL;
    if (image) {
      const imageKey = `ropstam-car/${userId}/${uuidv4()}`;
      const imageParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageKey,
        Body: image[0].buffer,
        ContentType: image[0].mimetype,
      };
      const imageCommand = new PutObjectCommand(imageParams);
      await s3.send(imageCommand);
      imageURL = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${imageKey}`;
    }
    // Get all the required fileds from body
    const newCar = new Car({
      userId,
      category,
      model,
      madeIn,
      registrationNo,
      image: imageURL,
    });
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
  // Get the page number from query parameters, default to 1 if not provided
  const page = parseInt(req.query.page) || 1;
  // Number of cars per page
  const limit = 6;

  try {
    // Count total number of cars
    const count = await Car.countDocuments();
    // Calculate total pages based on the limit
    const totalPages = Math.ceil(count / limit);
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    const cars = await Car.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        cars,
        currentPage: page,
        totalPages,
      },
      error: null,
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// @description       Get Cars of the specific user
// @route             GET http://localhost:8000/ropstam-car/api/v1/car/:userId
// @access            Private -- a user can view all his own cars only
const userCars = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;

  try {
    const count = await Car.countDocuments({ userId: req.params.userId });
    const totalPages = Math.ceil(count / limit);

    const skip = (page - 1) * limit;

    const cars = await Car.find({ userId: req.params.userId })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        cars,
        currentPage: page,
        totalPages,
      },
      error: null,
    });
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
