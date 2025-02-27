import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import './utiles/cron.js'
import connectDB from './utiles/db.js'
import userRoute from './router/user.route.js'
import faqCategoryRoutes from './router/faqCategory.routes.js'
import faqRoutes from './router/faq.routes.js'
import path from 'path'
dotenv.config({});

const app = express()

const _dirname = path.resolve();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const corsOption = {
    origin: 'https://deploy-7q6y.onrender.com',
    credentials: true
}
app.use(cors(corsOption))

const PORT = process.env.PORT || 3000;

app.use('/api/v1/user', userRoute)
app.use('/api/v1/faq-categories', faqCategoryRoutes)
app.use('/api/v1/faqs', faqRoutes)

app.use(express.static(path.join(_dirname, "/fronted/dist")))
app.get('*', (_, res) => {
    res.sendFile(path.resolve(_dirname, "fronted", "dist", "index.html"))
})

app.listen(PORT, () => {
    connectDB()
    console.log(`Server are stated PORT Number ${PORT}`)
})