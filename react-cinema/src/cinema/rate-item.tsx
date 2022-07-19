import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { StringMap } from 'uione';
import '../rate.css';
import { FilmRate, UsefulFilm } from '../film/service/film';
import { useFilmRate } from '../film/service';
import like from '../assets/images/like.svg';
import likeFilled from '../assets/images/like_filled.svg';
import { OnClick } from 'react-hook-core';
import { storage } from 'uione';
import { Rate, Reply } from './service/rate';
import { useRate, useReply } from './service';

interface Props {
  data: any;
  maxLengthReviewText: number;
  resource: StringMap;
  usefulReaction?: any;
  removeUsefulReaction?: any;
}
export const RateItem = ({ data, maxLengthReviewText, resource, usefulReaction, removeUsefulReaction }: Props) => {
  const userId: string | undefined = storage.getUserId();
  const [hide, setHide] = useState(false);
  const [input, setInput] = useState('');
  const [replies, setReplies] = useState<Reply[]>();

  const rateService = useRate();
  const replyService = useReply();

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
      const a = <span>{resource.review} {textSub} <span className='more-reviews'>More</span></span>;
      return a;
    } else {
      return <span>{resource.review} {text}</span>;
    }
  };

  const createReply = async (e: OnClick, rate: Rate, input: any, setHide: any) => {
    const id = rate.id || '';
    const author = rate.author || '';
    const userId: string | undefined = storage.getUserId();
    if (!userId) {
      return storage.alert('You must sign in');;
    }
    const reply: Reply = { id, author, userId, review: input, time: new Date() };
    const rs = await rateService.reply(reply);
    if (rs === false) {
      return;
    } else {
      storage.message('Your review is submited');
      setHide(false);
      showReply(e, data);
    }

  }

  const showReply = async (e: OnClick, data: Rate) => {
    setHide(!hide);
    const id = data.id;
    const author = data.author;
    const replySearch: any = { id, author };
    const reps = await replyService.search(replySearch);
    setReplies(reps.list);
  }

  const editReply = async (e: OnClick, input: any, reply: Reply) => {
    if (reply.userId !== userId) {
      return storage.alert("...");
    } else {
      const id = reply.id;
      const author = reply.author;
      const newReply: Reply = { id, author, userId, review: input, time: new Date() };
      await rateService.updateReply(newReply);
      showReply(e, reply);
    }
  }

  const removeReply = async (e: OnClick, reply: Reply) => {
    const id = reply.id || '';
    const author = reply.author || '';
    const userId = reply.userId || '';
    await rateService.removeReply(id, author, userId).then(res =>{
      if(res > 0){
        storage.message("Removed successfully!")
        showReply(e, reply);
      }
    })

  }

  const handleChange = (e: any) => {
    e.preventDefault();
    setInput(e.target.value);
  }

  return (
    <li className='col s12 m12 l12 review-custom'>
      <section className='card'>
        <p>{moment(data.rateTime).format('DD/MM/YYYY')}</p>
        {renderReviewStar(data.rate)}
        {formatReviewText(data.review ?? '')}
        <p>
          {data.disable === true ? <img alt='' className='useful-button' width={20} src={likeFilled} onClick={(e) => removeUsefulReaction(e, data)} /> : <img alt='' className='useful-button' width={20} src={like} onClick={(e) => usefulReaction(e, data)} />}
          {data.usefulCount ? data.usefulCount : 0}
          <span className="btn-reply" id="btn-reply" onClick={(e) => showReply(e, data)}>Reply</span>
        </p>
      </section>
      {hide ? <>
        {replies && replies.length > 0 &&
          (replies.map((rep: Reply, i) => {
            return <>
              <section className='reply-card' id="reply-card">
                <p>{moment(rep.time).format('DD/MM/YYYY')}</p>
                {rep.author === userId ?
                  <input
                    id="input-review"
                    type='text'
                    placeholder="..."
                    maxLength={255}
                    defaultValue={rep.review}
                    value={undefined}
                    onChange={e => handleChange(e)}
                  /> : <input
                    id="input-review-disable"
                    type='text'
                    maxLength={255}
                    value={rep.review} />}

                {rep.author === userId ? <div className="btn-edit-reply" onClick={(e) => editReply(e, input, rep)}>Save</div> : null}
                {rep.author === userId ? <div className="btn-delete-reply" onClick={(e) => removeReply(e, rep)}>Delete</div> : null}
              </section>
            </>
          })) || ''
        }
        <section className='reply-card' id="reply-card">
          <input
            type='text'
            placeholder="..."
            maxLength={255}
            onChange={(e) => handleChange(e)}
          />
          <div className="btn-post-reply" onClick={(e) => createReply(e, data, input, setHide)}>Post</div>
        </section>
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
  console.log(rate);

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
