import Redis from "ioredis";
import { promisify } from "util";

const client = new Redis({
  port: 6379,
  host: "localhost",
});

client.select(1);

const get = promisify(client.get).bind(client);

export { get, client };