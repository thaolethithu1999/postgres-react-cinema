import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useParams } from 'react-router-dom';
import { storage } from 'uione';
import { DetailStart } from '../../rate/detail-star';
import { DataPostRate, PostRateForm } from '../../rate/post-rate-form';
import { RateItem } from '../../rate/rate-item';
import { RatingStar } from '../rateting-star';
import { ReviewScore } from '../../rate/review-score';
import { Cinema, useCinema } from '../service';

import { useRate, useRateComment } from '../service';
import { Rate } from '../service/rate';
import { RateComment, RateFilter } from '../service/rate/rate';
import './rate.css';

import RateList from './rateList';

ReactModal.setAppElement('#root');

export interface Props {
  cinema: Cinema;
  setCinema: any;
}

export const CinemaReview = ({ cinema, setCinema }: Props) => {
  const params = useParams();
  const [resource] = useState(storage.resource().resource());
  const [isOpenRateModal, setIsOpenRateModal] = useState(false);
  const [voteStar, setVoteStar] = useState<number>();
  const [pageSize, setPageSize] = useState(3);
  const [rates, setRates] = useState<Rate[]>([]);
  const [replies, setReplies] = useState<RateComment[]>();
  const cinemaService = useCinema();
  const rateService = useRate();
  const userId: string | undefined = storage.getUserId() || '';

  useEffect(() => {
    load();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getCurrentUserRate();
  }, [rates]);

  const load = async () => {
    const { id } = params;
    const cinemaRateSM = new RateFilter();
    cinemaRateSM.id = id || '';
    cinemaRateSM.limit = pageSize;
    cinemaRateSM.sort = '-time';
    cinemaRateSM.userId = userId;
    const searchResult = await rateService.search(cinemaRateSM, pageSize);
    setRates(searchResult.list);
  };

  const getCurrentUserRate = () => {
    let holdRate: any = 0;
    if (rates.length > 0) {
      for (const i in rates) {
        if (userId === rates[i].author) {
          holdRate = rates[i].rate;
        }
      }
    }
    setVoteStar(holdRate);
  }

  const postReview = async (data: DataPostRate): Promise<void> => {
    try {
      const id: string | undefined = storage.getUserId();
      if (!id || !cinema) {
        return storage.alert("Please sign in to review");
      }
      const rate: Rate = {};
      rate.id = cinema.id;
      rate.author = id;
      rate.rate = data.rate;
      rate.review = data.review;
      rate.time = new Date();
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
            setVoteStar={(setVoteStar)}
            voteStar={voteStar || 0} />
        </div>
        <RateList pageSize={pageSize} setPageSize={setPageSize} load={load} rates={rates} setRates={setRates} replies={replies} setReplies={setReplies} />
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
