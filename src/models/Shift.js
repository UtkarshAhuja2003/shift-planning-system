import mongoose from "mongoose";
import { WeekDaysEnum } from "../constants.js";

const { Schema } = mongoose;

const shiftSchema = new Schema({
  dayOfWeek: {
    type: String,
    enum: WeekDaysEnum,
    required: [true, "Day of the week is required"]
  },
  startTime: {
    type: Date,
    required: [true, "Shift start time is required"]
  },
  endTime: {
    type: Date,
    required: [true, "Shift end time is required"]
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Employee is required"]
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Admin is required"]
  }
}, {
  timestamps: true
});

const Shift = mongoose.model("Shift", shiftSchema);
export default Shift;
