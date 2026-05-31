import cors from "cors";
import express from "express";

const app = express();
const PORT = Number(process.env.PORT) || 3030;

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

const server = app.listen(PORT);

server.on("listening", () => {
  console.log(`Demo backend listening on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
    console.error("Stop the other process (lsof -i :3000) or use PORT=3001 pnpm run dev:server");
  } else {
    console.error("Failed to start demo backend:", err.message);
  }
  process.exit(1);
});
