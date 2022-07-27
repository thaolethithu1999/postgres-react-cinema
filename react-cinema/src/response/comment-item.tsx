import React, { useState } from "react";
import "./response.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faPencil,
  faEllipsisVertical,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { ResponseComment } from "./service/response";
import moment from "moment";
import { PostCommentForm } from "./post-comment-form";

export interface Props {
  cmt: ResponseComment;
  userId: string;
  removeComment: any;
  updateComment: any;
}

export const CommentItem = ({
  cmt,
  userId,
  removeComment,
  updateComment,
}: Props) => {
  const [showActions, setShowActions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="comments-container">
        <div className="comments2">
          <div className="avatar">
            <FontAwesomeIcon icon={faUserCircle} size="2x" color="lightgrey" />
          </div>
          <div className="content">
            <div className="header">
              <p className="username">Anonymous</p>
              <p className="time">{moment(cmt.time).format("DD/MM/YYYY")}</p>
            </div>
            <p className="comment">{cmt.comment}</p>
          </div>
          {cmt.userId === userId ? (
            <>
              <div
                className="action"
                onClick={() => setShowActions(!showActions)}
              >
                <span>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </span>
              </div>
              {showActions ? (
                <div className="actions">
                  <div
                    className="btn-edit-comment"
                    onClick={() => setIsModalOpen(!isModalOpen)}
                  >
                    <p>
                      <FontAwesomeIcon icon={faPencil} color="grey" />
                    </p>
                    <span>Edit</span>
                  </div>
                  <div
                    className="btn-delete-comment"
                    onClick={(e) => removeComment(e, cmt)}
                  >
                    <p>
                      <FontAwesomeIcon icon={faTrash} color="grey" />
                    </p>
                    <span>Delete</span>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
      {isModalOpen ? (
        <PostCommentForm
          cmt={cmt}
          isModalOpen={isModalOpen}
          close={() => setIsModalOpen(false)}
          updateComment={updateComment}
        />
      ) : null}
    </>
  );
};
