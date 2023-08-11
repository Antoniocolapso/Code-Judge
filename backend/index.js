const express = require("express");
const { generateFile } = require("./generateFile");
const { executeCPP, executeCPPStdin } = require("./executeCPP");
const { executePY, executePYStdin } = require("./executePY");
const { executeRuby, executeRubyStdin } = require("./executeRuby");
const app = express();
const cors = require("cors");
const port = 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ online: "compiler" });
});

app.post("/run", async (req, res) => {
  const { language = 'py', code, testInput, useStdin } = req.body;

  if (code === undefined) {
    return res.status(404).json({ success: false, error: "Empty Code" });
  }

  try {
    let output;

    if (useStdin) {
      output = await executeCode(language, code, testInput, true);
    } else {
      const filepath = await generateFile(language, code);
      output = await executeCode(language, filepath, testInput, false);
    }

    console.log(output);
    res.json({ output });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

const executeCode = async (language, fileOrCode, input, useStdin) => {
  if (language === "cpp") {
    return useStdin ? await executeCPPStdin(fileOrCode, input) : await executeCPP(fileOrCode);
  } else if (language === "py") {
    return useStdin ? await executePYStdin(fileOrCode, input) : await executePY(fileOrCode);
  } else if (language === "rb") {
    return useStdin ? await executeRubyStdin(fileOrCode, input) : await executeRuby(fileOrCode);
  } else {
    throw new Error("Unsupported language");
  }
};

app.listen(port, () => {
  console.log(`Server is listening on port number: ${port}`);
});
