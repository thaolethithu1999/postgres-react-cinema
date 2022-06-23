import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel, CarouselImageItem, CarouselVideoItem } from 'reactx-carousel';
import { Cinema, Gallery } from '../service/cinema/cinema';
import { getCinemaRates, useCinema } from '../service/index';
import { FileInfo } from 'reactx-upload';
import './rate.css';

export const CinemaPhoto = () => {
  const { id = '' } = useParams();
  const [cinema, setCinema] = useState<Cinema>() || undefined;
  const cinemaService = useCinema();

  useEffect(() => {
    getCinema(id ?? '');
  }, [id]);

  const getCinema = async (cinamaId: string) => {
    const currentCinema = await cinemaService.load(cinamaId)
    if (currentCinema) {
      setCinema(currentCinema);
    }
  }

  let gallery = cinema?.gallery || [];

  if (window.location.pathname.includes('photo')) {
    return (
      <>
        <section className='row'>
          <div className='user-carousel-container img-border'>
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
