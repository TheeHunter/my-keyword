#!/usr/bin/env node

import * as p from "@clack/prompts";
import { setTimeout } from "node:timers/promises";
import chalk from "chalk";
import express from "express";
import cors from "cors";
import multer from "multer";
import PDFParser from "pdf-parse";
import fs from "fs";
import path from "path";
import { spawn } from 'child_process';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

async function main() {
  p.intro(chalk.bgMagenta(chalk.black(" Welcome to Mr Keyword ")));

  const startup = await p.select({
    message:
      "Are you ready to unlock the full power of your documents, effortlessly.?",
    initialValue: "Yes",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  });

  if (startup === "No") {
    p.outro(chalk.bgMagenta(chalk.black(" Okay, goodbye! ")));
     return process.exit(0);
  }

  const fileload = await p.select({
    message: "Please select one option below",
    initialValue: "Single file",
    options: [
      { value: "1", label: "Single file" },
      { value: "2", label: "multiple files" },
    ],

  });
  

  if (fileload === "1") {
    await callBashScript(fileload);
  } else if (fileload === "2") {
    await callBashScript(fileload);
  }
  
  await main_cont();

}

async function callBashScript(fileload) {
  // Fix the path to use proper Windows path formatting
  const batScriptPath = path.join(process.cwd(), 'run_py', 'run_python.bat');

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('cmd.exe', ['/c', batScriptPath, fileload]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Batch script output: ${data.toString()}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Batch script error: ${data.toString()}`);
    });

    pythonProcess.on('close', (code) => {
       
        if (code === 0) {
            resolve();
        } else {
            reject(new Error(`Process exited with code ${code}`));
        }
    });
  });
}

async function main_cont(){

  const contin = await p.select({
    message:
      "would you like to continue or add more files?",
    initialValue: "Yes",
    options: [
      { value: "Yes", label: "Continue" },
      { value: "No", label: "Add files" },
    ],
  });

  if(contin === "Yes"){
    p.outro(chalk.bgMagenta(chalk.black("Coming soon!")));
     return process.exit(0);
  } else{
    callBashScript("2")
  }

}

// Separate server startup into its own function
async function startServer() {
  const app = express();
  app.use(cors());
  
  // Fix the path creation
  const uploadDirectory = path.join(process.cwd(), "uploads");
  // OR alternatively:
  // const uploadDirectory = "./uploads";

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadDirectory)) {
    try {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    } catch (error) {
      console.error('Error creating uploads directory:', error);
      throw error;
    }
  }

  // Set up multer for handling file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDirectory); // Save files in 'uploads' directory
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Keep the original file name
    },
  });
  const upload = multer({ storage });

  // Handle file upload route
  app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join(uploadDirectory, req.file.filename);
    console.log(`File uploaded to: ${filePath}`);

    try {
      const data = fs.readFileSync(filePath);
      const pdfData = await PDFParser(data);
      console.log(pdfData.text); // Output PDF text
      res
        .status(200)
        .json({ message: "File uploaded and processed", data: pdfData.text });
    } catch (error) {
      console.error("Error reading or processing file:", error);
      res.status(500).json({ error: "Failed to process file" });
    }
  });

  return new Promise((resolve) => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
      resolve();
    });
  });
}

main().catch(console.error);
