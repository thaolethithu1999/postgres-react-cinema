import { attr, Log } from 'express-ext';
import { Manager, Search } from 'onecore';
import { buildCountQuery, buildToInsert, buildToInsertBatch, DB, postgres, Repository, SearchBuilder, Service, Statement, update } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { buildToSave } from 'pg-extension';
import { Appreciation, AppreciationFilter, AppreciationId, AppreciationRepository, AppreciationService, appreciationModel, ReplyRepository, Reply, replyModel, ReplyFilter } from './appreciation';
import { AppreciationController } from './appreciation-controller';
import { SqlAppreciationRepository } from './sql-appreciation-repository';
import { SqlReplyRepository } from './sql-reply-repository';

export * from './appreciation-controller';
export * from './appreciation';
export { AppreciationController };

export class AppreciationManager extends Manager<Appreciation, AppreciationId, AppreciationFilter> implements AppreciationService {
    constructor(search: Search<Appreciation, AppreciationFilter>,
        public repository: AppreciationRepository, private replyRepository: ReplyRepository) {
        super(search, repository);
        this.reply = this.reply.bind(this);
        this.removeReply = this.removeReply.bind(this);
        this.updateReply = this.updateReply.bind(this);
    }

    async reply(reply: Reply): Promise<boolean> {
        const checkReply = await this.replyRepository.getReply(reply.id, reply.author, reply.userId);
        const checkAppreciation = await this.repository.getAppreciation(reply.id, reply.author);

        if (!checkAppreciation) { // cmt not exist in db -> cant rep
            return false;
        } else {
            if (checkReply) {
                return false;
            } else {
                reply.createAt ? reply.createAt = reply.createAt : reply.createAt = new Date();
                reply.updateAt ? reply.updateAt = reply.updateAt : reply.updateAt = new Date();
                reply.usefulCount ? reply.usefulCount = reply.usefulCount : reply.usefulCount = 0;
                reply.replyCount ? reply.replyCount = reply.replyCount : reply.replyCount = 0;
                //insert
                const wait = await this.replyRepository.insert(reply);
                //increase reply count
                await this.repository.increaseReplyCount(reply.id, reply.author);
                return true;
            }
        }
    }

    removeReply(id: string, author: string, userId: string, ctx?: any): Promise<number> {
        return this.replyRepository.getReply(id, author, userId).then(exist => {
            if (exist) {
                return this.replyRepository.removeReply(id, author, userId).then(res => {
                    if (res > 0) {
                        return this.repository.decreaseReplyCount(id, author);
                    } else {
                        return 0;
                    }
                })
            } else {
                return 0;
            }
        })
    }

    async updateReply(reply: Reply): Promise<number> {
        const exist = await this.replyRepository.getReply(reply.id, reply.author, reply.userId);
        if (!exist) {
            return 0
        } else {
            return await this.replyRepository.update(reply);
        }
    }
}

export function useAppreciationService(db: DB, mapper?: TemplateMap): AppreciationService {
    const query = useQuery('appreciation', mapper, appreciationModel, true);
    const builder = new SearchBuilder<Appreciation, AppreciationFilter>(db.query, 'appreciation', appreciationModel, db.driver, query);
    const repository = new SqlAppreciationRepository(db, 'appreciation', buildToSave);

    // const repQuery = useQuery('appreciationreply', mapper, replyModel, true);
    // const repBuilder = new SearchBuilder<Reply, ReplyFilter>(db.query, 'appreciationreply', replyModel, db.driver, repQuery);
    const replyRepository = new SqlReplyRepository(db, 'appreciationreply', buildToSave);

    return new AppreciationManager(builder.search, repository, replyRepository);
}

export function useAppreciationController(log: Log, db: DB, mapper?: TemplateMap): AppreciationController {
    return new AppreciationController(log, useAppreciationService(db, mapper));
}


