import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as mongoose from 'mongoose';

export interface MongoOptions {
    uri: string;
    promises: 'bluebird' | 'native' | 'es6';
    connectionOptions: mongoose.ConnectionOptions;
}

const DEFAULT = {
    uri: 'mongodb://127.0.0.1:27017',
    promises: 'native'
};

export class MongoosePlugin {
    name = 'mongoose';
    version = '1.0.0';

    async register(server: Hapi.Server, options: MongoOptions) {
        const setting: MongoOptions = { ...DEFAULT, ...options }

        if (setting.promises === 'bluebird') {
            (<any>mongoose).Promise = require('bluebird');
        } else if (setting.promises === 'native' || setting.promises === 'es6') {
            (<any>mongoose).Promise = global.Promise;
        }
        try {
            
            mongoose.connect(setting.uri, setting.connectionOptions)
            mongoose.connection
            .on('connected', () => {
                server.log(['info', 'database', 'mongoose', 'mongodb'], 'Connected');
            })
            .on('close', () => {
                server.log(['info', 'database', 'mongoose', 'mongodb'], 'Connection to database closed');
            })
            .on('disconnected', () => {
                server.log(['warn', 'database', 'mongoose', 'mongodb'], 'Connection to database disconnected');
            });
        } catch (err) {
            server.log(['error', 'database', 'mongoose', 'mongodb'], `Unable to connect to database: ${err.message}`);
            process.exit(1);
        }

        

        process.on('SIGINT', async () => {
            mongoose.connection.close()
            process.exit(0);
        })
    }
}

export default new MongoosePlugin();