import { generateKey } from 'crypto';
import React, { useState, useEffect } from 'react';
import '../rate.css';

interface Props {
  setIsOpenRateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setVoteStar: React.Dispatch<React.SetStateAction<number | undefined>>;
  ratingText: string;
  voteStar: number;
}
export const RatingStar = ({ setIsOpenRateModal, setVoteStar, ratingText, voteStar }: Props) => {
  const [currClass, setCurrClass] = useState<string>('');
  const [rateClassName, setRateClassName] = useState<string>();

  useEffect(() => {
    if(voteStar) {
      const ratedStart = generateRatingClasses(voteStar);
      setRateClassName(ratedStart);
    }
  }, [voteStar])

  const generateRatingClasses = (n: number) => {
    const className = ['rate'];
    for (let i = 1; i <= n; i++) {
      className.push(`star-${i}`);
    }
    return className.join(' ');
  };

  const handleOnclick = (n: number) => {
    const newCurrClass = generateRatingClasses(n);
    setCurrClass(newCurrClass);
    setVoteStar(n);
    setIsOpenRateModal(true);
    setRateClassName(currClass);
  };
  const handleOnMouseEnter = (n: number) => {
    const rateClass = generateRatingClasses(n);
    setRateClassName(rateClass);
  };
  const handleOnMouseLeave = () => {
    if(voteStar) { 
      setRateClassName(generateRatingClasses(voteStar));
    } else {
      setRateClassName(currClass);
    }
  };

  return (
    <div className='col s12 m12 l12 rating'>
      <p>{ratingText}</p>
      <div className={rateClassName + ' rate'} >
        {
          Array.from(Array(5).keys()).map(item => <i
            key={item}
            onClick={() => handleOnclick(item + 1)}
            onMouseEnter={() => handleOnMouseEnter(item + 1)}
            onMouseLeave={() => handleOnMouseLeave()}
          />
          )
        } 
      </div>
    </div>
  );
};
export const RatingStarFilm = ({ setIsOpenRateModal, setVoteStar, ratingText }: Props) => {
  const [currClass, setCurrClass] = useState<string>('');
  const [rateClassName, setRateClassName] = useState<string>();
  const generateRatingClasses = (n: number) => {
    const className = ['rate'];
    for (let i = 1; i <= n; i++) {
      className.push(`star-${i}`);
    }
    return className.join(' ');
  };

  const handleOnclick = (n: number) => {
    const newCurrClass = generateRatingClasses(n);
    setCurrClass(newCurrClass);
    setVoteStar(n);
    setIsOpenRateModal(true);
    setRateClassName(currClass);
  };
  const handleOnMouseEnter = (n: number) => {
    const rateClass = generateRatingClasses(n);
    setRateClassName(rateClass);
  };
  const handleOnMouseLeave = () => {

    setRateClassName(currClass);
  };
  return (
    <div className='col s12 m12 l12 rating'>
      <p>{ratingText}</p>
      <div className={rateClassName + ' rate'} >
        {
          Array.from(Array(10).keys()).map(item => <i
            key={item}
            onClick={() => handleOnclick(item + 1)}
            onMouseEnter={() => handleOnMouseEnter(item + 1)}
            onMouseLeave={() => handleOnMouseLeave()}
          />
          )
        }
      </div>
    </div>
  );
};
