const Message = require("../models/Message.schema");
const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/apiFeatures");

/*
 * @desc  get all message
 * @router  /api/message
 * @method  GET
 * @access  Privet  message
 */
const getAllMessage =   asyncHandler(async (req, res) => {
  const documentsCounts = await Message.countDocuments();
  const apiFeatures = new ApiFeatures(Message.find(), req.query)
    .paginate(documentsCounts)
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
 * @desc  add message
 * @router  /api/message
 * @method  POST
 * @access  Privet (admin, headOffice)
 */

const addMessage = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    message
  } = req.body;

  const createMessage = await Message.create({
    firstName:  firstName,  
    lastName:  lastName,  
    email: email,
    phoneNumber: phoneNumber,
    message: message
  });

  // Respond with success
  res.status(201).json({
    status: "success",
    data: { createMessage },
  });
});


/*
 * @desc  add message
 * @router  /api/message
 * @method  POST
 * @access  Privet (admin, headOffice)
 */

const acceptedMessage = asyncHandler(async (req, res, next) => { 
  const { id } = req.params;

  if (!id) {
    return next(new ApiError(`No message for this id: ${id}`, 404));
  }

  const updatedMessage = await Message.findByIdAndUpdate(
    { _id: id },
    { accepted: true },  // The update object should be in curly braces
    { new: true }  // This option returns the updated document
  );

  if (!updatedMessage) {
    return next(new ApiError(`Message with id: ${id} not found`, 404));
  }

  // Respond with success
  res.status(201).json({
    status: "success",
    data: { updatedMessage },
  });
});


module.exports = {
  getAllMessage,
  addMessage,
  acceptedMessage
};
