import Redis from "ioredis";
import dotenv from 'dotenv';
import { promisify } from "util";

dotenv.config();

const client = new Redis({
  port: 6379,
  host: process.env.DB_HOST_REDIS,
});

client.select(0);

const get = promisify(client.get).bind(client);

export { get, client };