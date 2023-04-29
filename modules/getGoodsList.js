import { readFile } from "fs/promises";
import { DB_FILE } from "../index.js";
import { paginateGoods } from "./paginateGoods.js";

export const getGoodsList = async (params = {}) => {
  const page = +params.page || 1;
  const paginationCount = params.count || 12;
  const sort = {
    value: params.sort || "title",
    direction: params.direction || "up",
  };
  let goods = [];

  try {
    goods = JSON.parse(await readFile(DB_FILE, "utf8")) || [];
  } catch (error) {
    console.error(error);
  }

  if (params.search) {
    const search = params.search.trim().toLowerCase();
    const data = goods.filter(({ title }) =>
      title.toLowerCase().includes(search)
    );
    if (params.category) {
      const category = params.category.trim().toLowerCase();
      const regExp = new RegExp(`^${category}$`);
      return paginateGoods(
        data.filter(({ category }) => regExp.test(category.toLowerCase())),
        page,
        paginationCount,
        sort
      );
    }
    return paginateGoods(data, page, paginationCount, sort);
  }

  if (params.list) {
    return goods.filter(({ id }) => params.list.includes(id));
  }

  let data = goods;

  if (params.category) {
    const category = params.category.trim().toLowerCase();
    const regExp = new RegExp(`^${category}$`);
    data = data.filter(({ category }) => regExp.test(category.toLowerCase()));
  }

  if (params.color?.length) {
    data = data.filter(({ color }) => params.color.includes(color));
  }

  if (params.minprice) {
    data = data.filter(({ price }) => params.minprice <= price);
  }

  if (params.maxprice) {
    data = data.filter(({ price }) => params.maxprice >= price);
  }

  if (params.mindisplay) {
    data = data.filter(({ display }) => params.mindisplay <= display);
  }

  if (params.maxdisplay) {
    data = data.filter(({ display }) => params.maxdisplay >= display);
  }

  return paginateGoods(data, page, paginationCount, sort);
};
