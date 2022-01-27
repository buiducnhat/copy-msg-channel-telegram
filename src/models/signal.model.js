const mongoose = require('mongoose');

const SignalSchema = new mongoose.Schema(
  {
    srcChannelId: {
      type: String,
      required: true,
    },
    srcMsgId: {
      type: Number,
      required: true,
    },
    desChannelId: {
      type: String,
    },
    desMsgId: {
      type: Number,
    },
    msg: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Signal', SignalSchema);
