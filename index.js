
const dotenv = require('dotenv');
dotenv.config()

const PostGraduatedBot = require('./structures/Bot')

const client = new PostGraduatedBot()

client.run()

