import express  from "express";
import { addFaqCategory, listFaqCategories } from "../controller/faqCategory.controller.js";
import roleAuthorize from "../midddlewares/roleAuthorize.js";
import isAuthenticatedd from "../midddlewares/isAuthenticated.js";

const router = express.Router();

router.route('/add').post(isAuthenticatedd, roleAuthorize("admin"), addFaqCategory);
router.route('/list').get(  listFaqCategories)

export default router;