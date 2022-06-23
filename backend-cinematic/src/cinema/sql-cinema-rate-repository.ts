import { DB, Repository } from 'query-core';
import { CinemaRate, cinemaRateModel, CinemaRateRepository } from './cinema';

export class SqlCinemaRateRepository extends Repository<CinemaRate, string> implements CinemaRateRepository {
    constructor(db: DB) {
        super(db, 'cinemarate', cinemaRateModel);
    }
}
