
import { MongoClient, ServerApiVersion} from "mongodb";

export default class MongoDB {

    constructor() {
        this.client = new MongoClient(process.env.MONGODB_URI, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        })
        this.db = process.env.MONGODB_NAME
    }

    get(collection, item) {
        return this.client.db(this.db).collection(collection).findOne(item)
    }

    getCollection(collection) {
        return this.client.db(this.db).collection(collection)
    }

    insert(collection, item) {
        this.client.db(this.db).collection(collection).insertOne(item)
    }

    delete(collection, item) {
        this.client.db(this.db).collection(collection).deleteOne(item)
    }

    update(collection, old, item) {
        this.client.db(this.db).collection(collection).updateOne(name, { $set: item })
    }

    close() {
        this.client.close()
    }

}

