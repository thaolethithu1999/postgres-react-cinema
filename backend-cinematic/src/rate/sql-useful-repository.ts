import { DB, Repository } from 'query-core';
import { UsefulRate, UsefulRateId, usefulRateModel, UsefulRateRepository } from './rate';
import { Attributes, Statement } from "pg-extension";

export class SqlUsefulRateRepository extends Repository<UsefulRate, UsefulRateId> implements UsefulRateRepository{
    constructor(db: DB, table: string, protected buildToSave:  <T>(obj: T, table: string, attrs: Attributes, ver?: string, buildParam?: (i: number) => string, i?: number) => Statement|undefined ) {
        super(db, table, usefulRateModel);
        this.save = this.save.bind(this);
    }   
    save(obj: UsefulRate, ctx?: any): Promise<number> {
        const stmt = this.buildToSave(obj, this.table, this.attributes);
        if (stmt) {
            console.log(stmt.query);
            return this.exec(stmt.query, stmt.params, ctx);
        } else {
            return Promise.resolve(0);
        }
    }
}