import mongoose from 'mongoose';

const projectSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: false }, // Base64 or local path
});

const skillSchema = mongoose.Schema({
  name: { type: String, required: true },
});

const educationSchema = mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, required: true },
});

const portfolioSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    template: {
      type: String,
      required: true,
      default: 'modern',
    },
    title: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: false,
    },
    githubLink: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String, // Base64 or local path
      required: false,
    },
    skills: [skillSchema],
    projects: [projectSchema],
    education: [educationSchema],
    experience: [{
      title: { type: String, required: true },
      company: { type: String, required: true },
      description: { type: String, required: false },
    }],
    customizations: {
      primaryColor: { type: String, default: '#3b82f6' },
      fontFamily: { type: String, default: 'sans-serif' },
      layout: { type: String, default: 'top' }, // top | left | right
      showSkills: { type: Boolean, default: true },
      showProjects: { type: Boolean, default: true },
      showEducation: { type: Boolean, default: true },
      showExperience: { type: Boolean, default: true },
      showContact: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
