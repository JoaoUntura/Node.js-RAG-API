import express from "express"
import vectorDatabaseContoller from "../controllers/vectorDatabaseContoller.js"
import userController from "../controllers/userController.js";
import loginController from "../controllers/loginController.js";
import multer from "multer";

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post("/newnamespace", vectorDatabaseContoller.createNamespace)
router.post("/newdata", vectorDatabaseContoller.insertNewData)
router.post("/newdata/url", vectorDatabaseContoller.insertNewDataURL)
router.post("/newdata/pdf", upload.single('pdf'), vectorDatabaseContoller.insertNewDataPDF)
router.delete("/newdata/:namespace", vectorDatabaseContoller.deleteData)
router.get("/newdata/:namespace", vectorDatabaseContoller.getData)

router.post("/user", userController.newUser)
router.get("/user", userController.listAll)
router.delete("/user/:id", userController.deleteUser)

router.post("/login", loginController.login)

export default router


  