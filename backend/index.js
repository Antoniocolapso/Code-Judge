const express = require("express");
const { generateFile } = require("./generateFile");
const { executeCPP } = require("./executeCPP");
const { executePY } = require("./executePY");
const { executeRuby } = require("./executeRuby");
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
  const { language = 'py', code, testInput } = req.body;

  if (code === undefined) {
    return res.status(404).json({ success: false, error: "Empty Code" });
  }

  try {
    const filepath = await generateFile(language, code);
    let output;

    if (language === "cpp") {
      output = await executeCPP(filepath, testInput);
    } else if (language === "py") {
      output = await executePY(filepath, testInput);
    } else if (language === "rb") {
      output = await executeRuby(filepath, testInput);
    } else {
      return res.status(400).json({ success: false, error: "Unsupported language" });
    }

    console.log(output);
    res.json({ filepath, output });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port number: ${port}`);
});
