import express from "express"
import vectorDatabaseContoller from "../controllers/vectorDatabaseContoller.js"
import userController from "../controllers/userController.js";
import loginController from "../controllers/loginController.js";
import multer from "multer";
import middleware from "../middlewares/auth_middleware.js";

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post("/newnamespace", vectorDatabaseContoller.createNamespace)
router.post("/newdata", middleware, vectorDatabaseContoller.insertNewData)
router.post("/newdata/url", middleware,vectorDatabaseContoller.insertNewDataURL)
router.post("/newdata/pdf", middleware, upload.single('pdf'), vectorDatabaseContoller.insertNewDataPDF)
router.delete("/newdata", middleware, vectorDatabaseContoller.deleteData)
router.get("/newdata",middleware, vectorDatabaseContoller.getData)

router.post("/user", userController.newUser)
router.get("/user", middleware, userController.listAll)
router.delete("/user/:id", userController.deleteUser)

router.post("/login", loginController.login)

export default router


  