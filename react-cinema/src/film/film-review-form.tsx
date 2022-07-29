import { useEffect, useState } from 'react';
// import ReactModal from 'react-modal';
import { useParams } from 'react-router-dom';
import { storage } from 'uione';
import { DetailStartFilm } from '../rate/detail-star';
import { DataPostRate, PostRateFilmForm } from '../rate/post-rate-film-form';
import { RateItemFilm } from './rate-item';
import { RatingStarFilm } from '../rate/rateting-star';
import { ReviewScoreFilm } from '../rate/review-score';
import { Film, FilmRate, FilmRateFilter } from './service/film';
import './rate.css';
import { useFilmRate, useFilm } from './service';
import { Rate, RateFilter } from './service/rate/rate';
import { OnClick } from 'react-hook-core';

interface Props {
  film: Film | undefined;
}
export const ReviewFilm = ({ film }: Props) => {
  const userId: string | undefined = storage.getUserId() || '';
  const params = useParams();
  const [voteStar, setVoteStar] = useState<number>();
  const [isOpenRateModal, setIsOpenRateModal] = useState(false);
  const [rates, setRates] = useState<Rate[]>([]);
  const [pageSize, setPageSize] = useState(3);
  const [maxLengthReviewText] = useState(100);
  const [resource] = useState(storage.resource().resource());
  const filmService = useFilm();
  // const checkFilm = true;

  const rateFilmService = useFilmRate();
  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const load = async () => {
    const filmRateSM: RateFilter = {} as any;
    const { id } = params;
    filmRateSM.id = id;
    filmRateSM.userId = userId;
    filmRateSM.sort = '-time';
    const searchResult = await rateFilmService.search(filmRateSM, pageSize);
    console.log(searchResult.list);
    setRates(searchResult.list);
  };

  const moreReview = async (e: any) => {
    e.preventDefault();
    const filmRateSM: RateFilter = {} as any;
    const { id } = params;
    filmRateSM.id = id;
    filmRateSM.limit = pageSize + 3;
    filmRateSM.sort = '-time';
    const searchRates = await rateFilmService.search(filmRateSM, pageSize + 3);

    setRates(searchRates.list);
    setPageSize(pageSize + 3);

  };

  const postReview = async (data: DataPostRate): Promise<void> => {
    try {
      const id: string | undefined = storage.getUserId();
      if (!id || !film) {
        return;
      }
      const filmRate: Rate = {} as any;
      filmRate.id = film.filmId;
      filmRate.author = id;
      filmRate.rate = data.rate;
      filmRate.review = data.review;
      const res = await rateFilmService.rate(filmRate);
      console.log({ res });

      storage.message('Your review is submited');
      setIsOpenRateModal(false);
      load();
    } catch (err) {
      storage.alert('error');
    }
  };

  const usefulReaction = async (e: OnClick, rate: Rate) => {
    console.log(rate);
    const id = rate.id || '';
    const author = rate.author || '';
    const userId: string | undefined = storage.getUserId();
    if (!userId) {
      return;
    }
    const rs = await rateFilmService.setUseful(id, author, userId);
    load();
  }

  const removeUseful = async (e: OnClick, rate: Rate) => {
    const id = rate.id || '';
    const author = rate.author || '';
    const userId: string | undefined = storage.getUserId();
    if (!userId) {
      return;
    }
    await rateFilmService.removeUseful(id, author, userId);
    load();
  }

  if (film) {
    return (
      <>
        <div className='row top-content row-rate'>
          {film.info && <ReviewScoreFilm rate={film.info.rate} />}
          <div className='col s8 m7 l6'>
            {DetailStartFilm(film.info)}
          </div>
        </div>
        <div className='row mid-content row-rate'>
          <RatingStarFilm ratingText={resource.rating_text} setIsOpenRateModal={setIsOpenRateModal} setVoteStar={(setVoteStar)} />
        </div>
        <div className='title'>
          <span><b>{resource.reviews}</b></span>
        </div>
        <ul className='row list-view'>
          {
            (
              rates && rates.length > 0 &&
              (rates.map((value: Rate, index: number) => {
                return <RateItemFilm key={index} data={value} maxLengthReviewText={maxLengthReviewText} resource={resource} load={load} removeUsefulReaction={removeUseful} usefulReaction={usefulReaction} ></RateItemFilm>;
              }) || '')
            )}
        </ul>
        {rates && rates.length >= 3 && (<div className='col s12 m12 l12 more-reviews-div'>
          <span className='more-reviews' onClick={moreReview}>
            <b>MORE REVIEWS</b>
          </span>
        </div>)}
        <PostRateFilmForm
          rate={voteStar ?? 1}
          name={film.title}
          close={() => setIsOpenRateModal(false)}
          postRate={postReview}
          isOpenRateModal={isOpenRateModal}
        />
      </>
    );
  }
  return <></>;
};
