
import dotenv from 'dotenv';
dotenv.config()

import PostGraduatedBot from './structures/Bot.js';
import MongoDBClient from './database/mongodb.js';

const client = new PostGraduatedBot()
export const database = new MongoDBClient()

await client.prepare()
client.run()

database.close()

export default client
