import {FaqCategory} from '../models/FaqCategory.model.js'


export const addFaqCategory = async (req, res) => {
    try {
        const {faq_cat_name} = req.body
        if(!faq_cat_name){
            return res.status(400).json({
                message: "Category name is required",
                success: true
            })
        }
        const newCategory = new FaqCategory({faq_cat_name})
        await newCategory.save();
        res.status(201).json({
            message: "FAQ Category addes successfully",
            category: newCategory,
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}

export const listFaqCategories = async (req, res) => {
    try {
        const categories =  await FaqCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        console.log(error)
    }
}