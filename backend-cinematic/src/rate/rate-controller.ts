import { Controller, handleError, Log, getStatusCode } from "express-ext";
import { Rate, RateFilter, rateModel, RateRepository, RateService } from './rate';
import { Request, Response } from 'express';
import { Search, Validator } from 'onecore';
import { createValidator } from 'xvalidators';

export class RateController extends Controller<Rate, string, RateFilter>{
    validator: Validator<Rate>;
    constructor(log: Log, public rateService: RateService) {
        super(log, rateService);
        this.all = this.all.bind(this);
        this.load = this.load.bind(this);
        this.validator = createValidator<Rate>(rateModel);
    }

    all(req: Request, res: Response) {
        if (this.rateService.all) {
            this.rateService.all()
                .then(rates => res.status(200).json(rates))
                .catch(err => handleError(err, res, this.log));
        }
    }

    load(req: Request, res: Response) {
        const rate: Rate = req.body;
        console.log(JSON.stringify(rate));
        this.validator.validate(rate).then(errors => {
            if (errors && errors.length > 0) {
                res.status(getStatusCode(errors)).json(errors).end();
            } else {
                this.rateService.searchRate(rate).then(rs => {
                    res.json(rs).end();
                }).catch(err => handleError(err, res, this.log));
            }
        }).catch(err => handleError(err, res, this.log))
    }

    update(req: Request, res: Response) {
        const rate: Rate = req.body;
        console.log(JSON.stringify(rate));
        this.validator.validate(rate).then(errors => {
            if (errors && errors.length > 0) {
                res.status(getStatusCode(errors)).json(errors).end();
            } else {
                this.rateService.updateRate(rate).then(rs => {
                    res.json(rs).end();
                }).catch(err => handleError(err, res, this.log));
            }
        }).catch(err => handleError(err, res, this.log))
    }

}