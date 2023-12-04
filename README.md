# Ecommerce Backend
 Exercise project for reading from an order list and display some info about it.

 ## Prerequisites

* [NodeJS](https://nodejs.org/en/download)

## Installing

### Clone the repository

You can clone this repo by using:
```
git clone https://github.com/axelcampaci/ecommerce-be <project_dir>
```
> `project_dir` will be your project name. If not provided the project name will be **ecommerce-be**.

### Install dependencies

```
cd <project_dir>
npm install
```

### Build and run the script

To build and run the project with the default *.csv* file:
```
npm start
```
> This will run the project using the file located at `assets/List.csv`.

To just build the project:
```
npm run build
```

To run the project with custom arguments:
```
node out/src/App.js <path/to/file.csv>
```
> Note that the argument passed must be a *.csv* file.

## Notes

Input *.csv* file must follow some rules to be considred **valid**:
* The first row must contains exactly the headers - **Id,Article Name,Quantity,Unit price,Percentage discount,Buyer**
* The only delimiters accepted are **commas**

In the `assets` folder there are some other *.csv* sample file for testing the project:
* `Test1.csv` - **valid** input file without records
* `Test2.csv` - **valid** input file with 10 records, including some decimal values for **Unit price** field
* `Test3.csv` - **no valid** input file - headers doesn't coincide with the requested
