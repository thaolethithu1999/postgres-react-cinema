import { faEllipsisVertical, faPencil, faTrash, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PostCommentForm } from './post-comment-form';
import { RateComment } from './service/rate';
import { useState } from 'react';
import { storage } from 'uione';
import moment from 'moment';
import '../rate.css';

export interface Props {
  cmt: RateComment;
  removeComment: any;
  updateComment: any;
  key: any;
}

export const CommentItem = ({ cmt, removeComment, updateComment , key }: Props) => {
  const [showActions, setShowActions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId: string | undefined = storage.getUserId();
  return (
    <>
      <div className="comments-container" key={key}>
        <div className="comments2">
          <div className="avatar"><FontAwesomeIcon icon={faUserCircle} size="2x" color="lightgrey" /></div>
          <div className="content">
            <div className="header">
              <p className="username">Anonymous</p>
              <p className="time">{moment(cmt.time).format('DD/MM/YYYY')}</p>
            </div>
            <p className="comment">{cmt.comment}</p>
          </div>
          {cmt.userId === userId ? <>
            <div className="action" onClick={() => setShowActions(!showActions)}>
              <span><FontAwesomeIcon icon={faEllipsisVertical} /></span>
            </div>
            {showActions ?
              <div className="actions">
                <div className="btn-edit-comment" onClick={() => setIsModalOpen(!isModalOpen)}>
                  <p><FontAwesomeIcon icon={faPencil} color="grey" /></p>
                  <span>Edit</span>
                </div>
                <div className="btn-delete-comment" onClick={(e) => removeComment(e, cmt)}>
                  <p><FontAwesomeIcon icon={faTrash} color="grey" /></p>
                  <span>Delete</span>
                </div>
              </div> : null}
          </> : null}
        </div>
      </div>
      {isModalOpen ? 
      <PostCommentForm
        cmt={cmt}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        close={() => setIsModalOpen(false)} 
        updateComment={updateComment}
        setShowActions={setShowActions}
        /> : null}
    </>
  )
}
