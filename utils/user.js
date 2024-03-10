import redisClient from './redis';
import dbClient from './db';

/**
 * user utilities
 */
const userUtils = {

//get user from db
  async getUser(query) {
    const user = await dbClient.usersCollection.findOne(query);
    return user;
  },

//get user by id

  async getUserIdAndKey(request) {
    const info = { userId: null, key: null };

    const xToken = request.header('X-Token');

    if (!xToken) return info;

    info.key = `auth_${xToken}`;

    info.userId = await redisClient.get(info.key);

    return info;
  },

}

export default userUtils;
