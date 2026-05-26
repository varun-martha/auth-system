import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { env } from "@/config/env.js";
import { findActiveSessionByTokenHash } from "@/repositories/user-session.repository.js";
import { hashSessionToken } from "@/utils/session.util.js";

class SocketService {
  private io: Server | null = null;
  // Map of userId to a set of socketIds
  private userSockets: Map<string, Set<string>> = new Map();

  init(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: env.APP_ORIGIN,
        credentials: true,
      },
    });

    this.io.use(async (socket, next) => {
      try {
        const rawCookies = socket.handshake.headers.cookie;
        if (!rawCookies) {
          return next(new Error("Authentication error"));
        }

        const cookieName = env.SESSION_COOKIE_NAME + "=";
        const cookieArray = rawCookies.split("; ");
        const sessionCookie = cookieArray.find(c => c.startsWith(cookieName));

        if (!sessionCookie) {
          return next(new Error("Authentication error"));
        }

        const rawSessionToken = sessionCookie.substring(cookieName.length);
        const session = await findActiveSessionByTokenHash(
          hashSessionToken(rawSessionToken)
        );

        if (!session) {
          return next(new Error("Authentication error"));
        }

        (socket as any).userId = String(session.userId);
        next();
      } catch (err) {
        next(new Error("Authentication error"));
      }
    });

    this.io.on("connection", (socket: Socket) => {
      const userId = (socket as any).userId;
      if (!userId) {
        socket.disconnect();
        return;
      }

      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(socket.id);

      socket.on("disconnect", () => {
        const userSet = this.userSockets.get(userId);
        if (userSet) {
          userSet.delete(socket.id);
          if (userSet.size === 0) {
            this.userSockets.delete(userId);
          }
        }
      });
    });
  }

  emitToUser(userId: string, event: string, data?: any) {
    if (!this.io) return;
    const socketIds = this.userSockets.get(userId);
    if (socketIds) {
      for (const socketId of socketIds) {
        this.io.to(socketId).emit(event, data);
      }
    }
  }
}

export const socketService = new SocketService();
