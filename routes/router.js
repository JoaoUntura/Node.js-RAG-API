import express from "express"
import vectorDatabaseContoller from "../controllers/vectorDatabaseContoller.js"
import userController from "../controllers/userController.js";
import loginController from "../controllers/loginController.js";
import multer from "multer";
import middleware from "../middlewares/auth_middleware.js";
import loginMiddleware from "../middlewares/login_middleware.js";

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post("/newnamespace", middleware, vectorDatabaseContoller.createNamespace)
router.post("/newdata", middleware, vectorDatabaseContoller.insertNewData)
router.post("/newdata/url", middleware,vectorDatabaseContoller.insertNewDataURL)
router.post("/newdata/pdf", middleware, upload.single('pdf'), vectorDatabaseContoller.insertNewDataPDF)
router.delete("/newdata", middleware, vectorDatabaseContoller.deleteData)
router.get("/newdata/:pagtoken", middleware, vectorDatabaseContoller.getData)

router.post("/user",middleware, userController.newUser)
router.get("/user", middleware, userController.listById)
router.delete("/user/:id", middleware, userController.deleteUser)

router.post("/login", loginMiddleware, loginController.login)
router.post("/verify/publicapi", userController.verifyPublicApi)

export default router


  