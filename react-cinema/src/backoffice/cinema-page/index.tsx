import Axios from 'axios';
import { HttpRequest } from 'axios-core';
import { useEffect, useState } from 'react';
import { OnClick } from 'react-hook-core';
import ReactModal from 'react-modal';
import { Link, useParams } from 'react-router-dom';
import { getFileExtension, removeFileExtension, TypeFile } from 'reactx-upload';
import { alert, message, options, useResource } from 'uione';
import imageOnline from '../../assets/images/online.svg';
import { Location } from '../../backoffice/service/location/location';
import { config } from '../../config';
import { UploadContainer } from '../../core/upload';
import { ModalSelectCover } from '../../my-profile/modal-select-cover';
import { Overview } from './overview';
import { LocationPhoto } from './photo';
import { Review } from './review';
import { CinemaService } from '../service/cinema/';
import { useLocationsService } from '../../location/service';


const httpRequest = new HttpRequest(Axios, options);
export const CinemaPage = () => {
  
  return (

    <h1>cinema page</h1>
    
  );
};  
