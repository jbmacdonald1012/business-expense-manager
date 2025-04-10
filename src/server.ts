import dotenv from 'dotenv';
dotenv.config();

process.env.NODE_ENV === 'production' ? dotenv.config() : dotenv.config({ path: './local.env' });

import app from './app';
import { connectToDatabase } from './config/db';

const PORT = process.env.PORT || 3000;

(async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
