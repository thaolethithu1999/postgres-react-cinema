import moment from 'moment';
import { useState, useEffect } from 'react';
import { StringMap } from 'uione';
import '../rate.css';
import { FilmRate, UsefulFilm } from '../film/service/film';
import { useFilmRate } from '../film/service';
import like from '../assets/images/like.svg';
import likeFilled from '../assets/images/like_filled.svg';
import { OnClick } from 'react-hook-core';
import { storage } from 'uione';
import { Rate } from './service/rate';
import { useRate, useRateComment } from './service';
import { RateComment, RateCommentFilter } from './service/rate/rate';
import { KeyObject } from 'crypto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faCircle, faUser, faUserCircle, faPencil, faEllipsis, faEllipsisVertical, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CommentItem } from './comment-item';

interface Props {
  data: any;
  maxLengthReviewText: number;
  resource: StringMap;
  usefulReaction?: any;
  removeUsefulReaction?: any;
  load: any;
}
export const RateItem = ({ data, maxLengthReviewText, resource, usefulReaction, removeUsefulReaction, load }: Props) => {
  const userId: string | undefined = storage.getUserId() || '';
  const [hide, setHide] = useState(false);
  const [hideComment, setHideComment] = useState(false);
  const [input, setInput] = useState('');
  const [replies, setReplies] = useState<RateComment[]>([]);
  const [pageSize, setPageSize] = useState(3);
  const [more, setMore] = useState(false);
  const rateService = useRate();
  const commentService = useRateComment();
  const username = storage.username();

  const renderReviewStar = (value: any) => {
    const starList = Array(5).fill(<i />).map((item, index) => {
      return (<i key={index}></i>)
    });
    const classes = Array.from(Array(value).keys()).map(i => `star-${i + 1}`).join(' ');
    return <div className={`rv-star2 ${classes}`}>{}</div>;
  };

  const formatReviewText = (text: string) => {
    if (text && text.length > maxLengthReviewText) {
      let textSub = text.substring(0, maxLengthReviewText);
      textSub = textSub + ' ...';
      console.log({ textSub });
      const a = <span>{resource.review} {textSub} <span className='more-reviews' onClick={(e) => setMore(!more)}>More</span></span>;
      return a;
    } else {
      return <span>{resource.review} {text}</span>;
    }
  };

  const createReply = async (e: OnClick, rate: Rate, input: any) => {
    const id = rate.id || '';
    const author = rate.author || '';
    const userId: string | undefined = storage.getUserId();
    if (!userId) {
      return storage.alert('You must sign in');;
    }
    const comment: RateComment = { id, author, userId, comment: input, time: new Date() };
    const rs = await rateService.comment(comment);
    if (rs === false) {
      return;
    } else {
      storage.message('Your review is submited');
      setHide(false);
      showComments(e, data);
    }
  }

  const showComments = async (e: OnClick, data: Rate) => {
    setHide(!hide);
    setHideComment(false);
    const replyFilter = new RateCommentFilter();
    replyFilter.id = data.id;
    replyFilter.author = data.author;
    replyFilter.limit = pageSize;
    replyFilter.sort = '-time';
    const reps = await commentService.search(replyFilter, pageSize);
    setReplies(reps.list);
  }

  const updateComment = async (e: OnClick, input: any, comment: RateComment) => {
    if (comment.userId !== userId) {
      return storage.alert("...");
    } else {
      const commentId = comment.commentId || '';
      const id = comment.id || '';
      const author = comment.author || '';
      const newComment: RateComment = { commentId, id, author, userId, comment: input, time: new Date() };
      await rateService.updateComment(newComment);
      showComments(e, comment);
    }
  }

  const removeComment = async (e: OnClick, comment: RateComment) => {
    const commentId = comment.commentId || '';
    const author = comment.author || '';
    await rateService.removeComment(commentId, author).then(res => {
      if (res > 0) {
        storage.message("Removed successfully!")
        showComments(e, comment);
      }
    })
  }

  const handleChange = (e: any) => {
    e.preventDefault();
    setInput(e.target.value);
  }

  const moreReply = async (e: any, data: RateComment) => {
    setHide(!hide);
    const commentFilter = new RateCommentFilter();
    commentFilter.id = data.id;
    commentFilter.author = data.author;
    commentFilter.limit = pageSize + 3;
    commentFilter.sort = '-time';
    const reps = await commentService.search(commentFilter, pageSize + 3);
    setReplies(reps.list);
    setPageSize(pageSize + 3);
    showComments(e, data);
  }

  return (
    <li className='col s12 m12 l12 review-custom'>
      <section className='card'>
        {data.author === userId ?
          <p>{moment(data.time).format('DD/MM/YYYY')}<FontAwesomeIcon icon={faCircle} color="lightgreen" size="xs" /></p> :
          <p>{moment(data.time).format('DD/MM/YYYY')}</p>}
        {renderReviewStar(data.rate)}

        {more ? <span>{data.review}</span> : formatReviewText(data.review ?? '')}
        <div className="footer">
          <div className="left">
            {data.disable === true ? <img alt='' className='useful-button' width={20} src={likeFilled} onClick={(e) => removeUsefulReaction(e, data)} /> : <img alt='' className='useful-button' width={20} src={like} onClick={(e) => usefulReaction(e, data)} />}
            {data.usefulCount ? data.usefulCount : 0}
          </div>
          <div className="right">
            <span className="btn-reply" onClick={(e) => showComments(e, data)}>Replies</span>
          </div>
        </div>
      </section>
      {hide ? <>
        {replies && replies.length > 0 &&
          (replies.map((cmt: RateComment, i) => {
            return <CommentItem cmt={cmt} userId={userId} removeComment={removeComment} updateComment={updateComment} />
          })) || ''
        }
        {replies && replies.length >= 3 && (
          <div className="comments-container">
            <div className='col more-replies-div'>
              <span className='more-replies' onClick={(e) => moreReply(e, data)}>
                <b>MORE REVIEWS</b>
              </span>
            </div>
          </div>)}
        {hideComment ? null : <div className="comments-container">
          <div className="post-comment-container">
            <div className="post-comment">
              <textarea placeholder="type comment here..." className="comment" value={input}
                onChange={(e) => handleChange(e)} />
              <div className="btn-area">
                {input.length > 0 ? <>
                  <span className="btn-post" onClick={() => { setHideComment(!hideComment) }} >Cancel</span>
                  <span className="btn-post value" onClick={(e) => createReply(e, data, input)}>Post</span>
                </> : <>
                  <span className="btn-post" onClick={() => { setHideComment(!hideComment) }} >Cancel</span>
                  <span className="btn-post" onClick={(e) => createReply(e, data, input)}>Post</span>
                </>}
              </div>
            </div>
          </div>
        </div>}
      </>
        : null}
    </li>
  );
};

