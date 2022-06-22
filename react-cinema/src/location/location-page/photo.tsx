import React from 'react';
import { useState, useEffect } from 'react';
import { getLocationRates, useLocationsService } from '../service';
import { LocationRate, LocationRateFilter } from '../../backoffice/service/location-rate/location-rate';
import { useParams } from 'react-router-dom';
import { Location } from '../../backoffice/service/location/location';
import { alert, handleError, message, useResource, storage } from 'uione';
import { Carousel, CarouselImageItem, CarouselVideoItem } from 'reactx-carousel';
import {
  User,
  useMyProfileService
} from '../../my-profile/my-profile';

export const LocationPhoto = () => {
  const params = useParams();
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
    setRateClassName('rate');
    setCurrClass('rate');
    if (locationObj) {
      setLocation(locationObj);
    }
  };

  const userId = storage.getUserId();
    if (userId && userId.length > 0) {
      service.getMyProfile(userId).then((profile) => {
        if (profile) {
          setUser(profile);
          // setBio(profile.bio || '');
          // setUploadedCover(profile.coverURL);
          // setUploadedAvatar(profile.imageURL);
        }
      });
    }

  if (location && window.location.pathname.includes('photo')) {
    return (
      <div className='card border-bottom-highlight'>
              {/* <header>
                <i className='material-icons highlight btn-camera'></i>
                {resource.title_modal_gallery}
                <button
                  type='button'
                  id='btnGallery'
                  name='btnGallery'
                  className={'btn-edit'}
                  // onClick={openModalUploadGallery}
                />
              </header> */}
              <section className='row'>
                <div className='user-carousel-container'>
                  <Carousel infiniteLoop={true}>
                    {user.gallery
                      ? user.gallery.map((itemData, index) => {
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
                              // <img className='image-carousel' src={itemData.url} key={index} alt={itemData.url} draggable={false}/>
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
            </div>
    );
  }
  return null;
};
