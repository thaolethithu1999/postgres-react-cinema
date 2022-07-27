import * as React from "react";
import { useState, useEffect } from "react";
import {
  createModel,
  DispatchWithCallback,
  EditComponentParam,
  useEdit,
} from "react-hook-core";
import { inputEdit, handleError } from "uione";
import { SuggestionService } from "suggestion-service";
import { Item, getItemService, getCategory } from "./service";
import { TextField, Autocomplete } from "@mui/material";
import { useBrandService } from "./service/item";
import { ItemReview } from "./review";
import { Link, useParams } from "react-router-dom";
import "./item.css"
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
  return item;
};

const initialize = (
  id: string | null,
  load: (id: string | null) => void,
  set: DispatchWithCallback<Partial<InternalState>>
) => {
  const categoryService = getCategory();
  categoryService.getAllCategories().then((allCategories: any) => {
    const categoryList: string[] = [];
    for (const item of allCategories.list) {
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

  const brandService = useBrandService();
  const [brandSuggestionService, setBrandSuggestionService] =
    useState<SuggestionService<string>>();
  const [listBrand, setListBrand] = useState<string[]>([]);

  useEffect(() => {
    const brandSuggestion = new SuggestionService<string>(
      brandService.query,
      20
    );
    setBrandSuggestionService(brandSuggestion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [previousBrand, setPreviousBrand] = useState({
    keyword: "",
    list: [] as string[],
  });

  const onChangeBrand = (e: React.FormEvent<HTMLInputElement>) => {
    updateState(e);
    const newBrand = e.currentTarget.value;
    if (newBrand) {
      if (brandSuggestionService) {
        brandSuggestionService
          .load(newBrand, previousBrand)
          .then((res) => {
            console.log(res);
            if (res !== null) {
              setPreviousBrand(res.last);
              setListBrand(res.list);
            }
          })
          .catch(handleError);
      }
    }
  };


  return (
    <div className="view-container item-form">
    {/* <div> */}
      <header>
        <button
          type="button"
          id="btnBack"
          name="btnBack"
          className="btn-back"
          onClick={back}
        />
        <h2>Back</h2>
      </header>
      <form
        id="itemForm"
        name="itemForm"
        model-name="item"
        ref={refForm as any}
      >
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
          Price
          <input
            type="text"
            id="price"
            name="price"
            value={item.price || ""}
            onChange={updateState}
            maxLength={120}
            placeholder={resource.price}
          />
        </label>
        <label className="col s12 m6">
          Image URL
          <input
            type="text"
            id="imageURL"
            name="imageURL"
            value={item.imageURL || ""}
            onChange={updateState}
            maxLength={120}
            placeholder="Image URL"
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
        <label className="col s12 m6">
          Brand
          <section>
            <div className="form-group">
              <input
                list="listBrand"
                type="text"
                name="brand"
                className="form-control"
                value={item.brand}
                onChange={onChangeBrand}
                placeholder="Enter brand"
                maxLength={50}
                autoComplete="on"
              />
            </div>
            {listBrand && listBrand.length > 0 && (
              <datalist id="listBrand">
                {listBrand.map((item, index) => {
                  return <option key={index} value={item} />;
                })}
              </datalist>
            )}
          </section>
        </label>
      </div>
      </form>
    </div>
  );
};
