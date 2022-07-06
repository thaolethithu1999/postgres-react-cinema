import  { useState, useEffect } from 'react';
import { storage } from 'uione';
import { Item } from './service';
import { Comment } from '../comment/service/comment';
import { useComment } from '../comment/service';

interface Props {
  closeModal: () => void;
  setData: (data: Comment ) => void;
  data?: Item | null | undefined;
}

export const ItemCommentForm = (props: Props) => {
  const [item, setItem] = useState<Item | null | undefined>();
  const [comment, setComment] = useState('');
  const CommentService = useComment();

  useEffect(() => {
    setItem(props.data);
  }, [props.data]);

  const closeModal = () => {
    props.closeModal();
  };
  
  const postReview = async (event: any) => {
    // const item = buildId<string>(params) || '';
    event.preventDefault();
    const id: string | undefined = storage.getUserId();
    if (!CommentService) { closeModal(); return; }
    if (item) {
      const dataComment: Comment = {
        id: item?.id,
        author: id || '',
        comment
      };
      const data0 = await CommentService.insert(dataComment);
      const newComment: Comment = (data0 as any)['value'];
      props.setData(newComment);
      closeModal();
      return;
    }

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
          <h2>Comment Item</h2>
        </header>
        <div>
          <section className='section-appreciate'>
            <textarea style={{ height: 140 }} className='input-appreciate' placeholder='Comment' value={comment} onChange={e => setComment(e.target.value)} />
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
