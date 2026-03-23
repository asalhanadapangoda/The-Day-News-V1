import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a section name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
sectionSchema.index({ name: 1 }); // Unique index already exists, this is for sorting

const Section = mongoose.model('Section', sectionSchema);

export default Section;

