const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const filePath = "./weatherData.json";

app.get("/", (req, res) => {
  res.send("Weather Backend Running");
});

// CREATE
app.post("/weather/save", (req, res) => {
  let data = [];

  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath));
  }

  const newRecord = {
    id: Date.now(),
    ...req.body,
  };

  data.push(newRecord);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ message: "Weather saved successfully", data: newRecord });
});

// READ
app.get("/weather/history", (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }

  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

// UPDATE
app.put("/weather/update/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "No data found" });
  }

  let data = JSON.parse(fs.readFileSync(filePath));

  data = data.map((item) =>
    item.id === id ? { ...item, ...req.body } : item
  );

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ message: "Weather updated successfully" });
});

// DELETE
app.delete("/weather/delete/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "No data found" });
  }

  let data = JSON.parse(fs.readFileSync(filePath));
  data = data.filter((item) => item.id !== id);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ message: "Deleted successfully" });
});

// EXPORT JSON
app.get("/weather/export", (req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }

  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});