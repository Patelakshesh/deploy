import mongoose from "mongoose"

const faqCategorySchema = new mongoose.Schema({
    faq_cat_name: {
        type: String,
        required: true,
        unique: true
    },
}, {timestamps: true})

export const FaqCategory = mongoose.model('FaqCategory', faqCategorySchema)