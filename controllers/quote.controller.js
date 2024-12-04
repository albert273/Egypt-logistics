const Quote = require("../models/Quote.schema");
const User = require("../models/User.schema");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

/*
 * @desc  get quote for gest
 * @router  /api/quote/gest
 * @method  GET
 * @access  Privet  headOffice and admin
 */
const getQuoteForGuest = asyncHandler(async (req, res) => {
  // Build query to find documents where `quoteOwner` is `null` or not set
  const userCounts = await Quote.countDocuments({
    quoteOwner: { $exists: false },
  });

  const query = Quote.find({ quoteOwner: { $exists: false } });

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
 * @desc  get quote by id
 * @router  /api/quote/:id
 * @method  GET
 * @access  Privet (Admin , headOfficer)
 */

const getQuoteById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Fetch the quote and populate the owner information
  const quote = await Quote.findById(id)
    .populate("quoteOwner")
    .select("+containerType")
    .populate("tracking.booked.completedBy", "name")
    .populate("tracking.receiving.completedBy", "name")
    .populate("tracking.departed.completedBy", "name")
    .populate("tracking.arrived.completedBy", "name")
    .populate("tracking.notified.completedBy", "name")
    .populate("tracking.customers.completedBy", "name")
    .populate("tracking.shipping.completedBy", "name")
    .populate("tracking.booked.comment.commentedBy", "name")
    .populate("tracking.receiving.comment.commentedBy", "name")
    .populate("tracking.departed.comment.commentedBy", "name")
    .populate("tracking.arrived.comment.commentedBy", "name")
    .populate("tracking.notified.comment.commentedBy", "name")
    .populate("tracking.customers.comment.commentedBy", "name")
    .populate("tracking.shipping.comment.commentedBy", "name")
    .populate("status.actionBy", "name");


  if (!quote) {
    return next(new ApiError(`No quote found for this ID: ${id}`, 404));
  }

  const userRole = req.user.accountType;
  const userId = req.user.userId;

  // Check if there is an owner for the quote
  if (quote.quoteOwner) {
    // Allow access only to admin, head officer, or the quote owner
    if (
      userRole !== "admin" &&
      userRole !== "headOfficer" &&
      userId !== String(quote.quoteOwner._id)
    ) {
      return next(
        new ApiError(
          "Access denied. Only the admin, head officer, or the quote owner can access this quote.",
          403
        )
      );
    }
  } else {
    // If no owner, allow access only to admin or head officer
    if (userRole !== "admin" && userRole !== "headOfficer") {
      return next(
        new ApiError(
          "Access denied. Only the admin or head officer can access this quote.",
          403
        )
      );
    }
  }

  // Respond with the quote data
  res.status(200).json({
    status: "success",
    data: quote,
  });
});

/*
 * @desc  get quote by owner id
 * @router  /clientQuote/:id
 * @method  GET
 * @access  Privet (Admin , headOfficer, owner)
 */

const getQuoteByOwnerId = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (
    id !== req.user.userId &&
    req.user.accountType !== "admin" &&
    req.user.accountType !== "headOffice"
  ) {
    return next(new ApiError(`Access denied. Admins and owner only`, 404));
  }
  const quote = await Quote.find({ quoteOwner: id });

  const userExists = await User.findById(req.user.userId);
  if (!userExists) {
    throw new Error("user is not defined", 400);
  }

  if (!quote) {
    return next(new ApiError(`No quote found for this ID: ${id}`, 404));
  }
  // Respond with the result
  res.status(200).json({
    status: "success",
    data: quote,
  });
});

/*
 * @desc  create a new quote
 * @router  /api/quote/gest
 * @method  POST
 * @access  public
 */

const createRequestForGest = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    exportingCountry,
    importingCountry,
    tripType,
    containerType,
    width,
    height,
    lenght,
    weight,
    goodsType,
    amount,
  } = req.body;

  // Define default tracking steps
  const defaultTracking = [
    {
      booked: {
        isActive: false,
        isCompleted: false,
        completedDate: null,
        comment: [],
      },
      receiving: {
        isActive: false,
        isCompleted: false,
        completedDate: null,
        comment: [],
      },
      departed: {
        isActive: false,
        isCompleted: false,
        completedDate: null,
        comment: [],
      },
      arrived: {
        isActive: false,
        isCompleted: false,
        completedDate: null,
        comment: [],
      },
      notified: {
        isActive: false,
        isCompleted: false,
        completedDate: null,
        comment: [],
      },
      customers: {
        isActive: false,
        isCompleted: false,
        completedDate: null,
        comment: [],
      },
      shipping: {
        isActive: false,
        isCompleted: false,
        completedDate: null,
        comment: [],
      },
    },
  ];

  // Create the new request with default tracking data
  const createRequest = await Quote.create({
    name,
    email,
    phoneNumber,
    exportingCountry,
    importingCountry,
    tripType,
    containerType,
    width,
    height,
    lenght,
    weight,
    goodsType,
    amount,
    tracking: defaultTracking,
    // Include default tracking steps
  });

  // Respond with success
  res.status(201).json({
    status: "success",
    data: createRequest,
  });
});

