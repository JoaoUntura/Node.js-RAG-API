import fs from "fs"
import { PDFDocument } from 'pdf-lib';
import axios from "axios";
import * as cheerio from 'cheerio';

class DataUtilServices{

    dividirTexto(document, categoria, texto, tamanho = 500) {
        const chunks = [];
        for (let i = 0; i < texto.length; i += tamanho) {
          chunks.push({"_id":1,"chunk_text":texto.slice(i, i + tamanho),"document":document, "category":categoria} );
        }
        return chunks;
      }
      
      // === Função para processar o PDF ===
    async processarPdf(pdfPath) {
      const dataBuffer = fs.readFileSync(pdfPath);
      return dataBuffer; 
    }
    
    async scrapSite(url) {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        // Extração do conteúdo textual (ajuste conforme o site)
        let text = "";
        $("body").each((i, elem) => {
          text += $(elem).text();
        });
      
        return text;
      }

}

export default new DataUtilServices