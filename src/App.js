const { argv } = require("node:process");
const fs = require("node:fs");

let list = [];

function loadOrderList() {
  try {
    const file = fs.readFileSync(argv[2], "utf8");
    list = file.split("\r\n").slice(1);
    console.log(list);
  } catch (err) {
    console.error(err);
  }
}

function main() {
  loadOrderList();
  //   console.log(getMaxTotalPriceRecord());
  //   console.log(getMaxQuantityRecord());
  //   console.log(getMaxTotalDiscountRecord());
}

main();
