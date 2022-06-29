import { Log } from 'express-ext';
import { Manager, Search } from 'onecore';
import { buildCountQuery, buildToInsert, buildToInsertBatch, DB, postgres, Repository, SearchBuilder, Service, Statement } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Rate, RateFilter, rateModel, RateRepository, RateService } from './rate';
import { RateController } from './rate-controller';
import { SqlRateRepository } from './sql-rate-repository';

export * from './rate-controller';
export * from './rate';
export { RateController };

export class RateManager extends Manager<Rate, string, RateFilter> implements RateService {
    constructor(search: Search<Rate, RateFilter>, public repository: RateRepository) {
        super(search, repository);
        this.searchRate = this.searchRate.bind(this);
        this.updateRate = this.updateRate.bind(this);
    }

    async searchRate(obj: Rate): Promise<Rate | null> {        
        const list = await this.repository.searchRate(obj);
        console.log(list);
        return list;
    }

    async updateRate(obj: Rate): Promise<boolean> {             
        const list = await this.repository.updateRate(obj);
        if(list === false){
            return false;
        }   
        return true;
    }
}

export function useRateService(db: DB, mapper?: TemplateMap): RateService {
    const query = useQuery('rates', mapper, rateModel, true);
    const builder = new SearchBuilder<Rate, RateFilter>(db.query, 'rates', rateModel, db.driver, query);
    const repository = new SqlRateRepository(db);
    return new RateManager(builder.search, repository);
}

export function useRateController(log: Log, db: DB, mapper?: TemplateMap): RateController {
    return new RateController(log, useRateService(db, mapper),);
}


