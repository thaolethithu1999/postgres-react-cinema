import { useEffect, useState } from 'react';
import { Carousel, CarouselImageItem, CarouselVideoItem } from 'reactx-carousel';

import { OnClick } from 'react-hook-core';
import { useNavigate } from 'react-router-dom';
import { FileInfo } from 'reactx-upload';
import { getLocations } from '../backoffice/service';
import { Location } from '../backoffice/service/location/location';
import { Cinema, Gallery } from '../backoffice/service/cinema/cinema';
import '../location/carousel.css';

interface Props {
  edit: (e: any, id: string) => void;
  cinema: Cinema;
}

export default function CinemaCarousel({ edit, cinema }: Props) {
  const [carousel, setCarousel] = useState(false);
  const [files, setFiles] = useState<FileInfo[]>() || undefined;
  const navigate = useNavigate();

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cinema, carousel]);

  const locationService = getLocations();

  let gallery = cinema.gallery || undefined;

  console.log(gallery);
  let arr: any = []

  gallery && gallery.forEach(img => {
    //console.log(img.url);
    arr.push(img.url);
  })

  //console.log(arr);


  const handleFetch = async () => {
    if (!carousel || files) { return; }
    let res;
    try {
      res = await locationService.fetchImageUploaded(cinema.id);
    } catch (error) { }
    console.log(res);
    if (res && res.length > 0) {
      for (const item of res) {
        if (item.type === 'youtube') {
          const thumbnails = await locationService.fetchThumbnailVideo(
            item.url
          );
          item.thumbnail = thumbnails.thumbnail;
          item.standardThumbnail = thumbnails.standardThumbnail;
          item.mediumThumbnail = thumbnails.mediumThumbnail;
          item.maxresThumbnail = thumbnails.maxresThumbnail;
          item.hightThumbnail = thumbnails.hightThumbnail;
        }
      }
      setFiles(res);
    } else {

      gallery && gallery.length > 0 && gallery.map((i: any) => {

        const info: FileInfo[] = [
          {
            source: '',
            type: 'image',
            url: `${i.url}` || '',
          },
        ];
        setFiles(info);
      }) 
    }
  };


  const toggleCarousel = (e: OnClick, enable: boolean) => {
    e.preventDefault();
    setCarousel(enable);
  };

  const navigateEdit = (e: OnClick) => {
    e.preventDefault();
    navigate(`edit/${cinema.id}`);
  };

  //console.log(cinema.gallery);

  // useEffect(()=>{
  //   setGallery(cinema.gallery);
  // }, [])
  return (
    <>
      {carousel ? (
        <div className='col s12 m6 l4 xl3 '>
          <div
            className='user-carousel-container '
            onClick={(e) => toggleCarousel(e, false)}
          >
            {files && files.length > 0 ? (
              <Carousel infiniteLoop={true}>
                {files.map((itemData, index) => {
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
                        <>
                          <CarouselImageItem key={index} src={itemData.url} />
                          {/* {
                            arr.map((i: any, idx: any) => {
                              <>
                              <h1>{i}</h1>
                              
                              </>
                            })
                          } */}
                        </>
                      );
                    case 'youtube':
                      return (
                        <CarouselVideoItem
                          key={index}
                          type={itemData.type}
                          src={itemData.url}
                        />
                      );
                    default:
                      return <></>;
                  }
                })}
              </Carousel>
            ) : (
              ''
            )}
          </div>
        </div>
      ) : (

        <li
          className='col s12 m6 l4 xl3 card '
        >

          <section>
            <div onClick={(e) => toggleCarousel(e, true)}
              className='cover'
              style={{
                backgroundImage: `url('${cinema.imageURL}')`,
              }}
            ></div>

            <h3 className='title-location' onClick={(e) => navigateEdit(e)}>{cinema.name}</h3>
          </section>
        </li>
      )}
    </>
  );
}
