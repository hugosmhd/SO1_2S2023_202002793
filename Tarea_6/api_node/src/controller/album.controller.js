import { get, client } from "../db/redis.db.js";

const getAllAlbums = async () => {
  try {
    let albumes = await client.lrange("albums", 0, -1);
    albumes = albumes.reverse();
    albumes = albumes.map((item) => JSON.parse(item));
    if (albumes === null) return [];

    return albumes;
  } catch (error) {
    console.log(error);
    return [];
  }
};

  export { getAllAlbums };