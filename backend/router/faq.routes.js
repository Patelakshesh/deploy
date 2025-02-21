import express from "express";
import { addFaq, deleteFaq, editFaq, listFaqs, softDeleteFaq } from "../controller/faq.controller.js";

const router = express.Router();

router.route('/add').post( addFaq)
router.route('/edit/:id').put( editFaq)
router.route('/soft-delete/:id').delete( softDeleteFaq)
router.route('/list').get( listFaqs);
router.route('/delete/:id').delete( deleteFaq)

export default router;