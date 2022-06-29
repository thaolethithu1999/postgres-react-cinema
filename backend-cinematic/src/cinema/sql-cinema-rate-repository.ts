import { DB, Repository } from 'query-core';
import { CinemaRate, CinemaRateFilter, cinemaRateModel, CinemaRateRepository } from './cinema';

export class SqlCinemaRateRepository extends Repository<CinemaRate, string> implements CinemaRateRepository {
    constructor(db: DB) {
        super(db, 'cinemarate', cinemaRateModel);
    }

    async search(obj: CinemaRateFilter): Promise<CinemaRate | null> {
        try {
            const query = `select * from cinemarate where id = $1 and userid = $2`;
            const rs = await this.query(query, [obj.id, obj.userid]);
            console.log(obj.id + " and " + obj.userid);
            console.log(JSON.stringify(rs));
            if (rs[0]) {
                const result: CinemaRate = rs[0] as CinemaRate;
                return result;
            }
            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async updateCinemaRate(obj: CinemaRate): Promise<boolean> {
        try {
            console.log(obj.userid);
            console.log(obj);
            
            const query = `update cinemarate set rate = $3, review = $4 where id = $1 and userid = $2`;
            const rs = await this.exec(query, [obj.id, obj.userid, obj.rate, obj.review]);
            console.log(obj.id + " and " + obj.userid);

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}
