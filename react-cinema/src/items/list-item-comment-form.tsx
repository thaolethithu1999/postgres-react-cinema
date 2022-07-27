import moment from 'moment';
import { useEffect, useState } from 'react';
import { OnClick } from 'react-hook-core';
import ReactModal from 'react-modal';
import { storage } from 'uione';
import { useComment } from '../comment/service';
import { Comment, CommentFilter } from '../comment/service/comment';
import { Item } from './service';
import { ItemCommentForm } from './item-comment-form';

interface Props {
  data: Item | null | undefined ;
}

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

export const ListCommentItem = ({ data}: Props) => {
  const commentService = useComment();
  const [comment, setComment] = useState<Comment[]>([]);
  const [item, setItem] = useState<Item | null | undefined>();
  const [maxLengthReviewText] = useState(210);
  const [resource] = useState(storage.resource().resource());
  const [showmore, setShowmore] = useState(false);
  const [limit, setLimit] = useState(3);
  const [offset, setOffset] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);
  useEffect(() => {
    setItem(data);
    loadComment(data?.id, limit);
  }, [data]);


  const loadComment = async (id: string | undefined, limit: number) => {
    if(id)
    {
      const filter: CommentFilter = {
        id: id
      };
      const rs = await commentService.search(filter,limit);
  
      if(rs)
      {
        setComment(rs.list);
      }
    }
    
    return;
    
  }

  const handleShow = (e: OnClick, isShow: boolean) => {
    e.preventDefault();
    setShowmore(isShow);
  };

  const openModal = async (e: OnClick) => {
    e.preventDefault();
    setIsOpenModal(true);
  };

  const setData = (com: Comment) => {
    if (comment) {
      const newList = [com, ...comment];
      
      setComment(newList);
      return;
    }
    else
    {
      setComment([com]);
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

  const moreComment = async (e: any) => {
    if (!useComment) { return; }
    e.preventDefault();
    
    loadComment(item?.id, limit + 3);
    setLimit(limit + 3);
  };

  return (
    <> 
    <div className='row top-content sort-content'>
          <section className='section-appreciate'>
            <button onClick={openModal}>Comment</button>
          </section>
        </div>


        <div className='title'>
          <span><b>{resource.reviews}</b></span>
        </div>
        <ul className='row list-view'>
        {comment && comment.length > 0 && comment.map((com, i) => {
                return (
                  <li className='col s12 m12 l12 review-custom'>
                  <section className='card item-comment'>
                    <h4>{formatReviewText(com.comment ?? '')}</h4>
                    <p>{moment(com.createdat).format('DD/MM/YYYY')}</p>
                    
                  </section>
                  </li>
                );
              })}
         
          
        </ul>
          <div className='col s12 m12 l12 more-reviews-div'>
            <span className='more-reviews' onClick={moreComment}>
              <b>MORE REVIEWS</b>
            </span>
            </div>
    
      <ReactModal
        isOpen={isOpenModal}
        style={customStyles}
        onRequestClose={() => setIsOpenModal(false)}
        contentLabel='Modal'
        portalClassName='modal-portal'
        className='modal-portal-content small-width'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'>

        <ItemCommentForm  data={data} setData={setData} closeModal={() => setIsOpenModal(false)} />
      </ReactModal>
    </>
  );
};
