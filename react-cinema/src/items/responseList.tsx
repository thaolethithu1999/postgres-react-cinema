import { useEffect, useState, useRef } from "react";
import { storage } from "uione";
import { useParams } from "react-router-dom";
import { inputSearch } from "uione";
import { useResponse } from "../response/service";
import {
  OnClick,
  SearchComponentState,
  useSearch,
  value,
  PageSizeSelect,
} from "react-hook-core";
import {
  Response,
  ResponseComment,
  ResponseFilter,
} from "../response/service/response";
import { ResponseItem } from "../response/reponse-item";
import { Pagination } from "reactx-pagination";

export interface ResponseListInterface {
  pageSize: number;
  setPageSize: any;
  load: any;
  responses: Response[] | undefined;
  setResponses: any;
  replies: ResponseComment[] | undefined;
  setReplies: any;
}

interface ResponseSearch extends SearchComponentState<Response, ResponseFilter> {}

const ResponseList = (props: ResponseListInterface) => {
  const params = useParams();
  const { id } = params;

  const responseFilter: ResponseFilter = {
    id: id,
    author: "",
    description: "",
  };

  const initialState: ResponseSearch = {
    list: [],
    filter: responseFilter,
  };

  const {
    pageSize,
    setPageSize,
    load,
    responses,
    setResponses,
    replies,
    setReplies,
  } = props;

  const refForm = useRef();

  const {
    state,
    resource,
    component,
    updateState,
    search,
    sort,
    toggleFilter,
    clearQ,
    changeView,
    pageChanged,
    pageSizeChanged,
    setState,
  } = useSearch<Response, ResponseFilter, ResponseSearch>(
    refForm,
    initialState,
    useResponse(),
    inputSearch()
  );
  component.viewable = true;
  component.editable = true;

  const { list } = state;

  state.filter = {
    ...state.filter,
    id: id,
  };

  const backPage = () => {
    const page = component.pageIndex || 1;
    const size = component.pageSize || 24;
    if (page !== 1) {
      pageChanged({
        page: page - 1,
        size: size,
      });
    }
  };

  const nextPage = () => {
    const page = component.pageIndex || 1;
    const size = component.pageSize || 24;
    if (page < Math.ceil(Number(component.total) / size)) {
      pageChanged({
        page: page + 1,
        size: size,
      });
    }
  };

  const [maxLengthDescriptionText] = useState(1000);
  const responseService = useResponse();
  // const [resource] = useState(storage.resource().resource());
  const author: string | undefined = storage.getUserId();
  const [isUseful, setIsUseful] = useState();

  useEffect(() => {
    load();
  }, [setResponses]);

  const usefulReaction = async (e: OnClick, response: Response) => {
    console.log(response);
    const id = response.id || "";
    const author = response.author || "";
    const userId: string | undefined = storage.getUserId();
    if (!userId) {
      return;
    }
    const rs = await responseService.setUseful(id, author, userId);
    load();
  };

  const removeUseful = async (e: OnClick, response: Response) => {
    const id = response.id || "";
    const author = response.author || "";
    const userId: string | undefined = storage.getUserId();
    if (!userId) {
      return;
    }
    await responseService.removeUseful(id, author, userId);
    load();
  };

  return (
    <>
      <PageSizeSelect
        size={component.pageSize}
        sizes={component.pageSizes}
        onChange={pageSizeChanged}
      />
      <ul className="row list-view">
        {list &&
          list.length > 0 &&
          (list.map((value: Response) => {
            return (
              <ResponseItem
                data={value}
                key={value.author}
                maxLengthDescriptionText={maxLengthDescriptionText}
                resource={resource}
                usefulReaction={usefulReaction}
                removeUsefulReaction={removeUseful}
                load={load}
              />
            );
          }) ||
            "")}
      </ul>
      <button className="btn-item-response-page" onClick={backPage}>Back</button>
      <button className="btn-item-response-page" onClick={nextPage}>Next</button>
    </>
  );
};

export default ResponseList;
