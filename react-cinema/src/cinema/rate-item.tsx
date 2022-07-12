import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { StringMap } from 'uione';
import '../rate.css';
import { FilmRate, UsefulFilm } from '../film/service/film';
import { useFilmRate } from '../film/service';
import like from '../assets/images/like.svg';
import likeFilled from '../assets/images/like_filled.svg';
import { OnClick } from 'react-hook-core';
import { storage } from 'uione';
import { Rate } from './service/rate';
import { useRate } from './service/index';

interface Props {
  data: any;
  maxLengthReviewText: number;
  resource: StringMap;
  usefulReaction?: any;
  removeUsefulReaction?: any;
}
export const RateItem = ({ data, maxLengthReviewText, resource, usefulReaction, removeUsefulReaction }: Props) => {
  const rateService = useRate();
  const [exist, setExist] = useState<boolean>(false);
  const author: string | undefined = storage.getUserId();

  const renderReviewStar = (value: any) => {
    const starList = Array(5).fill(<i />).map((item, index) => {
      return (<i key={index}></i>)
    });
    const classes = Array.from(Array(value).keys()).map(i => `star-${i + 1}`).join(' ');
    return <div className={`rv-star2 ${classes}`}>{starList}</div>;
  };

  const formatReviewText = (text: string) => {
    if (text && text.length > maxLengthReviewText) {
      let textSub = text.substring(0, maxLengthReviewText);
      textSub = textSub + ' ...';
      const a = <span>{resource.review} {textSub} <span className='more-reviews'>More</span></span>;
      return a;
    } else {
      return <span>{resource.review} {text}</span>;
    }
  };

  return (
    <li className='col s12 m12 l12 review-custom'>
      <section className='card'>
        <p>{moment(data.rateTime).format('DD/MM/YYYY')}</p>
        {renderReviewStar(data.rate)}
        {formatReviewText(data.review ?? '')}
        <p>
          {data.disable === true ? <img alt='' className='useful-button' width={20} src={likeFilled} onClick={(e) => removeUsefulReaction(e, data)} /> : <img alt='' className='useful-button' width={20} src={like} onClick={(e) => usefulReaction(e, data)} />}
          {data.usefulCount ? data.usefulCount : 0}</p>
      </section>
    </li>
  );
};

interface PropsRate {
  data: FilmRate;
  maxLengthReviewText: number;
  resource: StringMap;
}

export const RateItemFilm = ({ data, maxLengthReviewText, resource }: PropsRate) => {
  const [rate, setRate] = useState<FilmRate>();
  const FilmRateService = useFilmRate();

  useEffect(() => {
    checkUseful(data);
  }, []);

  const renderReviewStar = (value: any) => {
    const starList = Array(10).fill(<i />).map((item, index) => {
      return (<i key={index}></i>)
    });;
    const classes = Array.from(Array(value).keys()).map(i => `star-${i + 1}`).join(' ');
    return <div className={`rv-star2 ${classes}`}>{starList}</div>;
  };

  const formatReviewText = (text: string) => {
    if (text && text.length > maxLengthReviewText) {
      let textSub = text.substring(0, maxLengthReviewText);
      textSub = textSub + ' ...';
      const a = <span>{resource.review} {textSub} <span className='more-reviews'>More</span></span>;
      return a;
    } else {
      return <span>{resource.review} {text}</span>;
    }
  };

  const postUseful = async (e: OnClick, comment: FilmRate) => {
    let rs;
    const useful: UsefulFilm = {
      id: comment.id || '',
      author: storage.getUserId() || ''
    };
    if (FilmRateService) {
      rs = await FilmRateService.usefulFilm(useful);
    }
    if (rs === 2) {// 2:Delete 1:Insert
      setRate({ ...comment, isUseful: false, usefulCount: (comment.usefulCount ? comment.usefulCount : 0) - 1 });
    } else { setRate({ ...comment, isUseful: true, usefulCount: (comment.usefulCount ? comment.usefulCount : 0) + 1 }); }
  };

  const checkUseful = async (rate: FilmRate): Promise<void> => {
    try {
      const useful: UsefulFilm = {
        id: rate.id || '',
        author: storage.getUserId() || ''
      };

      const result = await FilmRateService.usefulSearch(useful);
      if (result == 1) {
        rate.isUseful = true;
      }
      setRate(rate);

    } catch (err) {

    }
  };
  console.log(rate);

  if (rate) {
    return (
      <li className='col s12 m12 l12 review-custom'>
        <section className='card'>
          <p>{moment(rate.rateTime).format('DD/MM/YYYY')}</p>
          {renderReviewStar(rate.rate)}
          {formatReviewText(rate.review ?? '')}
          <p>
            {rate.isUseful ? <img alt='' className='useful-button' width={20} src={likeFilled} onClick={(e) => postUseful(e, rate)} /> : <img alt='' className='useful-button' width={20} src={like} onClick={(e) => postUseful(e, rate)} />}
            {rate.usefulCount ? rate.usefulCount : 0} </p>
        </section>
      </li>
    );
  }
  return (
    <span >

    </span>
  )
};
