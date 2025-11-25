import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json()); // Барои қабул кардани JSON аз POST/PUT

// Хондан ва нигоҳ доштани маълумот
let data = JSON.parse(fs.readFileSync("./data.json"));

const saveData = () => {
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
};

// GENERIC CRUD ROUTES Функсия барои ҳар қисм
const createCrudRoutes = (name) => {
  // GET ҳама
  app.get(`/api/${name}`, (req, res) => {
    res.json(data[name]);
  });

  // GET by ID
  app.get(`/api/${name}/:id`, (req, res) => {
    const item = data[name].find((i) => i.id === req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  });

  // POST
  app.post(`/api/${name}`, (req, res) => {
    const newItem = req.body;
    data[name].push(newItem);
    saveData();
    res.status(201).json(newItem);
  });

  // PUT (update by ID)
  app.put(`/api/${name}/:id`, (req, res) => {
    const index = data[name].findIndex((i) => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    data[name][index] = { ...data[name][index], ...req.body };
    saveData();
    res.json(data[name][index]);
  });

  // DELETE by ID
  app.delete(`/api/${name}/:id`, (req, res) => {
    const index = data[name].findIndex((i) => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    const deleted = data[name].splice(index, 1)[0];
    saveData();
    res.json(deleted);
  });
};

// Қисмҳоро илова кунем
["Login", "Sigup", "messageDB", "courses"].forEach(createCrudRoutes);

// ROUTE асосӣ
app.get("/", (req, res) => {
  res.send("Node server is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
