import express from "express"
import vectorDatabaseContoller from "../controllers/vectorDatabaseContoller.js"
import multer from "multer";

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post("/newdata", vectorDatabaseContoller.insertNewData)
router.get("/newdata", vectorDatabaseContoller.getData)
router.post("/newdata/pdf", upload.single("pdf"), vectorDatabaseContoller.uploadPdfData)

export default router


  