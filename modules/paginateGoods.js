export const paginateGoods = (goods, page, count, sort) => {
  const { value, direction } = sort;

  const sortGoods = goods.sort((a, b) => {
    if (value === "price") {
      return direction === "up" ? a.price - b.price : b.price - a.price;
    }

    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();
    return direction === "up" ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
  });

  const end = count * page;
  const start = page === 1 ? 0 : end - count;
  const pages = Math.ceil(sortGoods.length / count);

  return {
    goods: sortGoods.slice(start, end),
    page,
    pages,
  };
};
