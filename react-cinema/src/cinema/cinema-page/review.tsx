import { useEffect, useId, useState } from 'react';
import ReactModal from 'react-modal';
import { useParams } from 'react-router-dom';
import { storage } from 'uione';
import { DetailStart } from '../../rate/detail-star';
import { DataPostRate, PostRateForm } from '../../rate/post-rate-form';
import { RateItem } from '../../rate/rate-item';
import { RatingStar } from '../../rate/rateting-star';
import { ReviewScore } from '../../rate/review-score';
import { getCinemaRates, Cinema, CinemaRate, useCinema } from '../service';
import { CinemaRateFilter } from '../service/cinema-rate/cinema-rate';

import { useRate } from '../../rate/service';
import { Rate } from '../../rate/service/rate';
import { RateFilter } from '../../rate/service/rate/rate';
import './rate.css';

ReactModal.setAppElement('#root');

export const CinemaReview = () => {
  const params = useParams();
  const [cinema, setCinema] = useState<Cinema>();
  const [rates, setRates] = useState<Rate[]>([]);
  const [resource] = useState(storage.resource().resource());
  const [maxLengthReviewText] = useState(100);
  const [isOpenRateModal, setIsOpenRateModal] = useState(false);
  const [voteStar, setVoteStar] = useState<number>();
  const [pageSize, setPageSize] = useState(3);
  const cinemaService = useCinema();
  const cinemaRateService = getCinemaRates();
  const rateService = useRate();


  useEffect(() => {
    load();
  }, [])

  const load = async () => {
    const cinemaRateSM = new RateFilter();
    console.log(cinemaRateSM);
    const userId: string | undefined = storage.getUserId();
    console.log(userId);
    
    const { id } = params;

    cinemaRateSM.id = id || '';
    cinemaRateSM.userId = userId || '';
    cinemaRateSM.limit = pageSize;
    cinemaRateSM.sort = '-rateTime';

    const currentCinema = await cinemaService.load(id || '');
    console.log(currentCinema);
    if (currentCinema) {
      setCinema(currentCinema);
    }

    //const searchResult = await rateService.search(cinemaRateSM, pageSize);
    const searchResult = await rateService.getRateByRateId(cinemaRateSM.id, cinemaRateSM.userId);
    console.log(searchResult);
    const list = searchResult;
    setRates(list);
  }

  console.log(cinema?.info);
  console.log(rates);

  const postReview = async (data: DataPostRate): Promise<void> => {
    try {
      const id: string | undefined = storage.getUserId();
      if (!id || !cinema) {
        return;
      }
      const rate: Rate = {};
      rate.id = cinema.id;
      rate.userId = id;
      rate.rate = data.rate;
      rate.review = data.review;

      console.log(rate);

      let handle = await rateService.getRateByRateId(rate.id, rate.userId);
      console.log(handle);
      if (handle) {
        storage.alert(`You reviewed ${cinema.name}`);
      } else {
        storage.message('Your review is submited');
        setIsOpenRateModal(false);
        await load();
      }
    } catch (err) {
      storage.alert('error');
      console.log(err);
    }
  }

  const moreReview = async (e: any) => {
    e.preventDefault();
    const cinemaRateSM = new CinemaRateFilter();
    const { id } = params;
    cinemaRateSM.id = id;
    cinemaRateSM.limit = pageSize + 3;
    cinemaRateSM.sort = '-rateTime';
    const searchRates = await rateService.search(cinemaRateSM, pageSize + 3);
    setRates(searchRates.list);
    setPageSize(pageSize + 3);
  };

  if (cinema && window.location.pathname.includes('review')) {
    return (
      <>
        <div className='row top-content row-rate'>
          {cinema?.info && <ReviewScore rate={cinema.info.rate} />}
          <div className='col s8 m7 l6'>
            {DetailStart(cinema?.info)}
          </div>
        </div>
        <div className='row mid-content row-rate'>
          <RatingStar
            ratingText={resource.rating_text}
            setIsOpenRateModal={setIsOpenRateModal}
            setVoteStar={(setVoteStar)} />
        </div>
        <ul className='row list-view'>
          {
            (
              rates && rates.length > 0 &&
              (rates.map((value: Rate, index: number) => {
                return <RateItem
                  review={value.review ?? ''}
                  maxLengthReviewText={maxLengthReviewText}
                  rateTime={value.rateTime}
                  rate={value.rate || 1}
                  resource={resource}></RateItem>;
              }) || '')
            )
          }
        </ul>
        <div className='col s12 m12 l12 more-reviews-div'>
          <span className='more-reviews' onClick={moreReview}>
            <b>MORE REVIEWS</b>
          </span>
        </div>
        <PostRateForm
          rate={voteStar ?? 1}
          name={cinema.name}
          close={() => setIsOpenRateModal(false)}
          postRate={postReview}
          isOpenRateModal={isOpenRateModal} />
      </>
    );
  }
  return <></>;
};
