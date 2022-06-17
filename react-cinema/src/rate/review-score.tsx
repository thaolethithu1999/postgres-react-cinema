import React from 'react';
import '../rate.css';

interface Props {
  rate: number;
}
export const calculatorPercentStar = (value: any) => Number(value * 100 / 5);
export const ReviewScore = ({ rate }: Props) => {
  return (
    <div className='col s4 m5 l6 summary' >
      <div className='score'><span>{Math.ceil(rate * 100) / 100}</span></div>
      <div className='average'>
        <div className='empty-stars' />
        <div className='full-stars'
          style={{ width: `${(calculatorPercentStar(rate) || 0)}%` }} />
      </div>
    </div>
  );
};
