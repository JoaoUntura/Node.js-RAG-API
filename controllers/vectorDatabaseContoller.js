import dataUtilsServices from "../services/dataUtilsServices.js";
import userServices from "../services/userServices.js";
import vectorService from "../services/vectorDatabaseServices.js";

class VectorDatabaseController {
  async insertNewData(req, res) {
    let { data } = req.body;

    const namespace = req.params.namespace;
    const valitadion = await userServices.verifyNameSpace(
      req.userid,
      namespace
    );

    if (!valitadion.validated) {
      res.status(400).json({ sucess: false, data: valitadion.error });
    } else {
      const response = await vectorService.insertDataService(namespace, data);

      response.validated
        ? res.status(200).json({ sucess: true })
        : res.status(400).json({ sucess: false, data: response.error });
    }
  }

  async insertNewDataURL(req, res) {
    let { url, categoria } = req.body;
    const namespace = req.params.namespace;
    const valitadion = await userServices.verifyNameSpace(
      req.userid,
      namespace
    );
    if (!valitadion.validated) {
      res.status(400).json({ sucess: false, data: valitadion.error });
      return;
    }
    const text = await dataUtilsServices.scrapSite(url);

    if (text.validated) {
      const records = dataUtilsServices.dividirTextoVetores(
        url,
        categoria,
        text.data,
        500,
        "url"
      );

      const response = await vectorService.insertDataService(
        namespace,
        records
      );

      const returnRecords = records.map((record) => ({
        id: record._id,
        data: {
          category: record.category,
          chunk_text: record.chunk_text,
          document: record.document,
          document_order: record.document_order,
          doc_type: record.doc_type,
        },
      }));

      response.validated
        ? res.status(200).json({ sucess: true, data: returnRecords })
        : res.status(400).json({ sucess: false, data: response.error });
    } else {
      res.status(400).json({ sucess: false, data: text.error });
    }
  }

  async insertNewDataPDF(req, res) {
    let path = req.file.path;
    const name = req.file.originalname;
    let { categoria } = req.body;
    const namespace = req.params.namespace;
    const valitadion = await userServices.verifyNameSpace(
      req.userid,
      namespace
    );
    if (!valitadion.validated) {
      res.status(400).json({ sucess: false, data: valitadion.error });
      return;
    }

    const text = await dataUtilsServices.pdfReader(path);
    if (text.validated) {
      const records = dataUtilsServices.dividirTextoVetores(
        name,
        categoria,
        text.data,
        500,
        "pdf"
      );
      const response = await vectorService.insertDataService(
        namespace,
        records
      );
      const returnRecords = records.map((record) => ({
        id: record._id,
        data: {
          category: record.category,
          chunk_text: record.chunk_text,
          document: record.document,
          document_order: record.document_order,
          doc_type: record.doc_type,
        },
      }));

      response.validated
        ? res.status(200).json({ sucess: true, data: returnRecords })
        : res.status(400).json({ sucess: false, data: response.error });
    } else {
      res.status(400).json({ sucess: false, data: text.error });
    }
  }

  async createNamespace(req, res) {
    let { namespace } = req.body;

    const response = await vectorService.createNamespaceService(namespace);

    response.validated
      ? res.status(200).json({ sucess: true })
      : res.status(400).json({ sucess: false, data: response.error });
  }

  async getData(req, res) {
    const namespace = req.params.namespace;
    const valitadion = await userServices.verifyNameSpace(
      req.userid,
      namespace
    );
    if (!valitadion.validated) {
      res.status(400).json({ sucess: false, data: valitadion.error });
      return;
    }

    const paginationToken =
      req.params.pagtoken == "0" ? null : req.params.pagtoken;

    const response = await vectorService.getDataService(
      namespace,
      paginationToken
    );

    response.validated
      ? res.status(200).json({ sucess: true, data: response.data })
      : res.status(400).json({ sucess: false, data: response.error });
  }

  async deleteData(req, res) {
    const namespace = req.params.namespace;
    const valitadion = await userServices.verifyNameSpace(
      req.userid,
      namespace
    );
    if (!valitadion.validated) {
      res.status(400).json({ sucess: false, data: valitadion.error });
      return;
    }
    let { id } = req.body;
    const response = await vectorService.deleteDataService(
      namespace,
      id
    );

    response.validated
      ? res.status(200).json({ sucess: true })
      : res.status(400).json({ sucess: false, data: response.error });
  }
}

export default new VectorDatabaseController();
