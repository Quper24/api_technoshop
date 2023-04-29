import { readFile } from "fs/promises";
import { DB_FILE } from '../index.js';

export const getItems = async (itemId) => {
  const goods = JSON.parse(await readFile(DB_FILE, 'utf8')) || [];
  const item = goods.find(({ id }) => id === itemId);

  if (!item) {
    throw new ApiError(404, { message: "Item Not Found" });
  }

  return item;
};