/*
 * @desc  create a new quote
 * @router  /api/quote/client
 * @method  POST
 * @access  public
 */

const createRequestForClient = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    exportingCountry,
    importingCountry,
    tripType,
    containerType,
    width,
    height,
    lenght,
    weight,
    goodsType,
    amount,
  } = req.body;

  const defaultTracking = [
    {
      booked: {
        isActive: false,
        isCompleted: false,
        completedDate: null,
        comment: [],
      },
      receiving: {
        isActive: false,
        isCompleted: false,
        completedDate: null,
        comment: [],
      },
      departed: {
        isActive: false,
        isCompleted: false,
        completedDate: null,
        comment: [],
      },
      arrived: {
        isActive: false,
        isCompleted: false,
        completedDate: null,
        comment: [],
      },
      notified: {
        isActive: false,
        isCompleted: false,
        completedDate: null,
        comment: [],
      },
      customers: {
        isActive: false,
        isCompleted: false,
        completedDate: null,
        comment: [],
      },
      shipping: {
        isActive: false,
        isCompleted: false,
        completedDate: null,
        comment: [],
      },
    },
  ];

  const createQuote = await Quote.create({
    quoteOwner: req.user.userId,
    name: name,
    email: email,
    phoneNumber: phoneNumber,
    exportingCountry: exportingCountry,
    importingCountry: importingCountry,
    tripType: tripType,
    containerType: containerType,
    width: width,
    height: height,
    lenght: lenght,
    weight: weight,
    goodsType: goodsType,
    amount: amount,
    tracking: defaultTracking,
  });

  // Respond with success
  res.status(201).json({
    status: "success",
    data: { createQuote },
  });
});

/*
 * @desc  update quote
 * @router  /api/quote/:id
 * @method  put
 * @access  admin and headOffice
 */

const updateQuote = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const document = await Quote.findById(id);
  if (!document) {
    return next(new ApiError(`No Quote for this id: ${id}`, 404));
  }
  if (
    req.user.accountType === "admin" ||
    req.user.accountType === "headOffice"
  ) {
    const update = await Quote.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    return res.status(200).json({ status: "success", data: update });
  } else {
    return next("access denied, you are not allowed", 403);
  }
});

/*
 * @desc  delete quote
 * @router  /api/quote/:id
 * @method  delete
 * @access  admin and headOffice
 */
const deleteQuote = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const quote = await Quote.findById(id);

  if (!quote) {
    return next(new ApiError(`No Quote for this id: ${id}`, 404));
  }
  await Quote.deleteOne({ _id: id });
  return res.status(200).json({ status: "success" });
});

/*
 * @desc  active Tracking step
 * @router  /tracking/:step/active/:id
 * @method  patch
 * @access  Privet  headOffice and admin
 */

