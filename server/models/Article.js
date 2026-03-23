import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an article name'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide article content'],
    },
    photo: {
      type: String,
      trim: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ArticleSection',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
articleSchema.index({ createdAt: -1 });
articleSchema.index({ section: 1, published: 1, createdAt: -1 });
articleSchema.index({ published: 1, createdAt: -1 });
articleSchema.index({ name: 'text', content: 'text' }); // Text search index

const Article = mongoose.model('Article', articleSchema);

export default Article;

