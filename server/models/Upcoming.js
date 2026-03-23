import mongoose from 'mongoose';

const upcomingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a podcast name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    photo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
upcomingSchema.index({ createdAt: -1 }); // For sorting by newest first

const Upcoming = mongoose.model('Upcoming', upcomingSchema);

export default Upcoming;

