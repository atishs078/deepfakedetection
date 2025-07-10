
const express = require("express");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");
const Prediction = require("../model/Prediction")
const verifyJWT = require("../middelware/verifyJWT")
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post("/upload", verifyJWT,upload.single("video"),async (req, res) => {
  const videoPath = req.file.path;
  const python = spawn("python", ["predict.py", videoPath]);

  let output = "";

python.stdout.on("data", (data) => {
  output += data.toString();
});

python.stderr.on("data", (data) => console.error(`stderr: ${data}`));

python.on("close", (code) => {
  console.log(`child process exited with code ${code}`);

  try {
    // Match the last valid JSON object using regex
    const match = output.match(/{.*}/);
    if (match) {
      const json = JSON.parse(match[0]);
      const savePrediction = new Prediction({
        userId: req.user.id,
        videoPath:videoPath,
        result:json.label,
        confidence:json.confidence
      })
      savePrediction.save()
      console.log("Prediction saved to database:", savePrediction);
      res.json(json);
    } else {
      res.status(500).json({ error: "No valid prediction output found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to parse prediction.", details: err.message });
  }
});
});
router.get("/history", verifyJWT, async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user.id }).sort({ uploadedAt: -1 });
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;