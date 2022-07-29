import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { OnClick } from 'react-hook-core';
import ReactModal from 'react-modal';
import { storage } from 'uione';
import { customStyles } from './appreciations';
import { HistoryAppreciation } from './history-appreciation';
import { PostRateForm } from './post-appreciation-form';
import { useReplyService, useAppreciationService } from './service';
import { Appreciation, Useful } from './service/appreciation';
import { Reply, ReplyFilter } from './service/appreciation-reply';
interface Props {
  data: Appreciation | Reply;
  replyAppreciation: boolean;
  setDataReply?: (data: Reply) => void;
  deletedAppreciation: (data: Appreciation | Reply) => void;
}
const userId = storage.getUserId() || ''

export const Replys = ({ data, replyAppreciation, setDataReply, deletedAppreciation }: Props) => {
  const appreciationService = useAppreciationService();
  const appreciationReplyService = useReplyService();
  const [appreciation, setAppreciation] = useState<Appreciation | Reply>();
  const [dataModal, setDataModal] = useState<Appreciation | Reply>();
  const [appreciationsReply, setAppreciationsReply] = useState<Reply[]>([]);
  const [maxLengthReviewText] = useState(210);
  const [resource] = useState(storage.resource().resource());
  const [showmore, setShowmore] = useState(false);
  // const [skip, setSkip] = useState(24);
  const [limit] = useState(24);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalHistory, setIsOpenModalHistory] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [isEdit, setIsEdit] = useState(false)
  useEffect(() => {
    setAppreciation(data);
  }, [data]);

  const getMoreAppreciations = async (e: OnClick) => {
    e.preventDefault();
    if (!appreciationService) { return; }
    const rs = await appreciationService.getReplys(data.id, data.author);
    if (rs) {
      setAppreciationsReply(rs);
    }
    setShowReply(!showReply);
  };

  const handleShow = (e: OnClick, isShow: boolean) => {
    e.preventDefault();
    setShowmore(isShow);
  };

  const setData = (reply: Reply | Appreciation) => {
    if (!replyAppreciation) {
      const newList = [...appreciationsReply];
      newList.unshift(reply as Reply);
      setAppreciationsReply(newList);
      const replyCount = appreciation?.replyCount !== undefined ? appreciation?.replyCount + 1 : 0
      setAppreciation({ ...appreciation, replyCount } as Appreciation)
      return;
    }
    else if (reply.replyCount) {
      setAppreciation(reply);
    }
    else if (setDataReply) {
      setDataReply(reply as Reply);
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

  // const postUseful = async (e: OnClick, comment: Appreciation) => {
  //   let rs;
  //   const useful: Useful = {
  //     appreciationId: comment.id || '',
  //     userId: storage.getUserId() || ''
  //   };
  //   if (appreciationReplyService && replyAppreciation) {
  //     rs = await appreciationReplyService.usefulAppreciation(useful);
  //   } else if (appreciationService && !replyAppreciation) {
  //     rs = await appreciationService.usefulAppreciation(useful);
  //   }
  //   if (rs === 2) {// 2:Delete 1:Insert
  //     setAppreciation({ ...comment, isUseful: false, usefulCount: comment.usefulCount - 1 });
  //   } else { setAppreciation({ ...comment, isUseful: true, usefulCount: comment.usefulCount + 1 }); }
  // };

  const deleteAppreciation = async (e: OnClick) => {
    e.preventDefault();
    if (!appreciationReplyService || !appreciation || !appreciationService) { return; }
    let rs;
    if (replyAppreciation) {
      rs = await appreciationService.removeReply(appreciation.id, appreciation.author, userId);
    } else {
      rs = await appreciationService.delete({ id: appreciation.id, author: appreciation.author });
    }
    if (rs > 0) {
      deletedAppreciation(appreciation);
    }
  };

  const editAppreciation = async (e: OnClick) => {
    e.preventDefault();
    if (!appreciationReplyService || !appreciation || !appreciationService) { return; }
    console.log('dataa', data)
    setIsEdit(true)
    setIsOpenModal(true)
    setDataModal(appreciation)
  };
  const openAppreciationHistory = async (e: OnClick) => {
    e.preventDefault();
    setIsOpenModalHistory(true)
  };


  const handleDeleteAppreciation = (reply: Reply | Appreciation) => {
    const newAppreciations = appreciationsReply.filter(obj => obj.id !== reply.id);
    setAppreciationsReply(newAppreciations);
    const replyCount = appreciation?.replyCount ? appreciation?.replyCount - 1 : 0
    setAppreciation({ ...appreciation, replyCount } as Appreciation)
  };

  const openModalReply = (e: OnClick) => {
    e.preventDefault()
    setDataModal(appreciation)
    setIsEdit(false)
    setIsOpenModal(true)
  }

  const showDelete = useMemo(() => {
    if (!data) return false
    if (!replyAppreciation)
      return userId === data.author
    else{
      return userId === (data as Reply).userId
    }
  
  }, [])
  return (
    <> {appreciation &&
      <li className='col s12 m12 l12 appreciation-custom'>
        {/* <img src="" alt="" /> */}
        <section className='card appreciation-section'>
          <div className='tool-section'>
            <h4>
              {appreciation.title}
            </h4>
            <div className='tool-section-bar'>
              <button onClick={editAppreciation}><span className='material-icons-outlined'>edit</span>
              </button>
              <button onClick={openAppreciationHistory}><span className='material-icons-outlined'>history</span>
              </button>
              {showDelete && <button onClick={deleteAppreciation}><span className='material-icons-outlined'>delete</span>
              </button>}
            </div>
          </div>
          {formatReviewText(appreciation.review ?? '')}
          <p>{moment(appreciation.time).format('DD/MM/YYYY')}</p>
          <p>
            {/* {appreciation.isUseful ? <img alt='' className='useful-button' width={20} src={likeFilled} onClick={(e) => postUseful(e, appreciation)} /> : <img alt='' className='useful-button' width={20} src={like} onClick={(e) => postUseful(e, appreciation)} />} */}

            {/* {appreciation.usefulCount} */}
            <button onClick={openModalReply}>Reply</button>
          </p>
          {(!replyAppreciation && appreciation.replyCount && appreciation.replyCount > 0) ?
            <button onClick={getMoreAppreciations}>View {appreciation.replyCount} replies</button> : null}

        </section>
        <div className='more-appreciations'>
          {
            showReply && appreciationsReply.map(reply => (
              <Replys deletedAppreciation={handleDeleteAppreciation} data={reply} replyAppreciation={true} setDataReply={setData} />
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

        <PostRateForm isReply={!isEdit} isEdit={isEdit} data={dataModal} setData={setData} closeModal={() => setIsOpenModal(false)} />
      </ReactModal>
      <ReactModal
        isOpen={isOpenModalHistory}
        style={customStyles}
        onRequestClose={() => setIsOpenModalHistory(false)}
        contentLabel='Modal'
        portalClassName='modal-portal'
        className='modal-portal-content small-width'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'>

        <HistoryAppreciation data={appreciation?.histories ?? []} closeModal={() => setIsOpenModalHistory(false)} />
      </ReactModal>
    </>
  );
};
