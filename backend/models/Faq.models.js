import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  cat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FaqCategory",
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true
  },
  isDeleted: { 
    type: Boolean,
     default: false
     },
}, {timestamps: true})

export const Faq = mongoose.model("Faq", faqSchema)