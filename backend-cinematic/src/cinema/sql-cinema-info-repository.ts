import { DB, Repository } from "query-core";
import { CinemaInfo, cinemaInfoModel, CinemaInfoRepository } from "./cinema";

export class SqlCinemaInfoRepository extends Repository<CinemaInfo, string> implements CinemaInfoRepository{
    constructor(db: DB){
        super(db, 'cinemainfo', cinemaInfoModel);
    }
}