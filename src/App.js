const { argv } = require("node:process");
const fs = require("node:fs");

let list = [];

function loadOrderList() {
  try {
    const file = fs.readFileSync(argv[2], "utf8");
    list = file.split("\r\n").slice(1);
    // console.log(list);
  } catch (err) {
    console.error(err);
  }
}

function getMaxTotalPriceRecord() {
  let max = 0;
  let maxRecord = "None";
  list.forEach((record) => {
    const recordArray = record.split(",");
    const value = recordArray[2] * recordArray[3];
    if (value >= max) {
      max = value;
      maxRecord = record;
    }
  });
  return maxRecord;
}

function getMaxQuantityRecord() {
  let max = 0;
  let maxRecord = "None";
  list.forEach((record) => {
    const recordArray = record.split(",");
    const value = parseInt(recordArray[2]);
    if (value >= max) {
      max = value;
      maxRecord = record;
    }
  });
  return maxRecord;
}

function main() {
  loadOrderList();
  console.log(
    "The record with the highest total price is: " + getMaxTotalPriceRecord()
  );
  console.log(
    "The record with the highest quantity is: " + getMaxQuantityRecord()
  );
  //   console.log(getMaxTotalDiscountRecord());
}

main();
