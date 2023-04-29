import { readFile } from "fs/promises";
import { DB_FILE } from '../index.js';

export const getCategory = async () => {
  const goods = JSON.parse(await readFile(DB_FILE, 'utf8')) || [];
  const category = {};
  for (let i = 0; i < goods.length; i++) {
    category[goods[i].category] = goods[i].categoryRus;
  }

  return category;
}
