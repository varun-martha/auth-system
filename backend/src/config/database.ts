import { mongoose } from "@/models/index.js";

let isConnected = false;

export async function connectToDatabase(connectionString: string): Promise<typeof mongoose> {
  if (isConnected) {
    return mongoose;
  }

  await mongoose.connect(connectionString, {
    autoIndex: true
  });

  isConnected = true;
  return mongoose;
}
