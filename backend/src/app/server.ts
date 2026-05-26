import { connectToDatabase } from "@/config/database.js";
import { env } from "@/config/env.js";
import { createApp } from "@/app/app.js";
import { createServer } from "http";
import { socketService } from "@/services/socket.service.js";

async function startServer(): Promise<void> {
  await connectToDatabase(env.MONGODB_URI);

  const app = createApp();
  const server = createServer(app);
  
  socketService.init(server);

  server.listen(env.PORT, () => {
    console.warn(`Backend listening on port ${env.PORT}`);
  });
}

startServer().catch((error: Error) => {
  console.error(error);
  process.exit(1);
});
