import { useEffect, useId, useState } from 'react';
import { useRate } from '../service';

import { Rate } from '../service/rate';
import { RateFilter } from '../../rate/service/rate/rate';
import { storage } from 'uione';
import { useParams } from 'react-router-dom';
import { RateItem } from '../rate-item';
import { OnClick } from 'react-hook-core';
import debounce from "lodash/debounce";
import { RateComment } from '../service/rate';

export interface RateListInterface {
  pageSize: number;
  setPageSize: any;
  load: any;
  rates: Rate[] | undefined;
  setRates: any;
  replies: RateComment[] | undefined;
  setReplies: any;
}

const RateList = (props: RateListInterface) => {
  const params = useParams();
  const [maxLengthReviewText] = useState(100);
  const [resource] = useState(storage.resource().resource());
  const rateService = useRate();
  const author: string | undefined = storage.getUserId();
  const { pageSize, setPageSize, load, rates, setRates, replies, setReplies } = props;
  const [isUseful, setIsUseful] = useState();

  
  useEffect(() => {
    load();
  }, [setRates]);

  const moreReview = async (e: any) => {
    e.preventDefault();
    const cinemaRateSM = new RateFilter();
    const userId: string | undefined = storage.getUserId();
    const { id } = params;
    cinemaRateSM.id = id;
    cinemaRateSM.limit = pageSize + 3;
    cinemaRateSM.sort = '-time';
    cinemaRateSM.userId = userId;
    const searchRates = await rateService.search(cinemaRateSM, pageSize + 3);
    setRates(searchRates.list);
    setPageSize(pageSize + 3);
  };

  const usefulReaction = async (e: OnClick, rate: Rate) => {
    console.log(rate);
    const id = rate.id || '';
    const author = rate.author || '';
    const userId: string | undefined = storage.getUserId();
    if (!userId) {
      return;
    }
    const rs = await rateService.setUseful(id, author, userId);
    load();
  }

  const removeUseful = async (e: OnClick, rate: Rate) => {
    const id = rate.id || '';
    const author = rate.author || '';
    const userId: string | undefined = storage.getUserId();
    if (!userId) {
      return;
    }
    await rateService.removeUseful(id, author, userId);
    load();
  }

  return (
    <>
      <ul className='row list-view'>
        {
          (
            rates && rates.length > 0 &&
            (rates.map((value: Rate) => {
              return <RateItem
                data={value}
                key={value.author}
                maxLengthReviewText={maxLengthReviewText}
                resource={resource}
                usefulReaction={usefulReaction}
                removeUsefulReaction={removeUseful}
              />;
            }) || '')
          )
        }
      </ul>

      {rates && rates.length >= 3 && (<div className='col s12 m12 l12 more-reviews-div'>
        <span className='more-reviews' onClick={moreReview}>
          <b>MORE REVIEWS</b>
        </span>
      </div>)}

    </>
  )
}

export default RateList;