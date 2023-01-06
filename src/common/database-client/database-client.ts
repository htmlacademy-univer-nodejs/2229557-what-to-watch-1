import mongoose from 'mongoose';
import {inject, injectable} from 'inversify';
import {IDatabase} from './databse-interface.js';
import {Component} from '../../models/component.js';
import {ILogger} from '../logger/logger-interface.js';

@injectable()
export default class DatabaseClient implements IDatabase {
  constructor(
    @inject(Component.ILogger) private logger: ILogger,
  ) {}

  public async connect(uri: string): Promise<void> {
    this.logger.info('Connecting to Database.');
    await mongoose.connect(uri);
    this.logger.info('Conected to Database.');
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('Database connection closed.');
  }
}
