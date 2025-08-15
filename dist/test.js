import path from "path";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.join(__dirname, "..");
const filePath = path.join(rootPath, "tasks.json");
const jsonString = await readFile(filePath, "utf8");
console.log(jsonString);
