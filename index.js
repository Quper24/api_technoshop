import express from "express";
import { readFile } from "fs/promises";
import { getItems } from "./modules/getItems.js";
import { ApiError } from "./modules/ApiError.js";
import { getGoodsList } from "./modules/getGoodsList.js";
import { getCategory } from "./modules/getCategory.js";
import { createServer } from "http";
const app = express();
export const DB_FILE = process.env.DB_FILE || "./db.json";
const PORT = process.env.PORT || 3001;
const URI_PREFIX = "/api/goods";

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get(`${URI_PREFIX}`, async (req, res) => {
  const queryParams = req.query;
  try {
    const goods = await getGoodsList(queryParams);
    res.json(goods);
  } catch (err) {
    console.log("err: ", err);
    if (err instanceof ApiError) {
      res.status(err.statusCode).json(err.data);
    } else {
      res.status(500).json({ message: "Server Error" });
    }
  }
});

app.get(`${URI_PREFIX}/:itemId`, async (req, res) => {
  const itemId = req.params.itemId;
  try {
    const item = await getItems(itemId);
    res.json(item);
  } catch (err) {
    console.log("err: ", err);
    if (err instanceof ApiError) {
      res.status(err.statusCode).json(err.data);
    } else {
      res.status(500).json({ message: "Server Error" });
    }
  }
});

app.get("/api/category", async (req, res) => {
  const body = await getCategory();
  res.json(body);
});

app.get("/img/:filename", async (req, res) => {
  const filename = req.params.filename;
  res.setHeader("Content-Type", "image/jpeg");
  try {
    const image = await readFile(`./img/${filename}`);
    res.end(image);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "test") {
    console.log(
      `Сервер CRM запущен. Вы можете использовать его по адресу http://localhost:${PORT}`
    );
    console.log("Нажмите CTRL+C, чтобы остановить сервер");
    console.log("Доступные методы:");
    console.log(`GET ${URI_PREFIX} - получить список товаров`);
    console.log(`GET ${URI_PREFIX}/{id} - получить товар по его ID`);
    console.log(`GET ${URI_PREFIX}?{search=""} - найти товар по названию`);
    console.log(
      `GET ${URI_PREFIX}?{category=""} - получить товар по его категории`
    );
    console.log(`GET ${URI_PREFIX}?{list="{id},{id}"} - получить товары по id`);
  }
});
