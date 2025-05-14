import users from "../services/userServices.js";
import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";
import authServices from "../services/authServices.js";

class LoginController {
    async login(req, res) {
        let { email, password } = req.body;
        let user = await users.findByEmail(email);

        if (user.values != undefined) {

            let passValidated = authServices.comparePasswordService(password, user.values.password);
            if (!passValidated) {
                return res.status(406).json({ success: false, message: "Senha Invalida" });
            } else {
                // Gerar o token JWT
                let token = jwt.sign({ userid: user.values.id }, process.env.SECRET, { expiresIn: '1d' });

                // Setar o cookie com o token
                res.cookie('token', token, {
                    httpOnly: true,            // Impede acesso ao cookie via JavaScript
                    secure: true, // Só habilita o secure em produção
                    sameSite: 'None',          // Necessário para permitir cookies em requests cross-origin
                    maxAge: 1000 * 60 * 60 * 24,  // Tempo de expiração (1 dia)
                    path: '/',                // O cookie é acessível em toda a aplicação
                });

                return res.status(200).json({ success: true });
            }
        } else {
            return res.status(406).json({ success: false, message: 'E-mail não encontrado' });
        }
    }
}

export default new LoginController();
