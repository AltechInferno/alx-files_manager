import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';
import userUtils from '../utils/user';

const userQueue = new Queue('userQueue');

class UsersController {

//retrieve user base on token used
  static async getMe(request, response) {
    const { userId } = await userUtils.getUserIdAndKey(request);

    const user = await userUtils.getUser({
      _id: ObjectId(userId),
    });

    if (!user) return response.status(401).send({ error: 'Unauthorized' });

    const processedUser = { id: user._id, ...user };
    delete processedUser._id;
    delete processedUser.password;

    return response.status(200).send(processedUser);
  }
}

//create a user

  static async postNew(request, response) {
    const info = request.body;

    if (!info.email) return response.status(400).send({ error: 'Missing email' });

    if (!info.password) { return response.status(400).send({ error: 'Missing password' }); }

    const emailExists = await dbClient.usersCollection.findOne({ info.email });

    if (emailExists) { return response.status(400).send({ error: 'Already exist' }); }

    const sha1Password = sha1(info.password);

    let result;
    try {
      result = await dbClient.usersCollection.insertOne({
        info.email,
        password: sha1Password,
      });
    } catch (err) {
      await userQueue.add({});
      return response.status(500).send({ error: 'Error creating user.' });
    }

    const user = {
      id: result.insertedId,
      email,
    };

    await userQueue.add({
      userId: result.insertedId.toString(),
    });

    return response.status(201).send(user);
  }
}

export default UsersController;
