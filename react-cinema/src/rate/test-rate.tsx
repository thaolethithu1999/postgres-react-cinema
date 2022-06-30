import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { checked, OnClick, PageSizeSelect, SearchComponentState, useSearch, value } from 'react-hook-core';
import { useParams } from 'react-router-dom';
import { storage } from 'uione';
import { DetailStart } from '../rate/detail-star';
import { DataPostRate, PostRateForm } from '../rate/post-rate-form';
import { RateItem } from '../rate/rate-item';
import { RatingStar } from '../rate/rateting-star';
import { ReviewScore } from '../rate/review-score';
import { useRate } from './service/index';
import { Rate, RateFilter } from './service/rate';
//import { CinemaRateFilter } from './service/cinema-rate/cinema-rate';

ReactModal.setAppElement('#root');

export const Test = () => { 
  const [rates, setRates] = useState<Rate[]>([]);
  const rateService = useRate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const rateSM = new RateFilter();
    console.log(rateSM);

    
  }

  return (
    <>
      <p>test</p>
    </>
  );


};
