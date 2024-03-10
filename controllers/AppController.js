import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {

  /**
   * return the number of users and files in DB:
   * { "users": 12, "files": 1231 }
   *  status code 200
   */
  static async getStats(request, response) {
    const stats = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    response.status(200).send(stats);
  }

  /**
   * return if Redis and DB is alive
   * by using the 2 utils created previously:
   * { "redis": true, "db": true } status code 200
   */
  static getStatus(request, response) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    response.status(200).send(status);
  }
}

