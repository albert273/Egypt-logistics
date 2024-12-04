const User = require("../models/User.schema");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiFeatures = require("../utils/apiFeatures");
const ApiError = require("../utils/apiError");

/*
 * @desc  get all Client
 * @router  /api/user/Client
 * @method  GET
 * @access  Privet  headOffice npt password
 */
const getAllClients = asyncHandler(async (req, res) => {
  // Build query
  const userCounts = await User.countDocuments({ accountType: "client" });

  const query =
    req.user.accountType === "admin"
      ? User.find({ accountType: "client" })
      : User.find({ accountType: "client" }).select("-password -username");

  const apiFeatures = new ApiFeatures(query, req.query)
    .paginate(userCounts)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const documents = await mongooseQuery;
  res
    .status(200)
    .json({ results: documents.length, paginationResult, data: documents });
});

/*
 * @desc  get all headOffice
 * @router  /api/users/headOffice
 * @method  GET
 * @access  Privet (only admin)
 */

const getAllHeadOffices = asyncHandler(async (req, res) => {
  // Build query to count and fetch 'headOffice' users
  const userCounts = await User.countDocuments({ accountType: "headOffice" });
  const apiFeatures = new ApiFeatures(
    User.find({ accountType: "headOffice" }),
    req.query
  )
    .paginate(userCounts)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const documents = await mongooseQuery;

  res
    .status(200)
    .json({ results: documents.length, paginationResult, data: documents });
});

/*
 * @desc  add client and headOffice
 * @router  /api/users/createAccount
 * @method  POST
 * @access  Privet (admin)
 */

const addAccount = asyncHandler(async (req, res) => {
  const {
    name,
    username,
    email,
    password,
    phoneNumber,
    company,
    position,
    accountType,
  } = req.body;

  // If the user is 'headOffice', allow only 'email' and 'password'
  if (accountType === "headOffice") {
    if (company || position) {
      return res.status(400).json({
        status: "error",
        message: "Only client are allowed for 'headOffice' accounts.",
      });
    }
  }

  const createUser = await User.create({
    name: name,
    username: username,
    email: email,
    password: password,
    phoneNumber: phoneNumber,
    company: accountType === "client" ? company : undefined,
    position: accountType === "client" ? position : undefined,
    accountType: accountType,
  });

  // Respond with success
  res.status(201).json({
    status: "success",
    data: { createUser },
  });
});

/*
 * @desc  get client by id
 * @router  /api/client/:id
 * @method  GET
 * @access  Privet (Admin , headOfficer)
 */

const getClient = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Use findOne to search by both _id and accountType
  const query =
    req.user.accountType === "admin"
      ? User.findOne({ _id: id, accountType: "client" })
      : User.findOne({ _id: id, accountType: "client" })
          .select("-password -username")
          .populate({
            path: "quotes", // Populate posts
            model: "Quote",
          });

  // Execute query
  const document = await query;

  // If no document is found
  if (!document) {
    return next(new ApiError(`No user found for this ID: ${id}`, 404));
  }

  // Respond with the result
  res.status(200).json({
    status: "success",
    data: document,
  });
});

/*
 * @desc  get headOfficer by id
 * @router  /api/headOfficer/:id
 * @method  GET
 * @access  Privet (admin only)
 */

const getHeadOffice = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const document = await User.findOne({ _id: id, accountType: "headOffice" });

  if (!document) {
    return next(new ApiError(`No user found for this id: ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: document });
});

// contact us
// login button
// request page

/*
 * @desc  Update client and headOffice
 * @router  /api/user/update/:id
 * @method  PUT
 * @access  Privet
 */

const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const document = await User.findById(id).select("-password");
  if (!document) {
    return next(new ApiError(`No ${element} for this id: ${id}`, 404));
  }
  if (req.user.accountType === "admin") {
    const update = await User.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    ).select("-password");
    return res.status(200).json({ status: "success", data: update });
  } else {
    return next("access denied, you are not allowed", 403);
  }
});

/*
 * @desc  delete client
 * @router  /api/users/client/:id
 * @method  DELETE
 * @access  Privet
 */

const deleteClient = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user || user.accountType !== "client") {
    return next(new ApiError(`No client for this id: ${id}`, 404));
  }

  if (req.user.accountType === "admin") {
    await User.deleteOne({ _id: id, accountType: "client" });
    //delete request
    return res.status(200).json({ status: "success" });
  } else {
    return next(new ApiError(`access denied, you are not allowed`, 403));
  }
});

/*
 * @desc  delete user
 * @router  /api/users/:id
 * @method  DELETE
 * @access  Privet
 */

const deleteHeadOffice = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user || user.accountType !== "headOffice") {
    return next(new ApiError(`No head Office for this id: ${id}`, 404));
  }

  if (req.user.accountType === "admin") {
    await User.deleteOne({ _id: id, accountType: "headOffice" });
    //delete request
    return res.status(200).json({ status: "success" });
  } else {
    return next(new ApiError(`access denied, you are not allowed`, 403));
  }
});

module.exports = {
  getAllClients,
  getAllHeadOffices,
  addAccount,
  getClient,
  getHeadOffice,
  updateUser,
  deleteClient,
  deleteHeadOffice,
};