const ActiveTrackStep = asyncHandler(async (req, res) => {
  const { id, step } = req.params; // Extracting quote ID and step name

  try {
    // Find the quote by ID
    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // Check if the step exists in tracking and activate it
    if (!quote.tracking[0][step]) {
      return res.status(400).json({ message: "Invalid tracking step" });
    }

    quote.tracking[0][step].isActive = true;

    // Save the updated quote
    await quote.save({ validateBeforeSave: false });
    res
      .status(200)
      .json({ message: `${step} step activated successfully`, quote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

/*
 * @desc  Not active Tracking step
 * @router  /tracking/:step/notActive/:id
 * @method  patch
 * @access  Privet  headOffice and admin
 */

const notActiveTrackStep = asyncHandler(async (req, res) => {
  const { id, step } = req.params; // Extracting quote ID and step name

  try {
    // Find the quote by ID
    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // Check if tracking array exists and has at least one element
    if (!quote.tracking || quote.tracking.length === 0) {
      return res.status(400).json({ message: "Tracking data not initialized" });
    }

    // Check if the step exists in tracking
    if (!quote.tracking[0][step]) {
      return res
        .status(400)
        .json({ message: `Invalid tracking step: ${step}` });
    }

    if (quote.tracking[0][step].isCompleted === true) {
      quote.tracking[0][step].isCompleted = false;
    }

    if (quote.tracking[0][step].completedDate) {
      quote.tracking[0][step].completedDate = null;
    }

    // Set isActive to false for the given step
    quote.tracking[0][step].isActive = false;

    // Save the updated quote
    await quote.save({ validateBeforeSave: false });

    res
      .status(200)
      .json({ message: `${step} step deactivated successfully`, quote });
  } catch (error) {
    console.error("Error in notActiveTrackStep:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/*
 * @desc  create comment for tracking
 * @router  api/quote/tracking/comment/:id
 * @method  put
 * @access  Privet  headOffice and admin
 */
const addCommentToTrackingStep = asyncHandler(async (req, res) => {
  const { id, step } = req.params;
  const { text } = req.body;

  try {
    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    if (!quote.tracking[0][step]) {
      return res.status(400).json({ message: "Invalid tracking step" });
    }

    if (quote.tracking[0][step].isActive === false) {
      return res.status(400).json({ message: "this step is not active " });
    }

    quote.tracking[0][step].comment.push({
      text: text,
      commentedBy: req.user.userId,
    });

    await quote.save({ validateBeforeSave: false });
    res.status(200).json({ message: "Comment added successfully", quote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

/*
 * @desc  create tracking step completed
 * @router  api/quote/tracking/:step/complete/:id
 * @method  post
 * @access  Privet  headOffice and admin
 */
const completeTrackingStep = asyncHandler(async (req, res) => {
  const { id, step } = req.params; // Extracting quote ID and step name

  try {
    // Find the quote by ID
    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // Check if the step exists in tracking and activate it
    if (!quote.tracking[0][step]) {
      return res.status(400).json({ message: "Invalid tracking step" });
    }

    if (quote.tracking[0][step].isActive === false) {
      return res.status(400).json({ message: "this step is not active " });
    }

    quote.tracking[0][step].isCompleted = true;
    quote.tracking[0][step].completedBy = req.user.userId;

    // Save the updated quote
    await quote.save({ validateBeforeSave: false });
    res
      .status(200)
      .json({ message: `${step} step activated successfully`, quote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

/*
 * @desc  input date of complete
 * @router  api/quote/tracking/:step/completedStepDate/:id
 * @method  patch
 * @access  Privet  headOffice and admin
 */

const updateCompletedDate = asyncHandler(async (req, res) => {
  const { id, step } = req.params; // Quote ID
  const { completedDate } = req.body;

  // Validate input
  if (!completedDate) {
    return res.status(400).json({
      message: "Step name, completed date, and user ID are required.",
    });
  }

  try {
    // Find the quote by ID
    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found." });
    }

    // Check if the step exists in the tracking array
    if (!quote.tracking[0][step]) {
      return res.status(400).json({ message: "Invalid step name." });
    }

    // Update the completedDate, isCompleted, and completedBy fields
    quote.tracking[0][step].completedDate = completedDate;
    quote.tracking[0][step].isActive = true;

    // Save the updated quote
    await quote.save({ validateBeforeSave: false });

    res
      .status(200)
      .json({ message: "Completed date updated successfully.", quote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

/*
 * @desc  create request finished
 * @router  api/quote/finished/:id
 * @method  patch
 * @access  Privet  headOffice and admin
 */
const finishQuote = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // Get the user ID from the token payload

    // Find the quote by ID
    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // Check if the order is already finished
    const isAlreadyFinished = quote.status.some((status) => status.isFinished);
    if (isAlreadyFinished) {
      return res
        .status(400)
        .json({ message: "request is already marked as finished" });
    }

    // Update the status to mark the order as finished
    quote.status.push({
      isFinished: true,
      finishedAt: new Date(),
      actionBy: userId,
    });

    // Save the updated quote
    await quote.save();

    res.status(200).json({ message: "Order marked as finished", quote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  getQuoteForGuest,
  getQuoteById,
  getQuoteByOwnerId,
  ActiveTrackStep,
  notActiveTrackStep,
  createRequestForGest,
  createRequestForClient,
  deleteQuote,
  updateQuote,
  addCommentToTrackingStep,
  completeTrackingStep,
  finishQuote,
  updateCompletedDate,
};
