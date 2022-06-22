import React from 'react';
import { useState, useEffect } from 'react';
import { getLocationRates, useLocationsService } from '../../location/service';
import { LocationRate, LocationRateFilter } from '../../backoffice/service/location-rate/location-rate';
import { useParams } from 'react-router-dom';
import { Location } from '../../backoffice/service/location/location';
import { alert, handleError, message, useResource, storage } from 'uione';
import { Carousel, CarouselImageItem, CarouselVideoItem } from 'reactx-carousel';
import {
  User,
  useMyProfileService
} from '../../my-profile/my-profile';
import { Cinema, Gallery } from '../service/cinema/cinema';
import { getCinemaRates, useCinema } from '../service/index';
import { FileInfo } from 'reactx-upload';
import './rate.css';

export const CinemaPhoto = () => {
  const { id = '' } = useParams();
  const [cinema, setCinema] = useState<Cinema>() || undefined;
  const [files, setFiles] = useState<FileInfo[]>([]);
  const cinemaService = useCinema();

  const [location, setLocation] = useState<Location>();
  const locationRateService = getLocationRates();
  const locationService = useLocationsService();
  const [pageSize, setPageSize] = useState(3);
  const [rates, setRates] = useState<LocationRate[]>([]);
  const [rateClassName, setRateClassName] = useState<string>();
  const [currClass, setCurrClass] = useState<string>('');
  const resource = useResource();
  const [user, setUser] = useState<User>({} as any);
  const service = useMyProfileService();

  useEffect(() => {
    load();
    getCinema(id ?? '');
  }, [id]);

  const load = async () => {
    const locationRateSM = new LocationRateFilter();
    locationRateSM.locationId = id;
    locationRateSM.limit = pageSize;
    locationRateSM.sort = '-rateTime';

    const searchResult = await locationRateService.search(locationRateSM);
    setRates(searchResult.list);
    setRateClassName('rate');
    setCurrClass('rate');
  };

  const getCinema = async (cinamaId: string) => {
    const currentCinema = await cinemaService.load(cinamaId)
    console.log(currentCinema);

    if (currentCinema) {
      setCinema(currentCinema);
    }
  }

  let gallery = cinema?.gallery || [];
  console.log(files);


  if (window.location.pathname.includes('photo')) {
    return (
      <>
        <section className='row img-border'>
          <div className='user-carousel-container'>
            <Carousel infiniteLoop={true}>
              {cinema?.gallery
                ? cinema.gallery.map((itemData, index) => {
                  switch (itemData.type) {
                    case 'video':
                      return (
                        <CarouselVideoItem
                          key={index}
                          type={itemData.type}
                          src={itemData.url}
                        />
                      );
                    case 'image':
                      return (
                        <CarouselImageItem
                          key={index}
                          src={itemData.url}
                        />
                      );
                    case 'youtube':
                      return (
                        <div className='data-item-youtube'>
                          <iframe
                            src={itemData.url + '?enablejsapi=1'}
                            frameBorder='0'
                            className='iframe-youtube'
                            title='youtube video'
                          ></iframe>
                          ;
                        </div>
                      );
                    default:
                      return <></>;
                  }
                })
                : [<></>]}
            </Carousel>
          </div>
        </section>
      </>
    );
  }
  return (<></>);
};
