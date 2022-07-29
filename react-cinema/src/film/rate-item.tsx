import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { StringMap } from 'uione';
import '../rate.css';
import { FilmRate, UsefulFilm } from '../film/service/film';
import { useFilmRateComment, useFilmRate } from '../film/service';
import like from '../assets/images/like.svg';
import likeFilled from '../assets/images/like_filled.svg';
import { OnClick } from 'react-hook-core';
import { storage } from 'uione';
import { Rate, RateComment, RateCommentFilter } from './service/rate';
import { CommentItem } from './comment-item';

interface Props {
  data: any;
  maxLengthReviewText: number;
  resource: StringMap;
}
export const RateItem = ({ data, maxLengthReviewText, resource }: Props) => {
  const renderReviewStar = (value: any) => {
    const starList = Array(5).fill(<i />).map((item, index) => {
      return (<i key={index}></i>)
    });
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

  return (
    <li className='col s12 m12 l12 review-custom'>
      <section className='card'>
        <p>{moment(data.rateTime).format('DD/MM/YYYY')}</p>
        {renderReviewStar(data.rate)}
        {formatReviewText(data.review ?? '')}
        <p>
          <img alt='' className='useful-button' width={20} src={like} />
          {data.usefulCount ? data.usefulCount : 0}</p>
      </section>
    </li>
  );
};

interface PropsRate {
  data: any;
  maxLengthReviewText: number;
  resource: StringMap;
  load: any;
  removeUsefulReaction: any;
  usefulReaction: any;
}

export const RateItemFilm = ({ data, maxLengthReviewText, resource, load, removeUsefulReaction, usefulReaction }: PropsRate) => {
  const [more, setMore] = useState(false);
  const [hideReplies, setHideReplies] = useState(false);
  const [pageSize, setPageSize] = useState(3);
  const [hideComment, setHideComment] = useState(false);
  const [input, setInput] = useState('');
  const [replies, setReplies] = useState<RateComment[]>([]);
  const userId: string | undefined = storage.getUserId();
  const rateService = useFilmRate();
  const ratecommentService = useFilmRateComment();

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
      const a = <span>{resource.review} {textSub} <span className='more-reviews' onClick={() => setMore(!more)}>More</span></span>;
      return a;
    } else {
      return <span>{resource.review} {text}</span>;
    }
  };

  const showComments = async (e: OnClick, data: Rate) => {
    setHideComment(false);
    setHideReplies(!hideReplies);
    const replyFilter = new RateCommentFilter();
    replyFilter.id = data.id;
    replyFilter.author = data.author;
    replyFilter.limit = pageSize;
    replyFilter.sort = '-time';
    const searchResult = await ratecommentService.search(replyFilter, pageSize);
    setReplies(searchResult.list)
  }

  const updateComment = async (e: OnClick, input: any, comment: RateComment, setIsModalOpen: any, setShowActions: any) => {
    if (comment.userId !== userId) {
      return storage.alert("...");
    } else {
      const commentId = comment.commentId || '';
      const id = comment.id || '';
      const author = comment.author || '';
      const newComment: RateComment = { commentId, id, author, userId, comment: input, time: new Date() };
      await rateService.updateComment(newComment);
      setIsModalOpen(false);
      setShowActions(false);
      showComments(e, comment);
    }
  }

  const removeComment = async (e: OnClick, comment: RateComment) => {
    const commentId = comment.commentId || '';
    const author = comment.author || '';
    await rateService.removeComment(commentId, author).then(res => {
      if (res > 0) {
        storage.message("Removed successfully!")
        setHideReplies(false);
        showComments(e, comment);
      }
    })
  }


  const moreReply = async (e: any, data: RateComment) => {
    setHideReplies(!hideReplies);
    const commentFilter = new RateCommentFilter();
    commentFilter.id = data.id;
    commentFilter.author = data.author;
    commentFilter.limit = pageSize + 3;
    commentFilter.sort = '-time';
    const reps = await ratecommentService.search(commentFilter, pageSize + 3);
    setReplies(reps.list);
    setPageSize(pageSize + 3);
    showComments(e, data);
  }

  const handleChangeAction = () => {
    setHideComment(!hideComment);
    setHideReplies(false);
  }

  const createReply = async (e: OnClick, data: Rate, input: string) => {
    console.log(data, input);
    const id = data.id || ''
    const author = data.author || '';
    if (!userId) {
      return storage.alert('You must sign in');;
    }
    const comment: RateComment = { id, author, userId, comment: input, time: new Date() };
    console.log(comment);

    const res = await rateService.comment(comment);
    console.log(res);
    if (res <= 0) {
      return;
    } else {
      storage.message('Your review is submited');
      setHideReplies(false);
      showComments(e, data);
    }

  }

  if (data) {
    return (
      <li className='col s12 m12 l12 review-custom'>
        <section className='card'>
          <p>{moment(data.time).format('DD/MM/YYYY')}</p>
          {renderReviewStar(data.rate)}
          {more ? <span>{data.review}</span> : formatReviewText(data.review ?? '')}
          <div className="footer">
            <div className="left">
              {data.disable === true ? <img alt='' className='useful-button' width={20} src={likeFilled} onClick={(e) => removeUsefulReaction(e, data)} /> : <img alt='' className='useful-button' width={20} src={like} onClick={(e) => usefulReaction(e, data)} />}
              {data.usefulCount ? data.usefulCount : 0}
            </div>
            <div className="right">
              <span className="btn-reply" onClick={() => handleChangeAction()}>Comment</span>
              <span className="btn-reply" onClick={(e) => showComments(e, data)} >Replies</span>
            </div>
          </div>
        </section>
        {hideReplies ? <>
          {replies && replies.length > 0 &&
            (replies.map((cmt: RateComment, i) => {
              return <CommentItem cmt={cmt} removeComment={removeComment} updateComment={updateComment} key={i} />
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
        </>
          : null}

        {hideComment ? <div className="comments-container">
          <div className="post-comment-container">
            <div className="post-comment">
              <textarea placeholder="type comment here..." className="comment" value={input}
                onChange={(e) => setInput(e.target.value)} />
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
        </div> : null}
      </li>
    );
  }
  return (
    <span >

    </span>
  )
};
