import { useEffect, useState } from 'react';
// import ReactModal from 'react-modal';
import { useParams } from 'react-router-dom';
import { storage } from 'uione';
import { DetailStartFilm } from '../rate/detail-star';
import { DataPostRate, PostRateFilmForm } from '../rate/post-rate-film-form';
import { RateItemFilm } from '../rate/rate-item';
import { RatingStarFilm } from '../rate/rateting-star';
import { ReviewScoreFilm } from '../rate/review-score';
import { Film, FilmRate, FilmRateFilter } from './service/film';
import './rate.css';
import {  useFilmRate, useFilm } from './service';


interface Props {
  film: Film | undefined;
}
export const ReviewFilm = ({ film}: Props) => {
  const params = useParams();
  const [voteStar, setVoteStar] = useState<number>();
  const [isOpenRateModal, setIsOpenRateModal] = useState(false);
  const [rates, setRates] = useState<FilmRate[]>([]);
  const [pageSize, setPageSize] = useState(3);
  const [maxLengthReviewText] = useState(100);
  const [resource] = useState(storage.resource().resource());
  const filmService = useFilm();
  // const checkFilm = true;

  const FilmRateService = useFilmRate();
  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const load = async () => {
    const filmRateSM: FilmRateFilter = {} as any;
    const { id } = params;
    filmRateSM.id = id;

    const searchResult = await FilmRateService.search(filmRateSM, pageSize);
    setRates(searchResult.list);
  };

  const moreReview = async (e: any) => {
    e.preventDefault();
    const filmRateSM: FilmRateFilter = {} as any;
    const { id } = params;
    filmRateSM.id = id;
    filmRateSM.limit = pageSize + 3;
    filmRateSM.sort = '-rateTime';
    const searchRates = await FilmRateService.search(filmRateSM, pageSize + 3);

    setRates(searchRates.list);
    setPageSize(pageSize + 3);

  };

  const postReview = async (data: DataPostRate): Promise<void> => {
    try {
      const id: string | undefined = storage.getUserId();
      if (!id || !film) {
        return;
      }
      
      const filmRate: FilmRate = {} as any;
      filmRate.id = film.filmId;
      filmRate.userId = id;
      filmRate.rate = data.rate;
      filmRate.review = data.review;
      const result = await filmService.rateFilm(filmRate);
      storage.message('Your review is submited');
      setIsOpenRateModal(false);
      if(result === true)
      {
        await load();
      }
      
    } catch (err) {
      storage.alert('error');
    }
  };

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
              (rates.map((value: FilmRate, index: number) => {
                return <RateItemFilm key={index} data={value} maxLengthReviewText={maxLengthReviewText} resource={resource} ></RateItemFilm>;
              }) || '')
            )}
        </ul>
        <div className='col s12 m12 l12 more-reviews-div'>
          <span className='more-reviews' onClick={moreReview}>
            <b>MORE REVIEWS</b>
          </span></div>
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
