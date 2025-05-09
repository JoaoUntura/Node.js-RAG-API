import axios from "axios";
import * as cheerio from "cheerio";
import aiServices from "./aiServices.js";

class DataUtilServices {
  dividirTextoVetores(document, categoria, texto, tamanho = 500) {
    const chunks = [];
    for (let i = 0; i < texto.length; i += tamanho) {
      chunks.push({
        "_id": `${document}rec_${i}`,
        "chunk_text": texto.slice(i, i + tamanho),
        "document": document,
        "category": categoria,
      });
    }
    return chunks;
  }

  dividirTextoRaw(texto, tamanho = 20000) {
    const chunks = [];
    for (let i = 0; i < texto.length; i += tamanho) {
      chunks.push(texto.slice(i, i + tamanho));
    }
    return chunks;
  }

  async scrapSite(url) {
    try {
      const response = await axios.get(url, { timeout: 15000 });
      const $ = cheerio.load(response.data);

      $("script, style, noscript, iframe").remove();

      let textSite = $("body")
        .text() // pega o texto do body
        .replace(/\s+/g, " ") // substitui múltiplos espaços por um só

      const chunks = this.dividirTextoRaw(textSite);

      if (chunks.length > 4) {
        return { validated: false, error: "Site com texto muito longo" };
      }

      let finalText = '';
      for (let chunk of chunks) {
        const aiFilteredText = await aiServices.generateReply([
          {
            role: "system",
            content: `Extraia apenas o texto útil deste texto extraido de um website, sem introduções: ${chunk}`,
          },
        ]);

        finalText += aiFilteredText
            .replace(/\s+/g, " ") // substitui múltiplos espaços por um só
            .replace(/\*{1,2}/g, "")
            .replace(/^\s+|\s+$/g, "")
        
      }
      console.log(finalText)
      return { validated: true, data: finalText};
    } catch (error) {
      return { validated: false, error: error };
    }
  }


}

export default new DataUtilServices();
