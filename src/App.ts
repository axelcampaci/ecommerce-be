import { argv } from "node:process";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";

type Record = {
  id: number;
  articleName: string;
  quantity: number;
  unitPrice: number;
  percentageDiscount: number;
  buyer: string;
};

let records: Record[] = [];

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
        "articleName",
        "quantity",
        "unitPrice",
        "percentageDiscount",
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
                context.column === "percentageDiscount"
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
        .on("data", (record: Record) => {
          records.push(record);
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

function getMaxRecord(comparator: (a: Record, b: Record) => number): Record {
  return records.reduce((maxRecord, currentRecord) =>
    comparator(maxRecord, currentRecord) > 0 ? maxRecord : currentRecord
  );
}

async function main() {
  await loadOrderList();

  console.log(
    "The record with the highest total price is: " +
      JSON.stringify(
        getMaxRecord(
          (a: Record, b: Record) =>
            a.quantity * a.unitPrice - b.quantity * b.unitPrice
        ),
        null,
        2
      )
  );

  console.log(
    "The record with the highest quantity is: " +
      JSON.stringify(
        getMaxRecord((a: Record, b: Record) => a.quantity - b.quantity),
        null,
        2
      )
  );

  console.log(
    "The record with the highest total discount is: " +
      JSON.stringify(
        getMaxRecord(
          (a: Record, b: Record) =>
            (a.quantity * a.unitPrice * a.percentageDiscount) / 100 -
            (b.quantity * b.unitPrice * b.percentageDiscount) / 100
        ),
        null,
        2
      )
  );
}

main();
