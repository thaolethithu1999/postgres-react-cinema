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
import { getCinemaRates, Cinema, useCinema} from '../service';
import { CinemaRate, CinemaRateFilter} from '../service/cinema-rate/cinema-rate';

import './rate.css';

ReactModal.setAppElement('#root');

export const CinemaReview = () => {
  const params = useParams();
  const [cinema, setCinema] = useState<Cinema>();

  if ( window.location.pathname.includes('review')) {
    return (
      <>
        <p>Review</p>
      </>
    );
  }
  return <></>;
};
