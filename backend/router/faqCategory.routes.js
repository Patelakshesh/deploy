import express  from "express";
import { addFaqCategory, listFaqCategories } from "../controller/faqCategory.controller.js";

const router = express.Router();

router.route('/add').post( addFaqCategory);
router.route('/list').get(  listFaqCategories)

export default router;