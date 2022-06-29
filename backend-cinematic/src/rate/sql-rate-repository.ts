import { DB, Repository } from 'query-core';
import { Rate, rateModel, RateFilter, RateService, RateRepository } from './rate'

export class SqlRateRepository extends Repository<Rate, string> implements RateRepository {
    constructor(db: DB) {
        super(db, 'rates', rateModel);
    }

    async searchRate(obj: Rate): Promise<Rate | null> {
        try {
            console.log("obj");   
            console.log(obj);

            const query = `select * from rates where id = $1 and userid = $2`;
            const rs = await this.query(query, [obj.id, obj.userid]);
            console.log(obj.id + " and " + obj.userid);
            console.log(JSON.stringify(rs));
            if (rs[0]) {
                const result: Rate = rs[0] as Rate;
                return result;
            }
            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async updateRate(obj: Rate): Promise<boolean> {
        try {
            console.log("obj update");
            console.log(obj);
            
            const query = `update rates set rate = $3, review = $4 where id = $1 and userid = $2`;
            const rs = await this.exec(query, [obj.id, obj.userid, obj.rate, obj.review]);
            console.log(obj.id + " and " + obj.userid);

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}