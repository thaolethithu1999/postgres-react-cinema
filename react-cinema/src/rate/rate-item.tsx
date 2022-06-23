import moment from 'moment';
import React from 'react';
import { StringMap } from 'uione';
import '../rate.css';

interface Props {
  maxLengthReviewText: number;
  rateTime: Date|undefined;
  rate: number;
  review: string;
  resource: StringMap;
}
export const RateItem = ({ maxLengthReviewText, rateTime, rate, review, resource }: Props) => {
  const renderReviewStar = (value: any) => {
    const starList = Array(5).fill(<i />);
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
        <p>{moment(rateTime).format('DD/MM/YYYY')}</p>
        {renderReviewStar(rate)}
        {formatReviewText(review ?? '')}
      </section>
    </li>
  );
};

export const RateItemFilm = ({ maxLengthReviewText, rateTime, rate, review, resource }: Props) => {
  const renderReviewStar = (value: any) => {
    const starList = Array(10).fill(<i />);
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
        <p>{moment(rateTime).format('DD/MM/YYYY')}</p>
        {renderReviewStar(rate)}
        {formatReviewText(review ?? '')}
      </section>
    </li>
  );
};
