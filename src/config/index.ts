import dotenv from "dotenv";
dotenv.config();

export default {
  // firebase
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN!,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGE_SENDER_ID,
  appId: process.env.APPID,
  measurementId: process.env.MEASUREMENT_ID,
  jwtSecret: process.env.JWT_SECRET!,
};
