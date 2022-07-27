import React, { useMemo, useState } from 'react';
import { buildId } from 'react-hook-core';
import { useParams } from 'react-router-dom';
import { storage } from 'uione';
import { useReplyService, useAppreciationService } from './service';
import { Appreciation } from './service/appreciation';
import { Reply } from './service/appreciation-reply';

interface Props {
  closeModal: () => void;
  setData: (data: Appreciation | Reply) => void;
  data?: Appreciation | Reply;
  isReply: boolean;
  isEdit: boolean
}

export const PostRateForm = ({ closeModal, setData, data, isReply, isEdit }: Props) => {
  const [title, setTitle] = useState(data?.title ?? '');
  const [description, setDescription] = useState(data?.review ?? '');
  const appreciationService = useAppreciationService();
  const appreciationReplyService = useReplyService();

  const params = useParams();

  const postReview = async (event: any) => {
    const userId = buildId<string>(params) || '';
    event.preventDefault();
    const id: string | undefined = storage.getUserId();
    if (!appreciationService) { closeModal(); return; }
    if (!isReply) {
      const dataReq: Appreciation = {
        id: userId,
        author: id || '',
        title,
        review: description,
      };
      if (!isEdit) {
        const rs = await appreciationService.insert(dataReq);
        const newAppreciation0: Appreciation = (rs as any)['value'];
        setData(newAppreciation0);
      }
      else if(data) {
        const rs = await appreciationService.update(dataReq);
        if (rs === 1) {
          const histories = data.histories ? data.histories : []
          histories.push({ review: data.review, time: data.time!,title:data.title })
          dataReq.histories=histories
          setData(dataReq);
        }
      }
      closeModal();
      return;
    }
    if (!appreciationReplyService || !data) { closeModal(); return; }
    const appreciation: Reply = {
      userId: id,
      author: data.author,
      title,
      review: description,
      id: data.id
    };
    await appreciationReplyService?.insertReply(appreciation);
    const newAppreciation: Reply = (data as any)['value'];
    setData(newAppreciation);
    closeModal();
    return;
  };
  const headerText = useMemo(() => {
    return (isEdit ? "Update" : "Create") + " Appreciation"
  }, [isEdit])
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
          <h2>{headerText}</h2>
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
