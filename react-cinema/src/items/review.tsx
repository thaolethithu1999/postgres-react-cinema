import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useParams } from "react-router-dom";
import { storage } from "uione";
import {
  DataPostResponse,
  PostResponseForm,
} from "../response/post-response-form";

import { useResponse } from "../response/service";
import {
  Response,
  ResponseComment,
  ResponseFilter,
} from "../response/service/response";
import "./item.css"
import ResponseList from "./responseList";

ReactModal.setAppElement("#root");

export const ItemReview = (item: any) => {
  const params = useParams();
  const [isOpenResponseModal, setIsOpenResponseModal] = useState(false);
  const [pageSize, setPageSize] = useState(3);
  const [responses, setResponses] = useState<Response[]>([]);
  const [replies, setReplies] = useState<ResponseComment[]>();
  const responseService = useResponse();
  const userId: string | undefined = storage.getUserId() || "";

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    const { id } = params;
    const itemResponseSM = new ResponseFilter();
    itemResponseSM.id = id || "";
    itemResponseSM.limit = pageSize;
    itemResponseSM.sort = "-time";
    itemResponseSM.userId = userId;
    const searchResult = await responseService.search(itemResponseSM, pageSize);
    setResponses(searchResult.list);
  };

  const postReview = async (data: DataPostResponse): Promise<void> => {
    try {
      const id: string | undefined = storage.getUserId();
      if (!id || !item) {
        return storage.alert("Please sign in to review");
      }
      const response: Response = {};
      response.id = item.item.id;
      response.author = id;
      response.description = data.description;
      response.time = new Date();
      let addResponse = await responseService.response(response);
      storage.message("Your review is submited");
      setIsOpenResponseModal(false);
      await load();
    } catch (err) {
      storage.alert("error");
    }
  };

  const handleOnclick = () => {
    setIsOpenResponseModal(!isOpenResponseModal);
  };
  // if (item && window.location.pathname.includes("review")) {
  return (
    <>
      <div className="row mid-content response-wrapper">
        <button
        className="button-response"
          onClick={() => {
            handleOnclick();
          }}
        >
          Response
        </button>
      </div>
      <ResponseList
        pageSize={pageSize}
        setPageSize={setPageSize}
        load={load}
        responses={responses}
        setResponses={setResponses}
        replies={replies}
        setReplies={setReplies}
      />
      <PostResponseForm
        name={item.title}
        close={() => setIsOpenResponseModal(false)}
        postResponse={postReview}
        isOpenResponseModal={isOpenResponseModal}
      />
    </>
  );
  // }
  // return <></>;
};
