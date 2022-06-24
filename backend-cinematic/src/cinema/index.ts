import { Log, Manager, Search, Mapper } from 'onecore';
import { buildCountQuery, buildToInsert, buildToInsertBatch, DB, postgres, Repository, SearchBuilder, Statement } from 'query-core';
import { Cinema, CinemaFilter, cinemaModel, CinemaRepository, CinemaService, CinemaRate, CinemaInfoRepository, CinemaRateRepository, CinemaInfo, CinemaRateService, cinemaRateModel, CinemaRateFilter } from './cinema';
import { CinemaController } from './cinema-controller';
import { TemplateMap, useQuery } from 'query-mappers';
export * from './cinema-controller';
export { CinemaController };
import { SqlCinemaRepository } from './sql-cinema-repository';
import { query } from "pg-extension";
import { SqlCinemaInfoRepository } from './sql-cinema-info-repository';
import { SqlCinemaRateRepository } from './sql-cinema-rate-repository';
import { CinemaRateController } from './cinema-rate-controller';
import { v4 as uuidv4 } from 'uuid';

export class CinemaManager extends Manager<Cinema, string, CinemaFilter> implements CinemaService {
  constructor(search: Search<Cinema, CinemaFilter>,
    repository: CinemaRepository,
    private infoRepository: CinemaInfoRepository,
    private rateRepository: CinemaRateRepository) {
    super(search, repository);
  };

  load(id: string): Promise<Cinema | null> {
    return this.repository.load(id).then(cinema => {
      if (!cinema) {
        return null;
      } else {
        console.log('cinema: ' + cinema);      
        return this.infoRepository.load(id).then(info => {
          if (info) {
            delete (info as any)['id'];
            cinema.info = info;   
          }
          return cinema;
        })
      }
    });
  }

  //
  async rate(rate: CinemaRate): Promise<boolean> {
    let info = await this.infoRepository.load(rate.cinemaId);

    if (!info) {
      let dbInfo = {
        'id': rate.cinemaId,
        'rate': 0,
        'rate1': 0,
        'rate2': 0,
        'rate3': 0,
        'rate4': 0,
        'rate5': 0,
        'viewCount': 0,
      };
      await this.infoRepository.insert(dbInfo);
      info = await this.infoRepository.load(rate.cinemaId);
    }
    if (!info || typeof info[('rate' + rate.rate.toString()) as keyof CinemaInfo] === 'undefined') {
      return false;
    }
    if (rate.id) {
      const dbRate = await this.rateRepository.load(rate.id);
      console.log(dbRate);

      if (!dbRate) {
        return false;
      }
      (info as any)['rate' + dbRate.rate.toString()] -= 1;
      dbRate.rate = rate.rate;

      const res = await this.rateRepository.update(dbRate);
      if (res < 1) {
        return false;
      }
    } else {
      rate.id = uuidv4();
      const res = await this.rateRepository.insert(rate);
      if (res < 1) {
        return false;
      }

    }
    (info as any)['rate' + rate.rate.toString()] += 1;

    const sumRate = info.rate1 +
      info.rate2 * 2 +
      info.rate3 * 3 +
      info.rate4 * 4 +
      info.rate5 * 5;

    const count = info.rate1 +
      info.rate2 +
      info.rate3 +
      info.rate4 +
      info.rate5;

    info.rate = sumRate / count;
    info.viewCount = count;
    this.infoRepository.update(info);
    return true;
  }
}

export function useCinemaService(db: DB, mapper?: TemplateMap): CinemaService {
  const query = useQuery('cinema', mapper, cinemaModel, true)
  const builder = new SearchBuilder<Cinema, CinemaFilter>(db.query, 'cinema', cinemaModel, db.driver, query);
  const repository = new SqlCinemaRepository(db);
  const infoRepository = new SqlCinemaInfoRepository(db);
  const rateRepository = new SqlCinemaRateRepository(db);
  return new CinemaManager(builder.search, repository, infoRepository, rateRepository);
}
export function useCinemaController(log: Log, db: DB, mapper?: TemplateMap): CinemaController {
  return new CinemaController(log, useCinemaService(db, mapper));
}

export class CinemaRateManager extends Manager<CinemaRate, string, CinemaRateFilter> implements CinemaRateService {
  constructor(search: Search<CinemaRate, CinemaRateFilter>, repository: CinemaRateRepository) {
    super(search, repository);
  }
}

export function useCinemaRateService(db: DB, mapper?: TemplateMap): CinemaRateService {
  const query = useQuery('cinemarate', mapper, cinemaRateModel, true);
  const builder = new SearchBuilder<CinemaRate, CinemaRateFilter>(db.query, 'cinemarate', cinemaRateModel, db.driver, query);
  const repository = new SqlCinemaRateRepository(db);

  return new CinemaRateManager(builder.search, repository);
}

export function useCinemaRateController(log: Log, db: DB, mapper?: TemplateMap): CinemaRateController {
  return new CinemaRateController(log, useCinemaRateService(db, mapper));
}