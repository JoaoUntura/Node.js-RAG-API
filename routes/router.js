import express from "express"
import vectorDatabaseContoller from "../controllers/vectorDatabaseContoller.js"
import namespaceController from "../controllers/namespaceController.js";
import userController from "../controllers/userController.js";
import loginController from "../controllers/loginController.js";
import multer from "multer";
import middleware from "../middlewares/auth_middleware.js";
import loginMiddleware from "../middlewares/login_middleware.js";
import conversationController from "../controllers/conversationController.js";

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

//cria bot

router.post("/newnamespace", middleware, namespaceController.createNamespace)
router.put("/namespace/:id", middleware, namespaceController.updateNamespace)
router.get("/namespace/:name", middleware, namespaceController.getNamespace)
router.delete("/namespace/:id", middleware, namespaceController.deleteNamespace)


//conversas e mensagens
router.get("/conversations/:namespace", middleware, conversationController.getConversations)
router.get("/messages/:conversationId", middleware, conversationController.getMessages)


//manipula dados treinamento
router.post("/newdata/:namespace", middleware, vectorDatabaseContoller.insertNewData)
router.post("/newdata/url/:namespace", middleware,vectorDatabaseContoller.insertNewDataURL)
router.post("/newdata/pdf/:namespace", middleware, upload.array('pdf', 10), vectorDatabaseContoller.insertNewDataPDF)
router.delete("/newdata/:namespace", middleware, vectorDatabaseContoller.deleteData)
router.get("/newdata/:pagtoken/:namespace", middleware, vectorDatabaseContoller.getData)

//manipula user e seus dados
router.post("/user",middleware, userController.newUser)
router.get("/user", middleware, userController.listById)
router.delete("/user/:id", middleware, userController.deleteUser)

//manipula login
router.post("/login", loginMiddleware, loginController.login)
router.post("/verify/publicapi", userController.verifyPublicApi)

export default router


  