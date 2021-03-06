import { Attributes, Statement } from "pg-extension";
import { DB, Repository } from "query-core";
import { Info, infoModel, InfoRepository, AppreciationRepository, Appreciation } from "./rate";   

export class SqlAppreciationRepository extends Repository<Info, string> implements AppreciationRepository{
    constructor(db: DB, table: string, protected buildToSave: <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement|undefined){
        super(db, table, infoModel);
        this.save = this.save.bind(this);
    }
    async save(obj: Appreciation, ctx?: any): Promise<number> {
        const stmt = await this.buildToSave(obj, this.table, this.attributes);
        if (stmt) {
            console.log(stmt.query);
            return this.exec(stmt.query, stmt.params, ctx);
        } else {
            return Promise.resolve(0);
        }
    }
}