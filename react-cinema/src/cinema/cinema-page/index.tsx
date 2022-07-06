import Axios from 'axios';
import { HttpRequest } from 'axios-core';
import { useEffect, useState } from 'react';
import { OnClick } from 'react-hook-core';
import ReactModal from 'react-modal';
import { Link, useParams } from 'react-router-dom';
import { getFileExtension, removeFileExtension, TypeFile } from 'reactx-upload';
import { alert, message, options, useResource } from 'uione';
import imageOnline from '../../assets/images/online.svg';
import { config } from '../../config';
import { UploadContainer } from '../../core/upload';
import { ModalSelectCover } from '../../my-profile/modal-select-cover';
import { CinemaOverview } from './overview';
import { CinemaPhoto } from './photo';
import { CinemaReview } from './review';
import { CinemaService } from '../service/cinema/';
import { useLocationsService } from '../../location/service';
import { Cinema } from '../service/cinema'
import { useCinema } from '../service/index'
import { useLocation } from 'react-router-dom';
import { Review } from '../../location/location-page/review';

const httpRequest = new HttpRequest(Axios, options);

export const CinemaPage = () => {
  const { id = '' } = useParams();
  const [cinema, setCinema] = useState<Cinema>();
  const [uploadedCover, setUploadedCover] = useState<string>();
  const [uploadedAvatar, setUploadedAvatar] = useState<string>();
  const [dropdownCover, setDropdownCover] = useState<boolean>(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [typeUpload, setTypeUpload] = useState<TypeFile>('cover');
  const [aspect, setAspect] = useState<number>(1);
  const [sizes, setSizes] = useState<number[]>([]);
  const [modalSelectGalleryOpen, setModalSelectGalleryOpen] = useState(false);
  const resource = useResource();
  const currentPath = useLocation();
  const cinemaService = useCinema();

  useEffect(() => {
    getCinema(id ?? '')
  }, [id])

  const getCinema = async (cinamaId: string) => {
    const currentCinema = await cinemaService.load(cinamaId);

    if (currentCinema) {
      setCinema(currentCinema);
      setUploadedCover(currentCinema?.coverURL);
      setUploadedAvatar(currentCinema?.imageURL);
    }
  }

  if (!cinema) {
    return (<div></div>)
  }

  const toggleDropdownCover = (e: OnClick) => {
    e.preventDefault();
    setDropdownCover(!dropdownCover);
  }

  const openModalUpload = (e: OnClick, type: TypeFile) => {
    e.preventDefault();
    setModalUpload(true);
    setTypeUpload(type);

    if (type === 'cover') {
      setAspect(2.7);
      setSizes([576, 768]);
    } else {
      setAspect(1);
    }
    setSizes([40, 400]);
  }

  const closeModalUpload = (e: OnClick) => {
    e.preventDefault();
    setModalUpload(false);
  }

  const toggleSelectGallery = (e: OnClick) => {
    e.preventDefault();
    setModalSelectGalleryOpen(!modalSelectGalleryOpen);
  }

  const getImageBySize = (url: string | undefined, size: number): string => {
    if (!url) {
      return '';
    }
    return removeFileExtension(url) + `_${size}.` + getFileExtension(url);
  }

  const handleChangeFile = (f: string | undefined) => {
    if (typeUpload === 'cover') {
      setUploadedCover(f);
    } else {
      setUploadedAvatar(f);
    }
  }

  const saveImageCover = (e: OnClick, url: string) => {
    e.preventDefault();
    setCinema({ ...cinema, coverURL: url });
    setUploadedCover(url);

    cinemaService.update({ ...cinema, coverURL: url })
      .then((success) => {
        if (success) {
          message(resource.success_save_my_profile)
        } else {
          alert(resource.fail_save_my_profile, resource.error)
        }
      });
  }

  return (
    <>
      <div className="profile view-container">
        <form id='cinemaForm' name='cinemaForm'>
          <header className='border-bottom-highlight'>
            <div className='cover-image'>
              {
                ((uploadedCover) && <img src={uploadedCover} alt='' />) ||
                (<img alt='' src='https://pre00.deviantart.net/6ecb/th/pre/f/2013/086/3/d/facebook_cover_1_by_alphacid-d5zfrww.jpg' />)
              }
              <div className='contact-group'>
                <button id='btnPhone' name='btnPhone' className='btn-phone' />
                <button id='btnEmail' name='btnEmail' className='btn-email' />
              </div>

              <button id='btnFollow' name='btnFollow' className='btn-follow'>Follow</button>
            </div>

            <button id='btnCamera' name='btnCamera' className='btn-camera' onClick={toggleDropdownCover} />
            <ul
              id='dropdown-basic'
              className={`dropdown-content-profile dropdown-upload-cover ${dropdownCover ? 'show-upload-cover' : ''}`}
            >
              <li className='menu' onClick={(e) => openModalUpload(e, 'cover')}>Upload</li>
              <hr style={{ margin: 0 }} />
              <li className='menu' onClick={toggleSelectGallery}>Choose from gallery</li>
            </ul>

            <div className='avatar-wrapper'>
              <img className='avatar' alt='' src={getImageBySize(uploadedAvatar, 400) || 'https://www.bluebridgewindowcleaning.co.uk/wp-content/uploads/2016/04/default-avatar.png'} />
              <button
                id='btnCamera'
                name='btnCamera'
                className='btn-camera'
                onClick={(e) => openModalUpload(e, 'upload')} />
              <img className='profile-status' alt='status' src={imageOnline} />
            </div>

            <div className='profile-title'>
              <h3>{cinema.name}</h3>
              <p>500 followers</p>
            </div>

            <nav className='menu'>
              <ul>
                <li><Link to={`/cinema/${id}`}  > Overview </Link></li>
                <li><Link to={`/cinema/${id}/bookable`}  > Bookable </Link></li>
                <li><Link to={`/cinema/${id}/review`}  > Review </Link></li>
                <li><Link to={`/cinema/${id}/photo`}  > Photo </Link></li>
                <li><Link to={`/cinema/${id}/about`}  > About </Link></li>
              </ul>
            </nav>
          </header>
          <div className='row'>
            <CinemaOverview />
            <CinemaReview />
            <CinemaPhoto />
          </div>
        </form>

        <ReactModal
          isOpen={modalUpload}
          onRequestClose={closeModalUpload}
          contentLabel='Modal'
          className='modal-portal-content'
          bodyOpenClassName='modal-portal-open'
          overlayClassName='modal-portal-backdrop'
        >
          <div className='view-container profile-info'>
            <form model-name='data'>
              <header>
                <h2>{resource.title_modal_uploads}</h2>
                <button
                  type='button'
                  id='btnClose'
                  name='btnClose'
                  className='btn-close'
                  onClick={closeModalUpload}
                />
              </header>
              <UploadContainer
                post={httpRequest.post}
                setURL={(dt: any) => handleChangeFile(dt)}
                type={typeUpload}
                id={cinema.id}
                url={config.location_url}
                aspect={aspect}
                sizes={sizes}
              />
              <footer>
                <button
                  type='button'
                  id='btnSave'
                  name='btnSave'
                  onClick={closeModalUpload}
                >
                  {resource.button_modal_ok}
                </button>
              </footer>
            </form>
          </div>
        </ReactModal>

        <ModalSelectCover
          list={cinema.gallery ?? []}
          modalSelectGalleryOpen={modalSelectGalleryOpen}
          closeModalUploadGallery={toggleSelectGallery}
          setImageCover={saveImageCover}
        />
      </div>
    </>
  );
};  
