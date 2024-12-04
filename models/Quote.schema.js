const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema(
  {
    quoteOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    phoneNumber: {
      type: String,
      required: [true, "phone number is required"],
      trim: true,
      minlength: 8,
    },
    exportingCountry: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
      required: [true, "exporting country Country is required"],
    },
    importingCountry: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
      required: [true, "importing country Country is required"],
    },
    tripType: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
      required: [true, "trip type is required"],
    },
    containerType: {
      type: String,
      enum: ["20", "40"],
    },
    width: {
      type: String,
      trim: true,
      required: [true, "width is required"],
    },
    height: {
      type: String,
      trim: true,
      required: [true, "height is required"],
    },
    lenght: {
      type: String,
      trim: true,
      required: [true, "lenght is required"],
    },
    weight: {
      type: String,
      trim: true,
      required: [true, "weight is required"],
    },
    goodsType: {
      type: String,
      trim: true,
      required: [true, "goodsType is required"],
    },
    amount: {
      type: String,
      trim: true,
      required: [true, "amount is required"],
    },
    status: [
      {
        isFinished: {
          type: Boolean,
          default: false,
        },
        finishedAt: {
          type: Date,
          default: null,
        },
        actionBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    billNumber: {
      type: String,
      trim: true,
      default: ""
    },
    systemNumber: {
      type: String,
      trim: true,
      default: ""

    },
    fees: {
      type: String,
      trim: true,
      default: ""
    },
    isClearance: {
      type: Boolean,
      default: false,
      required: true,
    },
    tracking: [
      {
        booked: {
          isActive: {
            type: Boolean,
            default: false,
          },
          isCompleted: {
            type: Boolean,
            default: false,
          },
          completedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          completedDate: {
            type: String,
            default: null,
          },
          comment: [
            {
              text: {
                type: String,
                minlength: 2,
                required: [true, "text is required"],
              },
              commentedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
            },
          ],
        },
        receiving: {
          isActive: {
            type: Boolean,
            default: false,
          },
          isCompleted: {
            type: Boolean,
            default: false,
          },
          completedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          completedDate: {
            type: String,
            default: null,
          },
          comment: [
            {
              text: {
                type: String,
                minlength: 2,
                required: [true, "text is required"],
              },
              commentedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
            },
          ],
        },
        departed: {
          isActive: {
            type: Boolean,
            default: false,
          },
          isCompleted: {
            type: Boolean,
            default: false,
          },
          completedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          completedDate: {
            type: String,
            default: null,
          },
          comment: [
            {
              text: {
                type: String,
                minlength: 2,
                required: [true, "text is required"],
              },
              commentedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
            },
          ],
        },
        arrived:{
          isActive: {
            type: Boolean,
            default: false,
          },
          isCompleted: {
            type: Boolean,
            default: false,
          },
          completedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          completedDate: {
            type: String,
            default: null,
          },
          comment: [
            {
              text: {
                type: String,
                minlength: 2,
                required: [true, "text is required"],
              },
              commentedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
            },
          ],
        },
        notified: {
          isActive: {
            type: Boolean,
            default: false,
          },
          isCompleted: {
            type: Boolean,
            default: false,
          },
          completedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          completedDate: {
            type: String,
            default: null,
          },
          comment: [
            {
              text: {
                type: String,
                minlength: 2,
                required: [true, "text is required"],
              },
              commentedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
            },
          ],
        },
        customers: {
          isActive: {
            type: Boolean,
            default: false,
          },
          isCompleted: {
            type: Boolean,
            default: false,
          },
          completedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          completedDate: {
            type: String,
            default: null,
          },
          comment: [
            {
              text: {
                type: String,
                minlength: 2,
                required: [true, "text is required"],
              },
              commentedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
            },
          ],
        },
        shipping: {
          isActive: {
            type: Boolean,
            default: false,
          },
          isCompleted: {
            type: Boolean,
            default: false,
          },
          completedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          completedDate: {
            type: String,
            default: null,
          },
          comment: [
            {
              text: {
                type: String,
                minlength: 2,
                required: [true, "text is required"],
              },
              commentedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
            },
          ],
        },
      },
    ],
    clearance: [
      {
        title: {
          type: String,
          minlength: 2,
          required: [true, "text is required"],
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
        completedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        completedDate: {
          type: String,
          default: null,
        },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);


const Quote = mongoose.model("Quote", QuoteSchema);

module.exports = Quote;
