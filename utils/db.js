import { MongoClient } from 'mongodb';

/**
 * performing operations with Mongo service
 */

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
  constructor() {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (!err) {
        this.db = client.db(DB_DATABASE);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      } else {
        console.log(err.message);
        this.db = false;
      }
    });
  }

  /**
   * Checks connection to Redis is Alive
   * {boolean} true if connection alive or false if not
   */
  isAlive() {
    return Boolean(this.db);
  }

  /**
   * Returns number of documents in user collection
   * {number} amount of users
   */
  async nbUsers() {
    const numOfUsers = this.usersCollection.countDocuments();
    return numOfUsers;
  }

  /**
   * Returns num of docs in collection files
   * {number} amount of files
   */
  async nbFiles() {
    const numOfFiles = this.filesCollection.countDocuments();
    return numOfFiles;
  }
}

const dbClient = new DBClient();

export default dbClient;
