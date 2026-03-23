import mongoose from 'mongoose';

const podcastSchema = new mongoose.Schema(
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
    shortDescription: {
      type: String,
      trim: true,
    },
    shortVideoLink: {
      type: String,
      trim: true,
    },
    fullVideoLink: {
      type: String,
      trim: true,
    },
    audioUrl: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    showNotes: {
      type: String,
    },
    transcript: {
      type: String,
    },
    host: {
      type: String,
      trim: true,
    },
    guest: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
podcastSchema.index({ createdAt: -1 });
podcastSchema.index({ featured: 1, createdAt: -1 });
podcastSchema.index({ section: 1, published: 1, createdAt: -1 }); // Compound index for section queries
podcastSchema.index({ published: 1, featured: 1 }); // For featured published podcasts
podcastSchema.index({ name: 'text', description: 'text' }); // Text search index

const Podcast = mongoose.model('Podcast', podcastSchema);

export default Podcast;

