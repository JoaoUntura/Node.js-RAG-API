import namespacesServices from "../services/namespacesServices.js";
import userServices from "../services/userServices.js";

class NamespaceController{

      async createNamespace(req, res) {
    
        let { name, pre_prompt } = req.body;
    
        const response = await namespacesServices.createNamespaceService(
            name,
          req.userid,
          pre_prompt
        );
    
        response.validated
          ? res.status(200).json({ sucess: true })
          : res.status(400).json({ sucess: false, data: response.error });
      }

      async updateNamespace(req, res) {
        const id = parseInt(req.params.id);
        let { pre_prompt } = req.body;
        const userid = req.userid;

    
        const response = await namespacesServices.updateNamespaceService(
            id,
            pre_prompt,
            userid
        );
    
        response.validated
          ? res.status(200).json({ sucess: true })
          : res.status(400).json({ sucess: false, data: response.error });

      }
}

export default new NamespaceController();