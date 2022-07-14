import { Controller, handleError, Log, getStatusCode } from "express-ext";
import { Rate, RateFilter, RateId, rateModel, RateRepository, RateService, Reply, ReplyFilter, ReplyId, replyModel, ReplyService, UsefulRate, UsefulRateId, usefulRateModel } from './rate';
import { Request, Response } from 'express';
import { Search, Validator } from 'onecore';
import { createValidator } from 'xvalidators';

export class RateController extends Controller<Rate, RateId, RateFilter>{

    validator: Validator<Rate>;
    usefulValidator: Validator<UsefulRate>;
    replyValidator: Validator<Reply>;

    constructor(log: Log, protected rateService: RateService) {
        super(log, rateService);
        this.load = this.load.bind(this);
        this.update = this.update.bind(this);
        this.rate = this.rate.bind(this);
        this.setUseful = this.setUseful.bind(this);
        this.removeUseful = this.removeUseful.bind(this);
        this.reply = this.reply.bind(this);
        this.removeReply = this.removeReply.bind(this);
        this.updateReply = this.updateReply.bind(this);
        this.updateRate = this.updateRate.bind(this);
        this.validator = createValidator<Rate>(rateModel);
        this.usefulValidator = createValidator<UsefulRate>(usefulRateModel);
        this.replyValidator = createValidator<Reply>(replyModel);
        //console.log(JSON.stringify(this.keys))
    }

    load(req: Request, res: Response) {
        const id = req.params.id;
        const author = req.params.author;
        const rateId: RateId = { id, author };
        this.rateService.load(rateId).then(rates => {
            if (rates) {
                return res.status(200).json(rates).end();
            } else {
                return res.status(200).json({}).end();
            }
        }).catch(err => handleError(err, res, this.log));
    }

    rate(req: Request, res: Response) {
        const rate: Rate = req.body;
        rate.rateTime = new Date();
        this.validator.validate(rate).then(errors => {
            if (errors && errors.length > 0) {
                res.status(getStatusCode(errors)).json(errors).end();
            } else {
                this.rateService.rate(rate).then(rs => {
                    return res.status(200).json(rs).end();
                }).catch(err => handleError(err, res, this.log));
            }
        }).catch(err => handleError(err, res, this.log));
    }

    setUseful(req: Request, res: Response) {
        const id = req.params.id;
        const author = req.params.author;
        const userId = req.params.userid;
        this.rateService.setUseful(id, author, userId).then(rs => {
            return res.status(200).json(rs).end();
        }).catch(err => handleError(err, res, this.log));
    }

    removeUseful(req: Request, res: Response) {
        const id = req.params.id;
        const author = req.params.author;
        const userId = req.params.userid;
        this.rateService.removeUseful(id, author, userId).then(rs => {
            return res.status(200).json(rs).end();
        }).catch(err => handleError(err, res, this.log));
    }

    reply(req: Request, res: Response) {
        const id = req.params.id;
        const author = req.params.author;
        const userId = req.params.userid;
        const reply: Reply = { id, author, userId, ...req.body };
        this.replyValidator.validate(reply).then(errors => {
            if (errors && errors.length > 0) {
                res.status(getStatusCode(errors)).json(errors).end();
            } else {
                this.rateService.reply(reply).then(reply => {
                    return res.status(200).json(reply).end();
                }).catch(err => handleError(err, res, this.log))
            }
        }).catch(err => handleError(err, res, this.log));
    }

    removeReply(req: Request, res: Response) {
        const id = req.params.id;
        const author = req.params.author;
        const userId = req.params.userid;
        this.rateService.removeReply(id, author, userId).then(reply => {
            return res.status(200).json(reply).end();
        }).catch(err => handleError(err, res, this.log))
    }

    updateReply(req: Request, res: Response) {
        const id = req.params.id;
        const author = req.params.author;
        const userId = req.params.userid;
        const reply: Reply = { id, author, userId, ...req.body };
        this.replyValidator.validate(reply).then(errors => {
            if (errors && errors.length > 0) {
                res.status(getStatusCode(errors)).json(errors).end();
            } else {
                this.rateService.updateReply(reply).then(reply => {
                    return res.status(200).json(reply).end();
                }).catch(err => handleError(err, res, this.log))
            }
        }).catch(err => handleError(err, res, this.log));     
    }

    updateRate(req: Request, res: Response) {
        const id = req.params.id;
        const author = req.params.author;
        const rate: Rate = { id, author, ...req.body };
        this.validator.validate(rate).then(errors => {
            if (errors && errors.length > 0) {
                res.status(getStatusCode(errors)).json(errors).end();
            } else {
                this.rateService.updateRate(rate).then(reply => {
                    return res.status(200).json(reply).end();
                }).catch(err => handleError(err, res, this.log))
            }
        }).catch(err => handleError(err, res, this.log));       
    }
}
