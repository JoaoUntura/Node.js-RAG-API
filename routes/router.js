import express from "express"
import vectorDatabaseContoller from "../controllers/vectorDatabaseContoller.js"
import multer from "multer";

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post("/newdata", vectorDatabaseContoller.insertNewData)
router.delete("/newdata/:namespace", vectorDatabaseContoller.deleteData)
router.get("/newdata/:namespace", vectorDatabaseContoller.getData)


export default router


  