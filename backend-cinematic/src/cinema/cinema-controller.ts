import { Controller, Log, handleError, queryParam, getStatusCode } from 'express-ext';
import { Cinema, CinemaFilter, CinemaService, CinemaRate, cinemaRateModel } from './cinema';
import { Request, Response } from 'express';
import { Search, Validator } from 'onecore';
import { createValidator } from 'xvalidators';

const nodemailer = require("nodemailer");

export class CinemaController extends Controller<Cinema, string, CinemaFilter> {

  validator: Validator<CinemaRate>;
  constructor(log: Log, private cinemaService: CinemaService) {
    super(log, cinemaService);
    this.array = ["status"];
    this.all = this.all.bind(this);
    this.rate = this.rate.bind(this);
    this.validator = createValidator<CinemaRate>(cinemaRateModel);
  }
  all(req: Request, res: Response) {
    if (this.cinemaService.all) {
      this.cinemaService.all()
        .then(cinemas => res.status(200).json(cinemas))
        .catch(err => handleError(err, res, this.log));
    }
  }

  rate(req: Request, res: Response) {
    const rate: CinemaRate = req.body;
    rate.rateTime = new Date();
    this.validator.validate(rate).then(errors => {
      if(errors && errors.length > 0){
        res.status(getStatusCode(errors)).json(errors).end();
      } else {
        this.cinemaService.rate(rate).then(rs => {
          res.json(rs).end();
        }).catch(err => handleError(err, res, this.log));
      }
    }).catch(err => handleError(err, res, this.log))
  }

  async sendEmail(req: Request, res: Response): Promise<any> {
    try {
      let { toEmail, subject, html = "", text = "2" } = req.body;
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.USER_SMTP, // generated ethereal user
          pass: process.env.PASSWORD_SMTP, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"hai 👻" <testsmtp318@gmail.com>', // sender address
        to: toEmail, // list of receivers
        subject, // Subject line
        text: text, // plain text body
        html: html, // html body
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
      return res.status(500).json({ msg: error }).end();
    }

    return res.status(200).json({ msg: "worked" }).end();
  }
}
