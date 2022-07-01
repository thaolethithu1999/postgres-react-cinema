import React from 'react';
import '../rate.css';
export interface Rate {
  viewCount: number;
  rateLocation: number;
  rate: number;
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
}

export interface RateFilm {
  viewCount: number;
  rate: number;
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
  rate6: number;
  rate7: number;
  rate8: number;
  rate9: number;
  rate10: number;
}

export const DetailStart = (rateInfo?: Rate) => {
  if (!rateInfo) {
    return;
  }
  const list = [];
  const totalRate = rateInfo.rate1
    + rateInfo.rate2
    + rateInfo.rate3
    + rateInfo.rate4
    + rateInfo.rate5;
  for (let i = 5; i > 0; i--) {
    const rate = `rate${i}`;
    const value = rateInfo[rate as keyof Rate];
    let percent = 0;
    if (totalRate !== 0) {
      percent = value * 100 / totalRate;
    }
    const numberStar = Array(i).fill(<i />).map((item, index )=>{
      return (<i key={index}></i>)
    });
    const startDiv = <div className='rv-star'>{numberStar}</div>;
    const endDiv = <div key={i} className='progress'>
      <span style={{ width: `${percent}%` }} />
    </div>;
    const rateDiv = <div className='detail'>{startDiv}{endDiv}</div>;
    list.push(rateDiv);
  }
  return list;
};

export const DetailStartFilm = (rateInfo?: RateFilm) => {
  if (!rateInfo) {
    return;
  }
  const list = [];
  const totalRate = rateInfo.rate1 +
    rateInfo.rate2 +
    rateInfo.rate3 +
    rateInfo.rate4 +
    rateInfo.rate5 +
    rateInfo.rate6 +
    rateInfo.rate7 +
    rateInfo.rate8 +
    rateInfo.rate9 +
    rateInfo.rate10;
  for (let i = 10; i > 0; i--) {
    const rate = `rate${i}`;
    const value = rateInfo[rate as keyof RateFilm];
    let percent = 0;
    if (totalRate !== 0) {
      percent = value * 100 / totalRate;
    }
    const numberStar = Array(i).fill(<i />).map((item, index )=>{
      return (<i key={index}></i>)
    });
    const startDiv = <div className='rv-star'>{numberStar}</div>;
    const endDiv = <div key={i} className='progress'>
      <span style={{ width: `${percent}%` }} />
    </div>;
    const rateDiv = <div className='detail'>{startDiv}{endDiv}</div>;
    list.push(rateDiv);
  }
  return list;
};
