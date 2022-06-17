import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { OnClick } from 'react-hook-core';
import ReactModal from 'react-modal';
import { storage } from 'uione';
import like from '../assets/images/like.svg';
import likeFilled from '../assets/images/like_filled.svg';
import { customStyles } from './appreciations';
import { PostRateForm } from './post-appreciation-form';
import { useAppreciationReplyService, useAppreciationService } from './service';
import { Appreciation, UsefulAppreciation } from './service/appreciation';
import { AppreciationReply, AppreciationReplyFilter } from './service/appreciation-reply';
interface Props {
  data: Appreciation | AppreciationReply;
  replyAppreciation: boolean;
  setDataReply?: (data: AppreciationReply) => void;
  deletedAppreciation: (data: Appreciation | AppreciationReply) => void;
}

export const AppreciationReplys = ({ data, replyAppreciation, setDataReply, deletedAppreciation }: Props) => {
  const appreciationService = useAppreciationService();
  const appreciationReplyService = useAppreciationReplyService();
  const [appreciation, setAppreciation] = useState<Appreciation | AppreciationReply>();
  const [appreciationsReply, setAppreciationsReply] = useState<AppreciationReply[]>([]);
  const [maxLengthReviewText] = useState(210);
  const [resource] = useState(storage.resource().resource());
  const [showmore, setShowmore] = useState(false);
  // const [skip, setSkip] = useState(24);
  const [limit] = useState(24);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showReply, setShowReply] = useState(false);
  useEffect(() => {
    setAppreciation(data);
  }, [data]);



  const getMoreAppreciations = async (e: OnClick) => {
    e.preventDefault();
    if (!appreciationReplyService) { return; }

    const filter: AppreciationReplyFilter = {
      appreciationId: data.id,
      limit,
      userIdUseful: storage.getUserId()
    };
    const rs = await appreciationReplyService.search(filter);
    if (rs) {
      setAppreciationsReply(rs.list);
    }
    setShowReply(!showReply);
  };

  const handleShow = (e: OnClick, isShow: boolean) => {
    e.preventDefault();
    setShowmore(isShow);
  };

  const openModal = async (e: OnClick) => {
    e.preventDefault();
    setIsOpenModal(true);
  };

  const setData = (reply: AppreciationReply) => {
    if (!replyAppreciation) {
      const newList = [...appreciationsReply];
      newList.unshift(reply);
      setAppreciationsReply(newList);
      if (appreciation) {
        setAppreciation({ ...appreciation, replyCount: appreciation.replyCount + 1 });
      }
      return;
    }
    if (setDataReply) {
      setDataReply(reply);
    }
  };

  const formatReviewText = (text: string) => {
    if ((text && text.length > maxLengthReviewText) && !showmore) {
      let textSub = text.substring(0, maxLengthReviewText);
      textSub = textSub + ' ...';
      const a = <span>{resource.review} {textSub} <span onClick={e => handleShow(e, true)} className='more-reviews'>More</span></span>;
      return a;
    } else if ((text && text.length > maxLengthReviewText) && showmore) {
      return <span>{resource.review} {text}<span onClick={e => handleShow(e, false)} className='more-reviews'>Less</span></span>;
    } else {
      return <span>{resource.review} {text}</span>;
    }
  };

  const postUseful = async (e: OnClick, comment: Appreciation) => {
    let rs;
    const useful: UsefulAppreciation = {
      appreciationId: comment.id || '',
      userId: storage.getUserId() || ''
    };
    if (appreciationReplyService && replyAppreciation) {
      rs = await appreciationReplyService.usefulAppreciation(useful);
    } else if (appreciationService && !replyAppreciation) {
      rs = await appreciationService.usefulAppreciation(useful);
    }
    if (rs === 2) {// 2:Delete 1:Insert
      setAppreciation({ ...comment, isUseful: false, usefulCount: comment.usefulCount - 1 });
    } else { setAppreciation({ ...comment, isUseful: true, usefulCount: comment.usefulCount + 1 }); }
  };

  const deleteAppreciation = async (e: OnClick) => {
    e.preventDefault();
    if (!appreciationReplyService || !appreciation || !appreciationService) { return; }
    let rs;
    if (replyAppreciation) {
      rs = await appreciationReplyService.delete(appreciation.id || '');
    } else {
      rs = await appreciationService.delete(appreciation.id || '');
    }
    if (rs > 0) {
      deletedAppreciation(appreciation);
    }

  };

  const handleDeleteAppreciation = (reply: AppreciationReply) => {
    const newAppreciations = appreciationsReply.filter(obj => obj.id !== reply.id);
    setAppreciationsReply(newAppreciations);
    setAppreciation({ ...reply, replyCount: reply.replyCount - 1 });
  };

  return (
    <> {appreciation &&
      <li className='col s12 m12 l12 appreciation-custom'>
        <section className='card appreciation-section'>
          <div className='tool-section'>
            <h4>
              {appreciation.title}
            </h4>
            <div>
              <button onClick={deleteAppreciation}><span className='material-icons-outlined'>delete</span>
              </button>
            </div>
          </div>
          {formatReviewText(appreciation.description ?? '')}
          <p>{moment(appreciation.createdAt).format('DD/MM/YYYY')}</p>
          <p>
            {appreciation.isUseful ? <img alt='' className='useful-button' width={20} src={likeFilled} onClick={(e) => postUseful(e, appreciation)} /> : <img alt='' className='useful-button' width={20} src={like} onClick={(e) => postUseful(e, appreciation)} />}

            {appreciation.usefulCount} <button onClick={openModal}>Reply</button></p>
          {(!replyAppreciation && appreciation.replyCount > 0) && <button onClick={getMoreAppreciations}>View {appreciation.replyCount} replies</button>}

        </section>
        <div className='more-appreciations'>
          {
            showReply && appreciationsReply.map(reply => (
              <AppreciationReplys deletedAppreciation={handleDeleteAppreciation} data={reply} replyAppreciation={true} setDataReply={setData} />
            ))
          }
        </div>
      </li>
    }
      <ReactModal
        isOpen={isOpenModal}
        style={customStyles}
        onRequestClose={() => setIsOpenModal(false)}
        contentLabel='Modal'
        portalClassName='modal-portal'
        className='modal-portal-content small-width'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'>

        <PostRateForm replyAppreciation={replyAppreciation} data={data} setData={setData} closeModal={() => setIsOpenModal(false)} />
      </ReactModal>
    </>
  );
};
