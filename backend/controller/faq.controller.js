import {Faq} from "../models/Faq.models.js"

export const addFaq = async (req, res) => {
    try {
        const {cat_id, question, answer} = req.body;
        if(!cat_id || !question || !answer){
            return res.status(400).json({
                message: "All fidels are requires",
                success: false
            })
        }
        const newFaq = new Faq({cat_id, question, answer});
        await newFaq.save();
        res.status(201).json({
            message: "FAQ added successfully",
            faq:newFaq,
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}

export const editFaq = async (req, res) => {
    try {
        const {id} = req.params;
        const {question, answer, cat_id} = req.body;

        const faq = await Faq.findById(id);
        if(!faq){
            return res.status(404).json({
                message: "FAQ not found",
                success: false
            })
        }
        faq.question = question || faq.question;
        faq.answer = answer || faq.answer;
        faq.cat_id = cat_id || faq.cat_id;
        await faq.save();
        res.status(200).json({
            message: "FAQ updated successfully", 
            faq,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const softDeleteFaq = async (req, res) => {
    try {
       const {id} = req.params;
       
       const faq = await Faq.findById(id);
       if(!faq){
        return res.status(404).json({
            message: "FAQ not found",
            success: false,
        })
       }

       faq.isDeleted = true;
       await faq.save();

       res.status(200).json({
        message: "FAQ soft deleted successfully",
        success: true,
       })
    } catch (error) {
        console.log(error)
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

        // FIRST: Get total count and calculate total pages
        const totalFaqs = await Faq.countDocuments(query);
        const totalPages = Math.ceil(totalFaqs / limit);

        // Adjust page if it exceeds total pages
        if (page > totalPages) {
            page = totalPages > 0 ? totalPages : 1;
        }

        // SECOND: Fetch data with CORRECTED page
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
    try {
        const {id} = req.params;

        const faq = await Faq.findByIdAndDelete(id)
        if(!faq){
            return res.status(404).json({
                message: "FAQ not found",
                success: false
            })
        }
        await Faq.findByIdAndDelete(id)
        res.status(200).json({
            message: "FAQ permanently deleted",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}