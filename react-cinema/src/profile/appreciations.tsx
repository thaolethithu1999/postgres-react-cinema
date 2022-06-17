import React, { useEffect, useState } from 'react';
import { OnClick } from 'react-hook-core';
import ReactModal from 'react-modal';
import { useParams } from 'react-router-dom';
import { storage } from 'uione';
import { AppreciationReplys } from './appreciation';
import './appreciation.css';
import { PostRateForm } from './post-appreciation-form';
import {  useAppreciationService } from './service';
import { Appreciation, AppreciationFilter } from './service/appreciation';

export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  }
};
ReactModal.setAppElement('#root');
export const Appreciations = () => {
  const params = useParams();
  const appreciationService = useAppreciationService();
  const [appreciations, setAppreciations] = useState<Appreciation[]>([]);
  const [limit, setLimit] = useState(24);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [resource] = useState(storage.resource().resource());
  useEffect(() => {
    load();
  }, [appreciationService]); // eslint-disable-line react-hooks/exhaustive-deps
  const load = async () => {
    if (!appreciationService) { return; }
    const appreciateSM = new AppreciationFilter();
    const { id } = params;
    appreciateSM.userId = id;
    appreciateSM.limit = limit;
    appreciateSM.userIdUseful = storage.getUserId();
    // appreciateSM.sort = '-rateTime';
    const searchResult = await appreciationService.search(appreciateSM);

    setAppreciations(searchResult.list);
  };

  const openModal = async (e: OnClick) => {
    e.preventDefault();
    setIsOpenModal(true);
  };

  const setData = (data: Appreciation) => {
    const newList = [...appreciations];
    newList.unshift(data);
    setAppreciations(newList);
  };

  const moreAppreciate = async (e: any) => {
    if (!appreciationService) { return; }
    e.preventDefault();
    const appreciateSM = new AppreciationFilter();
    const { id } = params;
    appreciateSM.id = id;
    appreciateSM.userIdUseful = storage.getUserId();
    appreciateSM.limit = limit + 3;
    const searchRates = await appreciationService.search(appreciateSM);

    setAppreciations(searchRates.list);
    setLimit(limit + 3);
  };

  const handleDeleteAppreciation = (appreciation: Appreciation) => {
    const newAppreciations = appreciations.filter(data => data.id !== appreciation.id);
    setAppreciations(newAppreciations);

  };

  const handleSort = () => {
  };
  if (window.location.pathname.includes('appreciation')) {
    return (
      <>
        <div className='row top-content sort-content'>
          <section className='section-appreciate'>
            {/* <input type={"text"} className="input-appreciate" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
              <input type={"text"} className="input-appreciate" placeholder='Description' value={description} onChange={e => setDescription(e.target.value)} /> */}
            <button onClick={openModal}>Send</button>
          </section>
          <select className='comments-sort btn button' onChange={handleSort} defaultValue={'relevance'}>
            <option value='relevance'>Top Reply</option>
            <option value='time'>Newest First</option>
          </select>
        </div>


        <div className='title'>
          <span><b>{resource.reviews}</b></span>
        </div>
        <>  <ul className='row list-view'>
          {
            appreciations && appreciations.length > 0 &&
            (appreciations.map((value: Appreciation, index: number) => {
              return <AppreciationReplys deletedAppreciation={handleDeleteAppreciation} replyAppreciation={false} data={value} key={value.id} />;
            }) || '')
          }
        </ul>
          <div className='col s12 m12 l12 more-reviews-div'>
            <span className='more-reviews' onClick={moreAppreciate}>
              <b>MORE REVIEWS</b>
            </span></div>
        </>
        <ReactModal
          isOpen={isOpenModal}
          style={customStyles}
          onRequestClose={() => setIsOpenModal(false)}
          contentLabel='Modal'
          portalClassName='modal-portal'
          className='modal-portal-content small-width'
          bodyOpenClassName='modal-portal-open'
          overlayClassName='modal-portal-backdrop'>
          <PostRateForm replyAppreciation={false} setData={setData} closeModal={() => setIsOpenModal(false)} />
        </ReactModal>
      </>
    );
  }
  return null;
};
