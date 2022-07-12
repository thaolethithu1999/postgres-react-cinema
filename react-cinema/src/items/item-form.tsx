import * as React from "react";
import {
  createModel,
  DispatchWithCallback,
  EditComponentParam,
  useEdit,
} from "react-hook-core";
import { inputEdit } from "uione";
import { Item, getItemService, getCategory } from "./service";
import { TextField, Autocomplete } from "@mui/material";
interface InternalState {
  item: Item;
  categoryList: string[];
  showAutocomplete: boolean;
}

const initialState: InternalState = {
  item: {} as Item,
  categoryList: [],
  showAutocomplete: false,
};

const createItem = (): Item => {
  const item = createModel<Item>();
  item.categories = [];
  return item;
};

const initialize = (
  id: string | null,
  load: (id: string | null) => void,
  set: DispatchWithCallback<Partial<InternalState>>
) => {
  const categoryService = getCategory();
  categoryService.getAllCategories().then((allCategories) => {
    const categoryList: string[] = [];
    for (const item of allCategories) {
      categoryList.push(item.categoryName);
    }
    load(id);
    set({ categoryList, showAutocomplete: true });
  });
};

const param: EditComponentParam<Item, string, InternalState> = {
  createModel: createItem,
  initialize,
};

export const ItemForm = () => {
  const refForm = React.useRef();
  const { resource, state, setState, updateState, flag, save, back } = useEdit<
    Item,
    string,
    InternalState
  >(refForm, initialState, getItemService(), inputEdit(), param);

  const item = state.item;

  return (
    <div className="view-container">
      <form
        id="itemForm"
        name="itemForm"
        model-name="item"
        ref={refForm as any}
      >
        <header>
          <button
            type="button"
            id="btnBack"
            name="btnBack"
            className="btn-back"
            onClick={back}
          />
          <h2>
            {flag.newMode ? resource.create : resource.edit} {resource.item}
          </h2>
        </header>

        <div className="row">
          <label className="col s12 m6">
            ID
            <input
              type="text"
              id="id"
              name="id"
              value={item.id || ""}
              readOnly={!flag.newMode}
              onChange={updateState}
              maxLength={20}
              required={true}
            />
          </label>
          <label className="col s12 m6">
            {resource.person_title}
            <input
              type="text"
              id="title"
              name="title"
              value={item.title || ""}
              onChange={updateState}
              maxLength={40}
              required={true}
              placeholder={resource.person_title}
            />
          </label>
          <div className="col s12 m6 radio-section">
            {resource.status}
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  id="active"
                  name="status"
                  onChange={(e) => updateState(e, () => setState)}
                  value="A"
                  checked={item.status === "A"}
                />
                {resource.active}
              </label>
              <label>
                <input
                  type="radio"
                  id="inactive"
                  name="status"
                  onChange={(e) => updateState(e, () => setState)}
                  value="I"
                  checked={item.status === "I"}
                />
                {resource.inactive}
              </label>
            </div>
          </div>
          <label className="col s12 m6">
            {resource.description}
            <input
              type="text"
              id="description"
              name="description"
              value={item.description || ""}
              onChange={updateState}
              maxLength={120}
              placeholder={resource.description}
            />
          </label>
          <label className="col s12 m6">
            {((!flag.newMode && item.categories) || flag.newMode) && (
              <Autocomplete
                multiple={true}
                options={state.categoryList}
                value={item.categories}
                onChange={(e, newValue) => {
                  const newItem = { ...item, categories: newValue };
                  setState({ item: newItem }, () => {});
                }}
                filterSelectedOptions={true}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="categories"
                    placeholder="category"
                  />
                )}
              />
            )}
          </label>
        </div>
        <footer>
          {!flag.readOnly && (
            <button type="submit" id="btnSave" name="btnSave" onClick={save}>
              {resource.save}
            </button>
          )}
        </footer>
      </form>
    </div>
  );
};
