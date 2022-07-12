import * as React from "react";
import {
  OnClick,
  Search,
  SearchComponentState,
  useSearch,
  value,
  checked,
} from "react-hook-core";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Pagination } from "reactx-pagination";
import { inputSearch } from "uione";
import { getItemService, Item, ItemFilter } from "./service";
import {
  Chip,
  TextField,
  Autocomplete,
  ThemeProvider,
  createTheme,
} from "@mui/material";

interface ItemSearch extends SearchComponentState<Item, ItemFilter> {
  // list: Item[];
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#4db6ac",
    },
  },
});

const itemFilter: ItemFilter = {
  id: "",
  title: "",
  status: "",
  description: "",
  categories: [],
};

const initialState: ItemSearch = {
  list: [],
  filter: itemFilter,
};

export const MyItems = () => {

  const navigate = useNavigate();
  const refForm = React.useRef();
  const [categories, setCategories] = React.useState<string[]>([]);

  const getFilter = (): ItemFilter => {
    return value(state.filter);
  };
  const p = { getFilter };

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
  } = useSearch<Item, ItemFilter, ItemSearch>(
    refForm,
    initialState,
    getItemService(),
    inputSearch(),
    p
  );

  component.viewable = true;
  component.editable = true;
  const edit = (e: OnClick, id: string) => {
    e.preventDefault();
    navigate(`edit/${id}`);
  };

  const { list } = state;
  const filter = value(state.filter);

  return (
    <div className="view-container">
      <header>
        <h2>Items</h2>
        <div className="btn-group">
          {component.view !== "table" && (
            <button
              type="button"
              id="btnTable"
              name="btnTable"
              className="btn-table"
              data-view="table"
              onClick={changeView}
            />
          )}
          {component.view === "table" && (
            <button
              type="button"
              id="btnListView"
              name="btnListView"
              className="btn-list-view"
              data-view="listview"
              onClick={changeView}
            />
          )}
          {component.addable && (
            <Link id="btnNew" className="btn-new" to="add" />
          )}
        </div>
      </header>
      <div>
        {/* Search */}
        <form
          id="itemsForm"
          name="itemsForm"
          noValidate={true}
          ref={refForm as any}
        >
          <section className="row search-group">
            <Search
              className="col s12 m6 search-input"
              size={component.pageSize}
              sizes={component.pageSizes}
              pageSizeChanged={pageSizeChanged}
              onChange={updateState}
              placeholder={resource.keyword}
              toggle={toggleFilter}
              value={filter.q || ""}
              search={search}
              clear={clearQ}
            />
            <Pagination
              className="col s12 m6"
              total={component.total}
              size={component.pageSize}
              max={component.pageMaxSize}
              page={component.pageIndex}
              onChange={pageChanged}
            />
          </section>
          {/* Search input */}
          <section
            className="row search-group inline"
            hidden={component.hideFilter}
          >
            <label className="col s12 m4 l3">
              Id
              <input
                type="text"
                id="id"
                name="id"
                value={filter.id || ""}
                onChange={updateState}
                maxLength={255}
                placeholder="Id"
              />
            </label>
            <label className="col s12 m4 l3">
              {resource.person_title}
              <input
                type="text"
                id="title"
                name="title"
                value={filter.title || ""}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.person_title}
              />
            </label>
            <label className="col s12 m4 l4 checkbox-section">
              {resource.status}
              <section className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    id="A"
                    name="status"
                    value="A"
                    checked={checked(filter.status, "A")}
                    onChange={updateState}
                  />
                  {resource.active}
                </label>
                <label>
                  <input
                    type="checkbox"
                    id="I"
                    name="status"
                    value="I"
                    checked={checked(filter.status, "I")}
                    onChange={updateState}
                  />
                  {resource.inactive}
                </label>
              </section>
            </label>
            <label className="col s12 m4 l3">
              {resource.description}
              <input
                type="text"
                id="description"
                name="description"
                value={filter.description || ""}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.description}
              />
            </label>
            <label className="col s12 m12 l4">
              Categories
              <Autocomplete
                options={[]}
                multiple
                id="tags-filled"
                freeSolo
                value={categories}
                onChange={(e, newValue: string[]) => {
                  if (newValue.length > -1) {
                    setCategories(newValue);
                    setState({ filter: { ...filter, categories: newValue } });
                  }
                }}
                renderTags={(v: readonly string[], getTagProps) =>
                  v.map((option: string, index: number) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <ThemeProvider theme={theme}>
                    <TextField
                      {...params}
                      variant="standard"
                      name="categories"
                      color="primary"
                      label={resource.categories}
                      placeholder={resource.categories}
                    />
                  </ThemeProvider>
                )}
              />
            </label>
          </section>
        </form>
        {/* Items Output */}
        <form className="list-result">
          {component.view === "table" && (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>{resource.sequence}</th>
                    <th data-field="id">
                      <button type="button" id="sortId" onClick={sort}>
                        Id
                      </button>
                    </th>
                    <th data-field="title">
                      <button type="button" id="sortTitle" onClick={sort}>
                        {resource.person_title}
                      </button>
                    </th>
                    <th data-field="status">
                      <button type="button" id="sortStatus" onClick={sort}>
                        {resource.status}
                      </button>
                    </th>
                    <th data-field="description">
                      <button type="button" id="sortDescription" onClick={sort}>
                        {resource.description}
                      </button>
                    </th>
                    <th data-field="categories">
                      <button type="button" id="sortCategories" onClick={sort}>
                        Categories
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list &&
                    list.length > 0 &&
                    list.map((item, i) => {
                      return (
                        <tr key={i} onClick={(e) => edit(e, item.id)}>
                          <td className="text-right">
                            {(item as any).sequenceNo}
                          </td>
                          <td>{item.id}</td>
                          <td>
                            <Link to={`edit/${item.id}`}>{item.title}</Link>
                          </td>
                          <td>{item.status}</td>
                          <td>{item.description}</td>
                          <td>{item.categories}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
          {component.view !== "table" && (
            <ul className="row list-view">
              {list &&
                list.length > 0 &&
                list.map((item, i) => {
                  return (
                    <li
                      key={i}
                      className="col s12 m6 l4 xl3"
                      onClick={(e) => edit(e, item.id)}
                    >
                      <section>
                        <div>
                          <h3>
                            <Link to={`edit/${item.id}`}>{item.title}</Link>
                          </h3>
                          <p>{item.status}</p>
                          <p>{item.description}</p>
                          <br />
                          <span>
                            {item.categories
                              ? item.categories.map((c, i) => {
                                  return <Chip label={c} size="small" />;
                                })
                              : ""}
                          </span>
                        </div>
                        <button className="btn-detail" />
                      </section>
                    </li>
                  );
                })}
            </ul>
          )}
        </form>
      </div>
    </div>
  );
};
