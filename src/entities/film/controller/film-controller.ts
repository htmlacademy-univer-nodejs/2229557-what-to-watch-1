import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {StatusCodes} from 'http-status-codes';
import {Controller} from '../../../common/controller/controller.js';
import {ILogger} from '../../../common/logger/logger-interface.js';
import {IFilmService} from '../service/film-service-interface.js';
import {Component} from '../../../models/component.js';
import {HttpMethod} from '../../../models/http-method.js';
import {fillDTO} from '../../../utils/common.js';
import FilmResponse from './responses/film-response.js';
import FilmSearchResponse from './responses/film-search-response.js';
import UpdateFilmDto from '../dto/film-update-dto.js';
import HttpError from '../../../common/errors/http-error.js';
import CreateFilmDto from '../dto/film-create-dto.js';
import {ICommentService} from '../../comment/comments-service-interface.js';
import {ValidateDtoMiddleware} from '../../../common/middleware/validate-dto-middleware/validate-dto-middleware.js';
import {DocumentExistsMiddleware} from '../../../common/middleware/document-exists-middleware/document-exists-middleware.js';
import {ValidateObjectIdMiddleware} from '../../../common/middleware/validate-object-id-middleware/validate-object-id-middleware.js';
import CommentResponse from '../../comment/controller/response/comment-response.js';

const MAX_FILMS_COUNT = 60;

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IFilmService) private readonly filmsService: IFilmService,
    @inject(Component.ICommentService) private readonly commentService: ICommentService
  ) {
    super(logger);

    this.logger.info('Register routes for CategoryControllerâ€¦');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index
    });
    this.addRoute({
      path: '/create',
      method: HttpMethod.Post,
      handler: this.createFilm,
      middlewares: [new ValidateDtoMiddleware(CreateFilmDto)]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.get,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(UpdateFilmDto)
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(UpdateFilmDto),
        new DocumentExistsMiddleware(this.filmsService, 'Film', 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.filmsService, 'Film', 'id')
      ]
    });
    this.addRoute({
      path: '/search',
      method: HttpMethod.Get,
      handler: this.search,
    });
    this.addRoute({
      path: '/promo',
      method: HttpMethod.Get,
      handler: this.getPromo,
    });
    this.addRoute({
      path: '/:filmId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('filmId'),
        new DocumentExistsMiddleware(this.filmsService, 'Film', 'filmId')
      ]
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const films = await this.filmsService.find();
    const filmsResponse = fillDTO(FilmResponse, films);
    this.ok(res, filmsResponse);
  }

  public async createFilm(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response): Promise<void> {

    const existFilm = await this.filmsService.findByName(body.title);

    if (existFilm) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Film Â«${body.title}Â» exists.`,
        'FilmController'
      );
    }
    const result = await this.filmsService.create(body);
    this.created(res, fillDTO(FilmResponse, result));
  }

  public async update(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, UpdateFilmDto>,
    res: Response): Promise<void> {

    const existFilm = await this.filmsService.findById(body.id);

    if (!existFilm) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id Â«${body.id}Â» not exists.`,
        'FilmController'
      );
    }

    const result = await this.filmsService.update(body);
    this.ok(res, fillDTO(FilmResponse, result));
  }

  public async get(
    {params}: Request<Record<string, string>>,
    res: Response): Promise<void> {

    const existFilm = await this.filmsService.findById(params.id);

    if (!existFilm) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id Â«${params.id}Â» not exists.`,
        'FilmController'
      );
    }

    this.ok(res, fillDTO(FilmResponse, existFilm));
  }

  public async delete(
    {params}: Request<Record<string, string>>,
    res: Response): Promise<void> {

    const existFilm = await this.filmsService.findById(params.id);

    if (!existFilm) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id Â«${params.id}Â» not exists.`,
        'FilmController'
      );
    }

    await this.filmsService.deleteById(params.id);
    this.ok(res, true);
  }

  public async search(
    {params}: Request<Record<string, string>>,
    res: Response): Promise<void> {
    let limit = params.limit;
    if (!limit) {
      limit = MAX_FILMS_COUNT.toString();
    }
    const numberLimit = Number(limit);
    const searchResult = await this.filmsService.findByGenre(params.genre, numberLimit);

    this.send(
      res,
      StatusCodes.OK,
      fillDTO(FilmSearchResponse, searchResult)
    );
  }

  public async getPromo(
    _: Request,
    res: Response): Promise<void> {
    const promoFilm = await this.filmsService.findPromo();
    this.ok(res, fillDTO(FilmResponse, promoFilm)
    );
  }

  async getComments(
    {params}: Request<Record<string, string>>,
    res: Response): Promise<void> {
    const comments = await this.commentService.findByFilmId(params.filmId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
