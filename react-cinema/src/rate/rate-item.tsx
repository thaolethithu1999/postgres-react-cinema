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

interface Props {
  data: any;
  maxLengthReviewText: number;
  resource: StringMap;
}
export const RateItem = ({ data, maxLengthReviewText, resource }: Props) => {
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
          <img alt='' className='useful-button' width={20} src={like}/>
          {data.usefulCount ? data.usefulCount : 0}</p>
      </section>
    </li>
  );
};

interface PropsRate {
  data: Rate;
  maxLengthReviewText: number;
  resource: StringMap;
}

export const RateItemFilm = ({ data, maxLengthReviewText, resource }: PropsRate) => {

  console.log(data);
  

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

  const postUseful = async (e: OnClick, comment: Rate) => {
    // let rs;
    // const useful: UsefulFilm = {
    //   id: comment.id || '',
    //   author: storage.getUserId() || ''
    // };
    // if (FilmRateService) {
    //   rs = await FilmRateService.usefulFilm(useful);
    // }
    // if (rs === 2) {// 2:Delete 1:Insert
    //   setRate({ ...comment, isUseful: false, usefulCount: (comment.usefulCount ? comment.usefulCount : 0) - 1 });
    // } else { setRate({ ...comment, isUseful: true, usefulCount: (comment.usefulCount ? comment.usefulCount : 0) + 1 }); }
  };

  const checkUseful = async (rate: Rate): Promise<void> => {
    // try {
    //   const useful: UsefulFilm = {
    //     id: rate.id || '',
    //     author: storage.getUserId() || ''
    //   };

    //   const result = await FilmRateService.usefulSearch(useful);
    //   if (result === 1) {
    //     rate.isUseful = true;
    //   }
    //   setRate(rate);

    // } catch (err) {

    // }
  };
  if (data) {
    return (
      <li className='col s12 m12 l12 review-custom'>
        <section className='card'>
          <p>{moment(data.time).format('DD/MM/YYYY')}</p>
          {renderReviewStar(data.rate)}
          {formatReviewText(data.review ?? '')}
          <p>
            {data === true ? <img alt='' className='useful-button' width={20} src={likeFilled} onClick={(e) => postUseful(e, data)} /> : <img alt='' className='useful-button' width={20} src={like} onClick={(e) => postUseful(e, data)} />}
            {data.usefulCount ? data.usefulCount : 0} </p>
        </section>
      </li>
    );
  }
  return (
    <span >

    </span>
  )
};
