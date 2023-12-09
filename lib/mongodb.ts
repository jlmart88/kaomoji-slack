import { config } from "@/config";
import mongoose from "mongoose";

const uri = config.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<typeof mongoose>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any)._mongoClientPromise) {
    client = mongoose.connect(uri, options);
    (global as any)._mongoClientPromise = client;
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = mongoose.connect(uri, options);
  clientPromise = client;
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
