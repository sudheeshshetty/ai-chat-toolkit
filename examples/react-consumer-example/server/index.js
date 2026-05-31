import cors from "cors";
import express from "express";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/ai-chat/custom", (req, res) => {
  const { message } = req.body ?? {};

  res.json({
    message: message
      ? `Hello from the demo backend! You said: "${message}"`
      : "Hello from the demo backend",
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Demo backend listening on http://localhost:${PORT}`);
});
