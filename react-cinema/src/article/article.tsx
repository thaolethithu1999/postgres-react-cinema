import { ValueText } from 'onecore';
import * as React from 'react';
import { createModel, DispatchWithCallback, EditComponentParam, useEdit } from 'react-hook-core';
import { handleError, inputEdit } from 'uione';
import { Article, getArticleService, getMasterData } from './service';
import { TextEditorComponent } from './text-editor';
import './article.css';

interface InternalState {
  article: Article;
  titleList: ValueText[];
  positionList: ValueText[];
}

const createArticle = (): Article => {
  const article = createModel<Article>();
  return article;
};
const initialize = (id: string | null, load: (id: string | null) => void, set: DispatchWithCallback<Partial<InternalState>>) => {
  const masterDataService = getMasterData();
  Promise.all([
    masterDataService.getTitles(),
    masterDataService.getPositions()
  ]).then(values => {
    const [titleList, positionList] = values;
    set({ titleList, positionList }, () => load(id));
  }).catch(handleError);
};

const initialState: InternalState = {
  article: {} as Article,
  titleList: [],
  positionList: []
};

const param: EditComponentParam<Article, string, InternalState> = {
  createModel: createArticle,
  initialize
};
export const ArticleForm = () => {
  const refForm = React.useRef();
  const refEdit = React.useRef<any>();
  const [content, setContent] = React.useState<any>();
  const [test] = React.useState<any>();
  const { state, save, back } = useEdit<Article, string, InternalState>(refForm, initialState, getArticleService(), inputEdit(), param);
  React.useEffect(() => {
    setContent(state.article.content);
  }, [state]);

  // const onEditChange = (data: any) => {
  //   // setContent(data)
  // }
  React.useEffect(() => {
    if (test) {
      save(test);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.article.content]);
  // const handleSave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   e.preventDefault();
  //   const data = refEdit.current.getData();
  //   setTest(e);
  //   setState({ article: { ...state.article, content: data } });
  // };

  return (
    <div className='view-container'>
      <form id='articleForm' name='articleForm' model-name='article' ref={refForm as any}>
        <header>
          <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
          <h2>Detail Article</h2>
        </header>
        <div className='row'>

          <label className='col s12 m12'>
            <b className='b-article'>{state.article.title}</b>
          </label>

          <label className='col s12 m12'>
            {state.article.description}
          </label>

          <label className='col s12'>
            <TextEditorComponent ref={refEdit} html={content} ></TextEditorComponent>
          </label>
        </div>
        {/* <footer>
          {!flag.readOnly &&
            <button type='submit' id='btnSave' name='btnSave' onClick={handleSave}>
              {resource.save}
            </button>}
        </footer> */}
      </form>
    </div>
  );
};
