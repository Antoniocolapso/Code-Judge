const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuid } = require("uuid");

const outputPath = path.join(__dirname, "outputs");
const inputPath = path.join(__dirname, "codes", "WI");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

if (!fs.existsSync(inputPath)) {
  fs.mkdirSync(inputPath, { recursive: true });
}

const executeRuby = (filePath) => {
  return new Promise((resolve, reject) => {
    exec(`ruby "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        if (error.code==1){
          resolve("Runtime Error");
        }
        reject({ error, stderr });
      } else {
        // resolve("Successfully Executed");
        resolve(stdout);
      }
    });
  });
};

const executeRubyStdin = (code, input) => {
  return new Promise((resolve, reject) => {
    const jobId = uuid();
    const filePath = path.join(inputPath, `${jobId}.rb`);
    fs.writeFile(filePath, code, (err) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const rubyProcess = exec(`ruby "${filePath}"`, (error, stdout, stderr) => {
          if (error) {
            console.error(error);
            if (error.code==1){
              resolve("Runtime Error");
            }
            reject({ error, stderr });
          } else {
            resolve(stdout);
          }
        });
        rubyProcess.stdin.write(input);
        rubyProcess.stdin.end();
      }
    });
  });
};

module.exports = {
  executeRuby,
  executeRubyStdin,
};
