const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //Referenece to the User connetions
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //Referenece to the User connetions
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is a incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  //   Check if the fromUSerId is same as the toUSerId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    // throw new Error("Cannot send connection request to yourself");
    return new Error("Cannot send connection request to yourself");
  }
  // next();
});

const connectionRequestModal = mongoose.model(
  "connectionRequest",
  connectionRequestSchema,
);

module.exports = connectionRequestModal;
