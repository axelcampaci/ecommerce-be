import { argv } from "node:process";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";

import { Record } from "../interfaces/Record";

/**
 * Load a .csv file from the path given as parameter and return the content as a `Promise` of `Record` array. If `filePath` is not provided or if the file extension is not .csv an error is thrown.
 * @param filePath the path of the .csv file.
 * @returns a `Promise` of `Record` array representing the .csv content.
 */
function loadOrderList(filePath: string): Promise<Record[]> {
  return new Promise<Record[]>((resolve, reject) => {
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
      let records: Record[] = [];
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
          resolve(records);
        })
        .on("error", (err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Iterate the `Record` array given as parameter and calls the specified comparator function for all the records in the array. The return value is the `Record` with the maximum value evaluated from the comparator.
 * @param records the `Record` array.
 * @param comparator the callback function to compare the records.
 * @returns the `Record` with the maximum value evaluated by the given comparator function.
 */
function getMaxRecord(
  records: Record[],
  comparator: (a: Record, b: Record) => number
): Record {
  return records.reduce((maxRecord, currentRecord) =>
    comparator(maxRecord, currentRecord) > 0 ? maxRecord : currentRecord
  );
}

async function main() {
  loadOrderList(argv[2]).then((records) => {
    console.log(
      "The record with the highest total price is: " +
        JSON.stringify(
          getMaxRecord(
            records,
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
          getMaxRecord(
            records,
            (a: Record, b: Record) => a.quantity - b.quantity
          ),
          null,
          2
        )
    );

    console.log(
      "The record with the highest total discount is: " +
        JSON.stringify(
          getMaxRecord(
            records,
            (a: Record, b: Record) =>
              (a.quantity * a.unitPrice * a.percentageDiscount) / 100 -
              (b.quantity * b.unitPrice * b.percentageDiscount) / 100
          ),
          null,
          2
        )
    );
  });
}

main();
