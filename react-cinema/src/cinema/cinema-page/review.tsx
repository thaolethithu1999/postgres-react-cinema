import { useEffect, useId, useState } from 'react';
import ReactModal from 'react-modal';
import { useParams } from 'react-router-dom';
import { storage } from 'uione';
import { DetailStart } from '../../rate/detail-star';
import { DataPostRate, PostRateForm } from '../../rate/post-rate-form';
import { RateItem } from '../../rate/rate-item';
import { RatingStar } from '../../rate/rateting-star';
import { ReviewScore } from '../../rate/review-score';
import { Cinema, CinemaRate, useCinema } from '../service';
import { CinemaRateFilter } from '../service/cinema-rate/cinema-rate';

import { useRate } from '../../rate/service';
import { Rate } from '../../rate/service/rate';
import { RateFilter } from '../../rate/service/rate/rate';
import './rate.css';

import RateList from './rateList';

ReactModal.setAppElement('#root');

export const CinemaReview = () => {
  const params = useParams();
  const [cinema, setCinema] = useState<Cinema>();
  const [resource] = useState(storage.resource().resource());
  const [maxLengthReviewText] = useState(100);
  const [isOpenRateModal, setIsOpenRateModal] = useState(false);
  const [voteStar, setVoteStar] = useState<number>();
  const [pageSize, setPageSize] = useState(3);
  const [rates, setRates] = useState<Rate[]>();
  const cinemaService = useCinema();
  const rateService = useRate();


  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const cinemaRateSM = new RateFilter();
    const userId: string | undefined = storage.getUserId();
    const { id } = params;
    cinemaRateSM.id = id || '';
    cinemaRateSM.limit = pageSize;
    cinemaRateSM.sort = '-rateTime';
    const currentCinema = await cinemaService.load(id || '');
    if (currentCinema) {
      setCinema(currentCinema);
    }
    const searchResult = await rateService.search(cinemaRateSM, pageSize);
    setRates(searchResult.list);
  };

  const postReview = async (data: DataPostRate): Promise<void> => {
    try {
      const id: string | undefined = storage.getUserId();
      if (!id || !cinema) {
        return storage.alert("You must sign in to review");
      }
      const rate: Rate = {};
      rate.id = cinema.id;
      rate.userId = id;
      rate.rate = data.rate;
      rate.review = data.review;
      rate.rateTime = new Date();

      let addRate = await rateService.rate(rate);
      storage.message('Your review is submited');
      setIsOpenRateModal(false);
      await load();
    } catch (err) {
      storage.alert('error');
    }
  }
  
  if (cinema && window.location.pathname.includes('review')) {
    return (
      <>
        <div className='row top-content row-rate'>
          {cinema?.info && <ReviewScore rate={cinema.info.rate} />}
          <div key={cinema.id} className='col s8 m7 l6'>
            {DetailStart(cinema?.info)}
          </div>
        </div>
        <div className='row mid-content row-rate'>
          <RatingStar
            ratingText={resource.rating_text}
            setIsOpenRateModal={setIsOpenRateModal}
            setVoteStar={(setVoteStar)} />
        </div>
        <RateList pageSize={pageSize} setPageSize={setPageSize}  load={load} rates={rates} setRates={setRates} />
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
