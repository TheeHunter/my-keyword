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


async function startServer() {
  const PORT = process.env.PORT || 3000; // Use the port from the environment or default to 3000
   app.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
   });
}

main().catch(console.error);
