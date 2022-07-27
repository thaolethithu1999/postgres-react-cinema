import { useState, useEffect } from "react";
import { Item, getItemService } from "./service";
import { useParams } from "react-router-dom";
import { ItemReview } from "./review";
import "./item.css";
import {
  Chip,
  TextField,
  Autocomplete,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useNavigate } from "react-router";

export const ItemView = () => {
  const { id = "" } = useParams();
  const [item, setItem] = useState<Item>();
  const itemService = getItemService();
  const navigate = useNavigate();

  useEffect(() => {
    getItem(id ?? "");
  }, [id]);

  const getItem = async (id: string) => {
    const currentItem = await itemService.load(id);
    if (currentItem) {
      setItem(currentItem);
    }
  };

  console.log(item);

  return (
    <div className="item-view-container">
      <button
        type="button"
        id="btnBack"
        name="btnBack"
        className="btn-back"
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </button>

      {item && (
        <div className="item-view">
          <img src={item.imageURL} />
          <div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <Chip label={item.brand} />
            <p>{item.price}</p>
            <span>
              {item.categories
                ? item.categories.map((c: any, i: number) => {
                    return <Chip key={i} label={c} />;
                  })
                : ""}
            </span>
          </div>
        </div>
      )}

      <ItemReview item={item} />
    </div>
  );
};
