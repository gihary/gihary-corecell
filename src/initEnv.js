import fs from 'fs';
import dotenv from 'dotenv';

const envFile = fs.existsSync('.env.local') ? '.env.local' : '.env';
dotenv.config({ path: envFile });
