import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  checkId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Check",
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  availability: {
    type: Number,
    required: true,
    default: 0,
  },
  outages: {
    type: Number,
    default: 0,
  },
  downtime: {
    type: Number,
    default: 0,
  },
  uptime: {
    type: Number,
    default: 0,
  },
  responseTime: {
    type: String,
    default: 0,
  },
  history: {
    type: [String],
    default: [],
  },
});

export default mongoose.model("Report", reportSchema);
