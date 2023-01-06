import got from 'got';
import {ICliCommand} from './cli-command.interface.js';
import { ILogger } from '../common/logger/logger-interface.js';
import { TMockFilm } from '../models/mock-film-type.js';
import TSVFileWriter from '../common/file-writer/film-tsv-file-writer.js';
import FilmGenerator from '../common/film-generator/film-generator.js';
import LoggerService from '../common/logger/logger.js';

export default class GenerateCommand implements ICliCommand {
  public readonly name = '--generate';
  private initialData!: TMockFilm;
  private readonly logger: ILogger;

  constructor() {
    this.logger = new LoggerService();
  }

  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return this.logger.error(`Can't fetch data from ${url}.`);
    }

    const offerGeneratorString = new FilmGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(offerGeneratorString.generate());
    }

    this.logger.info(`File ${filepath} created!`);
  }
}
