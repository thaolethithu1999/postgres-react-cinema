import { ValueText } from 'onecore';
import { createModel, DispatchWithCallback, EditComponentParam, useEdit } from 'react-hook-core';
import { handleError, inputEdit } from 'uione';
import { getItemService, Item } from './service';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { ListCommentItem } from './list-item-comment-form';
import './appreciation.css';
import './rate.css';


interface InternalState {
  item: Item;
  titleList: ValueText[];
  positionList: ValueText[];
}

const createItem = (): Item => {
  const item = createModel<Item>();
  return item;
};
// const initialize = (id: string|null, load: (id: string|null) => void, set: DispatchWithCallback<Partial<InternalState>>) => {
//   // const masterDataService = getMasterData();
//   Promise.all([
//     // masterDataService.getTitles(),
//     // masterDataService.getPositions()
//   ]).then(values => {
//     // const [titleList, positionList] = values;
//     set({ titleList, positionList }, () => load(id));
//   }).catch(handleError);
// };

const initialState: InternalState = {
    item: {} as Item,
    titleList: [],
    positionList: []
};

const param: EditComponentParam<Item, string, InternalState> = {
  createModel: createItem,
  // initialize
};

export const ItemForm = () => {
  const refForm = React.useRef();
  const { resource, state, updateState, flag, save, back } = useEdit<Item, string, InternalState>(refForm, initialState, getItemService(), inputEdit(), param);
  // const item = state.item;
 
  const [title, setTitle] = useState<string | undefined>('');
  const [item, setItem] = useState<Item | null>();
  const [description, setDescription] = useState<string | undefined>('');
  const [status, setStatus] = useState<string | undefined>('');
  const [id, setId] = useState('');
  const itemService = getItemService();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    load();
  }, []);
  const load =async () => {
    const { id } = params;
    if(id)
    {
      if(itemService)
      {
        
        const data: Item | null = await itemService.getMyItem(id);
        setItem(data);
        if(data?.id)
        {
          setTitle(data?.title);
          setDescription(data?.description);
          setStatus(data?.status);
          setId(data?.id);
        }
      }
    }
  }

  return (
    <div className='view-container'>
      <form id='articleForm' name='articleForm' model-name='article' ref={refForm as any}>
        <header>
          <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
          <h2>Detail Item</h2>
        </header>
        <div className='row'>
          
          <label className='col s12 m12'>
            <b className='b-article'>{item?.title}</b>
          </label>

          <label className='col s12 m12'>
            {item?.description}
          </label>
        </div>

        <ListCommentItem  data={item}/>
      </form>

    </div>
  );
};
