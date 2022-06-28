import { DB, Repository } from 'query-core';
import { CinemaRate, CinemaRateFilter, cinemaRateModel, CinemaRateRepository } from './cinema';

export class SqlCinemaRateRepository extends Repository<CinemaRate, string> implements CinemaRateRepository {
    constructor(db: DB) {
        super(db, 'cinemarate', cinemaRateModel);
    }
 
    async search(obj: CinemaRateFilter): Promise<number> {
        try {  
            const query = `select * from cinemarate where id=$1 and userid=$2`;
            const rs = await this.exec(query, [obj.id, obj.userId]);

            console.log(obj.id + " and " + obj.userId);
            console.log(JSON.stringify(rs));      
            const list = JSON.stringify(rs);    
            return rs;

        } catch (err) {
            console.log(err);
            return 0;
        }
    }
}
