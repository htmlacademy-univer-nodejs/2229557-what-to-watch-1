import mongoose from 'mongoose';
import {inject, injectable} from 'inversify';
import {COMPONENT} from '../../types/component.type.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import {DatabaseInterface} from './db-client.interface';

@injectable()
export default class DatabaseService implements DatabaseInterface {
  constructor(
        @inject(COMPONENT.LoggerInterface) private logger: LoggerInterface,
  ) {}

  public async connect(uri: string): Promise<void> {
    this.logger.info('Connecting to mongo database...');
    await mongoose.connect(uri);
    this.logger.info('Connecting to mongo database is successful');
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('Mongo database connection is closed.');
  }
}