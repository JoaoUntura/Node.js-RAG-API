import axios from "axios";
import * as cheerio from "cheerio";
import aiServices from "./aiServices.js";
import pdf from "pdf-parse-debugging-disabled";
import * as fs from 'fs';
import fsPromises from "fs/promises";
import path from "path";
import mammoth from "mammoth";
import textract from "textract";
import * as XLSX from 'xlsx/xlsx.mjs';
import { parse } from "csv-parse/sync";
import https from "https";

XLSX.set_fs(fs);

class DataUtilServices {

  dividirTextoVetores(document, categoria, texto, tamanho = 500, type) {
    const chunks = [];
    for (let i = 0; i < texto.length; i += tamanho) {
      const chunkIndex = Math.floor(i / tamanho);
      chunks.push({
        "_id": `${this.normalizeVectorId(document)}rec_${chunkIndex}`,
        "chunk_text": texto.slice(i, i + tamanho),
        "document": document,
        "document_order": chunkIndex,
        "doc_type":type,
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
      const agent = new https.Agent({
        rejectUnauthorized: false // ⚠️ Use apenas em desenvolvimento
      });
      const response = await axios.get(url, { timeout: 15000 , httpsAgent: agent});
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

      return { validated: true, data: finalText};
    } catch (error) {
      return { validated: false, error: error };
    }
  }

  async pdfReader(path){
    
    try{
  
    
      return { validated: true, data: finalText};
    } catch (error) {
      return { validated: false, error: error };
    }

  }

  async fileReader(filePath, mimeType){
    try{
      console.log("Lendo arquivo:", filePath, "com tipo MIME:", mimeType);
    switch (mimeType) {
      case "text/plain": // .txt
        return fsPromises.readFile(filePath, "utf-8");
  
      case "text/csv": // .csv
        const content = await fsPromises.readFile(filePath, "utf-8");
        const records = parse(content, { columns: false });
        return records.map(row => row.join(",")).join("\n");
  
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": // .xlsx
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        return rows
        .map(row => row.join(" | ")) // separa colunas com " | "
        .join("\n");                // separa linhas com nova linha
  
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": // .docx
        const bufferDocx = await fsPromises.readFile(filePath);
        const result = await mammoth.extractRawText({ buffer: bufferDocx });
        return result.value;
  
      case "application/pdf": // .pdf
        const data = await pdf(filePath);
        const finalText =  data.text.replace(/\s+/g, " ")
        return finalText;
  
      case "application/msword": // .doc antigo
      default:
        
        return new Promise((resolve, reject) => {
          textract.fromFileWithPath(filePath, (err, text) => {
            if (err) return reject(err);
            resolve(text);
          });
        });
    }
    }catch (error) {
      return { validated: false, error: error.message || error.toString() };
    }
  }

  normalizeVectorId(input) {
    return input
      .normalize("NFKD") // Decompõe caracteres como 'é' -> 'e' + acento
      .replace(/[\u0300-\u036f]/g, '') // Remove marcas diacríticas
      .replace(/[^\x00-\x7F]/g, '') // Remove qualquer caractere não-ASCII restante
      .replace(/\s+/g, '_') // Substitui espaços por _
      .replace(/[^a-zA-Z0-9_-]/g, '') // Remove tudo que não for letra, número, _ ou -
      .toLowerCase(); // Opcional: para manter consistência
  }


}

export default new DataUtilServices();
