import namespacesServices from "../services/namespacesServices.js";


class NamespaceController{

      async getNamespace(req, res) {

        const { name } = req.params;
        const userid = parseInt(req.userid);

        const response = await namespacesServices.getNamespaceService(
          name,
          userid
        );

        response.validated
          ? res.status(200).json({ sucess: true, data: response.values })
          : res.status(400).json({ sucess: false, data: response.error });

      }

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

      async deleteNamespace(req, res){
        const userid = parseInt(req.userid)
        const id = parseInt(req.params.id);
        
        const response = await namespacesServices.deleteNamespaceService(id, userid);
        response.validated
        ? res.status(200).json({ sucess: true })
        : res.status(400).json({ sucess: false, data: response.error });

      }
}

export default new NamespaceController();