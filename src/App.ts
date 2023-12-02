import { argv } from "node:process";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";

type Record = {
  id: number;
  article_name: string;
  quantity: number;
  unit_price: number;
  percentage_discount: number;
  buyer: string;
};

let list: Record[] = [];

function loadOrderList(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const filePath = argv[2];

    if (!filePath) {
      reject(new Error("Too few arguments"));
    }

    if (path.extname(filePath) !== ".csv") {
      reject(
        new Error(
          "Invalid type of file: needed .csv but provided " +
            path.extname(filePath)
        )
      );
    }

    try {
      const headers = [
        "id",
        "article_name",
        "quantity",
        "unit_price",
        "percentage_discount",
        "buyer",
      ];
      fs.createReadStream(argv[2], "utf8")
        .pipe(
          parse({
            delimiter: ",",
            columns: headers,
            from_line: 2,
            ltrim: true,
            cast: (columnValue, context) => {
              if (
                context.column === "id" ||
                context.column === "quantity" ||
                context.column === "percentage_discount"
              ) {
                return parseInt(columnValue);
              }
              if (context.column === "unit_price") {
                return parseFloat(columnValue);
              }
              return columnValue;
            },
          })
        )
        .on("data", (row) => {
          list.push(row);
        })
        .on("end", () => {
          console.log("CSV file loaded");
          resolve();
        })
        .on("error", (err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}

function getMaxTotalPriceRecord(): Record {
  let max = 0;
  let maxRecord: Record | null = null;
  list.forEach((record) => {
    const value = record.quantity * record.unit_price;
    if (value >= max) {
      max = value;
      maxRecord = record;
    }
  });
  return maxRecord || ({} as Record);
}

function getMaxQuantityRecord() {
  let max = 0;
  let maxRecord: Record | null = null;
  list.forEach((record) => {
    const value = record.quantity;
    if (value >= max) {
      max = value;
      maxRecord = record;
    }
  });
  return maxRecord || ({} as Record);
}

function getMaxTotalDiscountRecord() {
  let max = 0;
  let maxRecord: Record | null = null;
  list.forEach((record) => {
    const value =
      (record.quantity * record.unit_price * record.percentage_discount) / 100;
    if (value >= max) {
      max = value;
      maxRecord = record;
    }
  });
  return maxRecord || ({} as Record);
}

async function main() {
  await loadOrderList();

  console.log(
    "The record with the highest total price is: " +
      JSON.stringify(getMaxTotalPriceRecord(), null, 2)
  );

  console.log(
    "The record with the highest quantity is: " +
      JSON.stringify(getMaxQuantityRecord(), null, 2)
  );
  console.log(
    "The record with the highest total discount is: " +
      JSON.stringify(getMaxTotalDiscountRecord(), null, 2)
  );
}

main();
