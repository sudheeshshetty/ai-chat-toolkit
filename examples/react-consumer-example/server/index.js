import cors from "cors";
import express from "express";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept"],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
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
