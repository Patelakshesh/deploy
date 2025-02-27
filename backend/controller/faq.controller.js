import mongoose from "mongoose";
import {Faq} from "../models/Faq.models.js"
import {FaqCategory} from '../models/FaqCategory.model.js'

export const addFaq = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const {cat_id, question, answer} = req.body;
        if(!cat_id || !question || !answer){
            return res.status(400).json({
                message: "All fidels are requires",
                success: false
            })
        }
        const categoryExists = await FaqCategory.findById(cat_id).session(session);
        if(!categoryExists) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                message: 'Category not found',
                success: false
            })
        }
        const newFaq = new Faq({cat_id, question, answer});
        await newFaq.save({session});

        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            message: "FAQ added successfully",
            faq:newFaq,
            success: true
        })

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction failed:", error);
        res.status(500).json({
            message: "Transaction failed",
            success: false,
            error: error.message
        });
    }
}

export const editFaq = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const {id} = req.params;
        const {question, answer, cat_id} = req.body;

        const faq = await Faq.findById(id).session(session);
        if(!faq){
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                message: "FAQ not found",
                success: false
            })
        }
        if(cat_id){
            const categoryExists = await FaqCategory.findById(cat_id).session(session);
            if(!categoryExists){
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({
                    message: "Category not found",
                    success: false
                });
            }
        }
        faq.question = question || faq.question;
        faq.answer = answer || faq.answer;
        faq.cat_id = cat_id || faq.cat_id;
        await faq.save({session});
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({
            message: "FAQ updated successfully", 
            faq,
            success: true
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction failed:", error);
        res.status(500).json({
            message: "Transaction failed",
            success: false,
            error: error.message
        });
    }
}

export const softDeleteFaq = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
       const {id} = req.params;
       
       const faq = await Faq.findById(id).session(session);
       if (!faq) {
           await session.abortTransaction();
           session.endSession();
           return res.status(404).json({
               message: "FAQ not found",
               success: false
           });
       }

       faq.isDeleted = true;
       await faq.save({session});

       await session.commitTransaction();
       session.endSession();

       res.status(200).json({
        message: "FAQ soft deleted successfully",
        success: true,
       })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction failed:", error);
        res.status(500).json({
            message: "Transaction failed",
            success: false,
            error: error.message
        });
    }
}

export const listFaqs = async (req, res) => {
    try {
        let { page = 1, limit = 5, search = "" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const query = { isDeleted: false };

        if (search) {
            query.$or = [
                { question: { $regex: search, $options: "i" } },
                { answer: { $regex: search, $options: "i" } }
            ];
        }

        const totalFaqs = await Faq.countDocuments(query);
        const totalPages = Math.ceil(totalFaqs / limit);

        if (page > totalPages) {
            page = totalPages > 0 ? totalPages : 1;
        }

        const faqs = await Faq.find(query)
            .populate("cat_id", "faq_cat_name")
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            message: "FAQs retrieved successfully",
            success: true,
            totalFaqs,
            totalPages,
            currentPage: page,
            faqs,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const deleteFaq = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const {id} = req.params;

        const faq = await Faq.findByIdAndDelete(id, { session });
        if (!faq) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                message: "FAQ not found",
                success: false
            });
        }
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({
            message: "FAQ permanently deleted",
            success: true
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction failed:", error);
        res.status(500).json({
            message: "Transaction failed",
            success: false,
            error: error.message
        });
    }
}