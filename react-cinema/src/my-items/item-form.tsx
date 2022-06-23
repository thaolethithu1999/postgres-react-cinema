import { ValueText } from 'onecore';
import { createModel, DispatchWithCallback, EditComponentParam, useEdit } from 'react-hook-core';
import { handleError, inputEdit } from 'uione';
import { getItemService, Item } from './service';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';


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
export const MyItem = () => {
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
  const saveItem = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    e.persist();
    if(item?.id)
    {
      if(itemService)
      {
        const item: Item = {
          'id': id,
          'title': title,
          'description': description,
          'status': status
        };
        await itemService.updateItem(item, id);
        navigate('../../item');
      }
    }
    else
    {
      if(itemService)
      {
        const item: Item = {
          'id': uuidv4(),
          'title': title,
          'description': description,
          'status': status
        };

        await itemService.insert(item);
        navigate('../item');
      }
    }
    
  }

  return (
    <div className='view-container'>
      <form id='itemForm' name='itemForm' model-name='item' ref={refForm as any}>
        <header>
          <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
          <h2>Edit Item</h2>
        </header>
        <div className='row'>
          { item?.id &&<label className='col s12 m6'>
            Id
            <input
              type='text'
              id='userId'
              name='userId'
              value={item.id}
              readOnly={!flag.newMode}
              maxLength={20} required={true}
               />
          </label>}
          <label className='col s12 m6'>
            {resource.person_title}
            <input
              type='text'
              id='title'
              name='title'
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={255}
              required={true}
              placeholder={resource.person_title} />
          </label>
          <label className='col s12 m6'>
            {resource.description}
            <input
              type='text'
              id='description'
              name='description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={255}
              required={true}
              placeholder={resource.description} />
          </label>
          <label className='col s12 m6'>
            {resource.description}
            <input
              type='text'
              id='status'
              name='status'
              value={status}
              onChange={e => setStatus(e.target.value)}
              maxLength={255}
              required={true}
              placeholder={resource.status} />
          </label>
        </div>
        <footer>
          {!flag.readOnly &&
            <button type='submit' id='btnSave' name='btnSave' onClick={(e) => saveItem(e)} >
              {resource.save}
            </button>}
        </footer>
      </form>
    </div>
  );
};
