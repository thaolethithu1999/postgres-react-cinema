import { useEffect, useRef, useState } from 'react';
import {
  OnClick,
  SearchComponentState,
  useSearch,
  value,
  PageSizeSelect,
} from "react-hook-core";
import { useParams } from 'react-router-dom';
import { storage } from 'uione';
import { RateFilter } from '../../rate/service/rate/rate';
import { RateItem } from '../rate-item';
import { useRate } from '../service';
import { Rate, RateComment } from '../service/rate';
import { inputSearch } from "uione";

export interface RateListInterface {
  pageSize: number;
  setPageSize: any;
  load: any;
  rates: Rate[] | undefined;
  setRates: any;
  replies: RateComment[] | undefined;
  setReplies: any;
}

interface RateSearch extends SearchComponentState<Rate, RateFilter> { }

const RateList = (props: RateListInterface) => {
  const params = useParams();
  const { id } = params;
  const userId: string | undefined = storage.getUserId() || '';


  const [maxLengthReviewText] = useState(100);
  // const [resource] = useState(storage.resource().resource());
  const rateService = useRate();
  const { pageSize, setPageSize, load, rates, setRates, replies, setReplies } = props;

  const rateFilter: RateFilter = {
    id: id,
    userId: userId
  };

  const initialState: RateSearch = {
    list: [],
    filter: rateFilter,
  };

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
    setComponent
  } = useSearch<Rate, RateFilter, RateSearch>(
    refForm,
    initialState,
    useRate(),
    inputSearch()
  );

  const { list } = state;


  useEffect(() => {
  }, [state])

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
    console.log(page, size)
    if (page < Math.ceil(Number(component.total) / size)) {
      pageChanged({
        page: page + 1,
        size: size,
      });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRates]);

  const moreReview = async (e: any) => {
    e.preventDefault();
    const cinemaRateSM = new RateFilter();
    const userId: string | undefined = storage.getUserId();
    const { id } = params;
    cinemaRateSM.id = id;
    cinemaRateSM.limit = pageSize + 3;
    cinemaRateSM.sort = '-time';
    cinemaRateSM.userId = userId;
    const searchRates = await rateService.search(cinemaRateSM, pageSize + 3);
    setRates(searchRates.list);
    setPageSize(pageSize + 3);
  };

  const usefulReaction = async (e: OnClick, rate: Rate) => {
    console.log(rate);
    const id = rate.id || '';
    const author = rate.author || '';
    const userId: string | undefined = storage.getUserId();
    if (!userId) {
      return;
    }
    await rateService.setUseful(id, author, userId);
    search(e as any)
    setComponent({
      sortField: 'time',
      sortType: '-',
      sortTarget: undefined
    });
    sort('-time' as  any)
  }

  const removeUseful = async (e: OnClick, rate: Rate) => {
    const id = rate.id || '';
    const author = rate.author || '';
    const userId: string | undefined = storage.getUserId();
    if (!userId) {
      return;
    }
    await rateService.removeUseful(id, author, userId);
    load();
  }

  return (
    <>
      <PageSizeSelect
        size={component.pageSize}
        sizes={component.pageSizes}
        onChange={pageSizeChanged}
      />
      <ul className='row list-view'>
        {
          (
            list && list.length > 0 &&
            (list.map((value: Rate) => {
              return <RateItem
                data={value}
                key={value.author}
                maxLengthReviewText={maxLengthReviewText}
                resource={resource}
                usefulReaction={usefulReaction}
                removeUsefulReaction={removeUseful}
                load={load}
              />;
            }) || '')
          )
        }
      </ul>

      <button className="btn-item-response-page" onClick={backPage}>Back</button>
      <button className="btn-item-response-page" onClick={nextPage}>Next</button>

      {/* {rates && rates.length >= 3 && (<div className='col s12 m12 l12 more-reviews-div'>
        <span className='more-reviews' onClick={moreReview}>
          <b>MORE REVIEWS</b>
        </span>
      </div>)} */}
    </>
  )
}

export default RateList;