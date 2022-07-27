import { useState } from "react";
import { StringMap } from "uione";
import "./response.css";
import like from "../assets/images/like.svg";
import likeFilled from "../assets/images/like_filled.svg";
import { OnClick } from "react-hook-core";
import { storage } from "uione";
import { useResponse, useResponseComment } from "./service";
import {
  Response,
  ResponseComment,
  ResponseCommentFilter,
} from "./service/response";

import { CommentItem } from "./comment-item";

interface Props {
  data: any;
  maxLengthDescriptionText: number;
  resource: StringMap;
  usefulReaction?: any;
  removeUsefulReaction?: any;
  load: any;
}
export const ResponseItem = ({
  data,
  maxLengthDescriptionText,
  resource,
  usefulReaction,
  removeUsefulReaction,
  load,
}: Props) => {
  const userId: string | undefined = storage.getUserId() || "";
  const [hide, setHide] = useState(false);
  const [hideComment, setHideComment] = useState(false);
  const [input, setInput] = useState("");
  const [replies, setReplies] = useState<ResponseComment[]>([]);
  const [pageSize, setPageSize] = useState(3);
  const [more, setMore] = useState(false);
  const responseService = useResponse();
  const commentService = useResponseComment();

  const formatDescriptionText = (text: string) => {
    if (text && text.length > maxLengthDescriptionText) {
      let textSub = text.substring(0, maxLengthDescriptionText);
      textSub = textSub + " ...";
      console.log({ textSub });
      const a = (
        <span>
          {resource.review} {textSub}{" "}
          <span className="more-reviews" onClick={(e) => setMore(!more)}>
            More
          </span>
        </span>
      );
      return a;
    } else {
      return (
        <span>
          {resource.review} {text}
        </span>
      );
    }
  };

  const createReply = async (e: OnClick, response: Response, input: any) => {
    const id = response.id || "";
    const author = response.author || "";
    const userId: string | undefined = storage.getUserId();
    if (!userId) {
      return storage.alert("You must sign in");
    }
    const comment: ResponseComment = {
      id,
      author,
      userId,
      comment: input,
      time: new Date(),
    };
    const rs = await responseService.comment(comment);
    if (rs === false) {
      return;
    } else {
      storage.message("Your review is submited");
      setHide(false);
      showComments(e, data);
    }
  };

  const showComments = async (e: OnClick, data: Response) => {
    setHide(!hide);
    setHideComment(false);
    const replyFilter = new ResponseCommentFilter();
    replyFilter.id = data.id;
    replyFilter.author = data.author;
    replyFilter.limit = pageSize;
    replyFilter.sort = "-time";
    const reps = await commentService.search(replyFilter, pageSize);
    setReplies(reps.list);
  };

  const updateComment = async (
    e: OnClick,
    input: any,
    comment: ResponseComment
  ) => {
    if (comment.userId !== userId) {
      return storage.alert("...");
    } else {
      const commentId = comment.commentId || "";
      const id = comment.id || "";
      const author = comment.author || "";
      const newComment: ResponseComment = {
        commentId,
        id,
        author,
        userId,
        comment: input,
        time: new Date(),
      };
      await responseService.updateComment(newComment);
      showComments(e, comment);
    }
  };

  const removeComment = async (e: OnClick, comment: ResponseComment) => {
    const commentId = comment.commentId || "";
    const author = comment.author || "";
    await responseService.removeComment(commentId, author).then((res) => {
      if (res > 0) {
        storage.message("Removed successfully!");
        showComments(e, comment);
      }
    });
  };

  const handleChange = (e: any) => {
    e.preventDefault();
    setInput(e.target.value);
  };

  const moreReply = async (e: any, data: ResponseComment) => {
    setHide(!hide);
    const commentFilter = new ResponseCommentFilter();
    commentFilter.id = data.id;
    commentFilter.author = data.author;
    commentFilter.limit = pageSize + 3;
    commentFilter.sort = "-time";
    const reps = await commentService.search(commentFilter, pageSize + 3);
    setReplies(reps.list);
    setPageSize(pageSize + 3);
    showComments(e, data);
  };

  return (
    <li className="col s12 m12 l12 review-custom">
      <section className="card">
        {more ? (
          <span>{data.description}</span>
        ) : (
          formatDescriptionText(data.description ?? "")
        )}
        <div className="footer">
          <div className="left">
            {data.disable === true ? (
              <img
                alt=""
                className="useful-button"
                width={20}
                src={likeFilled}
                onClick={(e) => removeUsefulReaction(e, data)}
              />
            ) : (
              <img
                alt=""
                className="useful-button"
                width={20}
                src={like}
                onClick={(e) => usefulReaction(e, data)}
              />
            )}
            {data.usefulCount ? data.usefulCount : 0}
          </div>
          <div className="right">
            <span className="btn-reply" onClick={(e) => showComments(e, data)}>
              Replies
            </span>
          </div>
        </div>
      </section>
      {hide ? (
        <>
          {(replies &&
            replies.length > 0 &&
            replies.map((cmt: ResponseComment, i) => {
              return (
                <CommentItem
                  cmt={cmt}
                  userId={userId}
                  removeComment={removeComment}
                  updateComment={updateComment}
                />
              );
            })) ||
            ""}
          {replies && replies.length >= 3 && (
            <div className="comments-container">
              <div className="col more-replies-div">
                <span
                  className="more-replies"
                  onClick={(e) => moreReply(e, data)}
                >
                  <b>MORE REVIEWS</b>
                </span>
              </div>
            </div>
          )}
          {hideComment ? null : (
            <div className="comments-container">
              <div className="post-comment-container">
                <div className="post-comment">
                  <textarea
                    placeholder="type comment here..."
                    className="comment"
                    value={input}
                    onChange={(e) => handleChange(e)}
                  />
                  <div className="btn-area">
                    {input.length > 0 ? (
                      <>
                        <span
                          className="btn-post"
                          onClick={() => {
                            setHideComment(!hideComment);
                          }}
                        >
                          Cancel
                        </span>
                        <span
                          className="btn-post value"
                          onClick={(e) => createReply(e, data, input)}
                        >
                          Post
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          className="btn-post"
                          onClick={() => {
                            setHideComment(!hideComment);
                          }}
                        >
                          Cancel
                        </span>
                        <span
                          className="btn-post"
                          onClick={(e) => createReply(e, data, input)}
                        >
                          Post
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </li>
  );
};

