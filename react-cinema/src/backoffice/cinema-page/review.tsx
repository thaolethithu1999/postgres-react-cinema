import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useParams } from 'react-router-dom';
import { storage } from 'uione';
import { DetailStart } from '../../rate/detail-star';
import { DataPostRate, PostRateForm } from '../../rate/post-rate-form';
import { RateItem } from '../../rate/rate-item';
import { RatingStar } from '../../rate/rateting-star';
import { ReviewScore } from '../../rate/review-score';
import { getLocationRates, Location, LocationRate, LocationRateFilter, useLocationsService } from '../../location/service';
import './rate.css';

ReactModal.setAppElement('#root');

export const CinemaReview = () => {
  const params = useParams();
  const [voteStar, setVoteStar] = useState<number>();
  const [isOpenRateModal, setIsOpenRateModal] = useState(false);
  const [location, setLocation] = useState<Location>();
  const [rates, setRates] = useState<LocationRate[]>([]);
  const [pageSize, setPageSize] = useState(3);
  const [maxLengthReviewText] = useState(100);
  const [resource] = useState(storage.resource().resource());

  const locationRateService = getLocationRates();
  const locationService = useLocationsService();
  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const load = async () => {
    const locationRateSM = new LocationRateFilter();
    const { id } = params;
    locationRateSM.locationId = id;
    locationRateSM.limit = pageSize;
    locationRateSM.sort = '-rateTime';
    const locationObj = await locationService.load(id || '');
    const searchResult = await locationRateService.search(locationRateSM);
    setRates(searchResult.list);
    if (locationObj) {
      setLocation(locationObj);
    }
  };

  const moreReview = async (e: any) => {
    e.preventDefault();
    const locationRateSM = new LocationRateFilter();
    const { id } = params;
    locationRateSM.locationId = id;
    locationRateSM.limit = pageSize + 3;
    locationRateSM.sort = '-rateTime';
    const searchRates = await locationRateService.search(locationRateSM);

    setRates(searchRates.list);
    setPageSize(pageSize + 3);

  };

  const postReview = async (data: DataPostRate): Promise<void> => {
    try {
      const id: string | undefined = storage.getUserId();
      if (!id || !location) {
        return;
      }
      const locationRate: LocationRate = {};
      locationRate.locationId = location.id;
      locationRate.userId = id;
      locationRate.rate = data.rate;
      locationRate.review = data.review;
      await locationService.rateLocation(locationRate);
      storage.message('Your review is submited');
      setIsOpenRateModal(false);
      await load();
    } catch (err) {
      storage.alert('error');
    }
  };

  if (location && window.location.pathname.includes('review')) {
    return (
      <>
        <div className='row top-content row-rate'>
          {location.info && <ReviewScore rate={location.info.rate} />}
          <div className='col s8 m7 l6'>
            {DetailStart(location.info)}
          </div>
        </div>
        <div className='row mid-content row-rate'>
          <RatingStar ratingText={resource.rating_text} setIsOpenRateModal={setIsOpenRateModal} setVoteStar={(setVoteStar)} />
        </div>
        <div className='title'>
          <span><b>{resource.reviews}</b></span>
        </div>
        <ul className='row list-view'>
          {
            (
              rates && rates.length > 0 &&
              (rates.map((value: LocationRate, index: number) => {
                return <RateItem review={value.review ?? ''} maxLengthReviewText={maxLengthReviewText} rateTime={value.rateTime} rate={value.rate || 1} resource={resource}></RateItem>;
              }) || '')
            )}
        </ul>
        <div className='col s12 m12 l12 more-reviews-div'>
          <span className='more-reviews' onClick={moreReview}>
            <b>MORE REVIEWS</b>
          </span></div>
        <PostRateForm
          rate={voteStar ?? 1}
          name={location.name}
          close={() => setIsOpenRateModal(false)}
          postRate={postReview}
          isOpenRateModal={isOpenRateModal} />
      </>
    );
  }
  return <></>;
};
