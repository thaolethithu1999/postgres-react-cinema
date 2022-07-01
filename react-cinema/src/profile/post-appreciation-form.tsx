import React, { useState } from 'react';
import { buildId } from 'react-hook-core';
import { useParams } from 'react-router-dom';
import { storage } from 'uione';
import { useAppreciationReplyService, useAppreciationService } from './service';
import { Appreciation } from './service/appreciation';
import { AppreciationReply } from './service/appreciation-reply';

interface Props {
  closeModal: () => void;
  setData: (data: Appreciation | AppreciationReply) => void;
  data?: Appreciation | AppreciationReply;
  replyAppreciation: boolean;
}

export const PostRateForm = (props: Props) => {
  const [review, setReview] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const appreciationService = useAppreciationService();
  const appreciationReplyService = useAppreciationReplyService();
  const closeModal = () => {
    props.closeModal();
  };
  const params = useParams();
  const handleChange = (event: any) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setReview(value);
  };
  const renderRateStar = (value: any) => {
    let list5 = Array(5);
    list5 = list5.fill(<i />).map((item, index )=>{
      return (<i key={index}></i>)
    });
    const listClass = [];
    for (let i = 1; i <= value; i++) {
      listClass.push(`star-${i}`);
    }
    const longClass = listClass.join(' ');
    const divStar = <div className={`rv-star3 ${longClass}`}>{list5}</div>;
    return divStar;
  };
  const postReview = async (event: any) => {
    const userId = buildId<string>(params) || '';
    event.preventDefault();
    const id: string | undefined = storage.getUserId();
    if (!appreciationService) { closeModal(); return; }
    if (!props.data) {
      const appreciation0: Appreciation = {
        userId,
        authorId: id || '',
        title,
        description,
        usefulCount: 0,
        replyCount: 0,
        createdAt: '2001-09-27T17:00:00.000Z',
      };
      const data0 = await appreciationService.insert(appreciation0);
      const newAppreciation0: Appreciation = (data0 as any)['value'];
      props.setData(newAppreciation0);
      closeModal();
      return;
    }
    if (!appreciationReplyService) { closeModal(); return; }
    const appreciation: AppreciationReply = {
      userId,
      authorId: id || '',
      title,
      description,
      usefulCount: 0,
      replyCount: 0,
      createdAt: '2001-09-27T17:00:00.000Z',
      appreciationId: props.replyAppreciation ? (props.data as any).appreciationId : props.data.id
    };
    const data = await appreciationReplyService?.insertReply(appreciation);
    const newAppreciation: AppreciationReply = (data as any)['value'];
    props.setData(newAppreciation);
    closeModal();
    return;
  };
  return (
    <div className='view-container'>
      <form
        id='addNewRate'
        name='addNewRate'
        model-name='addNewRate'
      // ref="form"
      >
        <header>
          <button
            type='button'
            id='btnClose'
            name='btnClose'
            className='btn-close'
            onClick={() => closeModal()}
          />
          <h2>Appreciation</h2>
        </header>
        <div>
          <section className='section-appreciate'>
            <input type={'text'} className='input-appreciate' placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
            <textarea style={{ height: 140 }} className='input-appreciate' placeholder='Description' value={description} onChange={e => setDescription(e.target.value)} />
          </section>
        </div>
        <footer>
          <button
            type='submit'
            id='btnSave'
            name='btnSave'
            onClick={(event) => postReview(event)}
          >
            Post
          </button>
        </footer>
      </form>
    </div>
  );
};
