import mongoose from 'mongoose';

const articleSectionSchema = new mongoose.Schema(
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
articleSectionSchema.index({ name: 1 });

const ArticleSection = mongoose.model('ArticleSection', articleSectionSchema);

export default ArticleSection;