interface PropsRate {
  data: FilmRate;
  maxLengthReviewText: number;
  resource: StringMap;
}

export const RateItemFilm = ({ data, maxLengthReviewText, resource }: PropsRate) => {
  const [rate, setRate] = useState<FilmRate>();
  const FilmRateService = useFilmRate();

  useEffect(() => {
    checkUseful(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderReviewStar = (value: any) => {
    const starList = Array(10).fill(<i />).map((item, index) => {
      return (<i key={index}></i>)
    });;
    const classes = Array.from(Array(value).keys()).map(i => `star-${i + 1}`).join(' ');
    return <div className={`rv-star2 ${classes}`}>{starList}</div>;
  };

  const formatReviewText = (text: string) => {
    if (text && text.length > maxLengthReviewText) {
      let textSub = text.substring(0, maxLengthReviewText);
      textSub = textSub + ' ...';
      const a = <span>{resource.review} {textSub} <span className='more-reviews'>More</span></span>;
      return a;
    } else {
      return <span>{resource.review} {text}</span>;
    }
  };

  const postUseful = async (e: OnClick, comment: FilmRate) => {
    let rs;
    const useful: UsefulFilm = {
      id: comment.id || '',
      author: storage.getUserId() || ''
    };
    if (FilmRateService) {
      rs = await FilmRateService.usefulFilm(useful);
    }
    if (rs === 2) {// 2:Delete 1:Insert
      setRate({ ...comment, isUseful: false, usefulCount: (comment.usefulCount ? comment.usefulCount : 0) - 1 });
    } else { setRate({ ...comment, isUseful: true, usefulCount: (comment.usefulCount ? comment.usefulCount : 0) + 1 }); }
  };

  const checkUseful = async (rate: FilmRate): Promise<void> => {
    try {
      const useful: UsefulFilm = {
        id: rate.id || '',
        author: storage.getUserId() || ''
      };

      const result = await FilmRateService.usefulSearch(useful);
      if (result === 1) {
        rate.isUseful = true;
      }
      setRate(rate);

    } catch (err) {

    }
  };


  if (rate) {
    return (
      <li className='col s12 m12 l12 review-custom'>
        <section className='card'>
          <p>{moment(rate.rateTime).format('DD/MM/YYYY')}</p>
          {renderReviewStar(rate.rate)}
          {formatReviewText(rate.review ?? '')}
          <p>
            {rate.isUseful ? <img alt='' className='useful-button' width={20} src={likeFilled} onClick={(e) => postUseful(e, rate)} /> : <img alt='' className='useful-button' width={20} src={like} onClick={(e) => postUseful(e, rate)} />}
            {rate.usefulCount ? rate.usefulCount : 0} </p>
        </section>
      </li>
    );
  }
  return (
    <span >

    </span>
  )
};
