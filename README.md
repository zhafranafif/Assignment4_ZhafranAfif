## Assignment 3 CRUD API
My task is to create a RESTful API, according to the given requirements.

> *Notes:*
> - Start with this boilerplate https://github.com/nabhannaufal/service-boilerplate, remove unused code
> - Add logger in code (error, debug or info)
> - Add Unit test, should be pass coverageThreshold
> - Use MYSQL Database
> - Create 2 version api
    - V1 using parameterized sql queries
    - V2 using ORM with [Prisma](https://www.prisma.io/docs/getting-started)
> - Add validation request
> - Add handle response status (200, 400, 500)
> - Create documentation on file README.md
> - Deploy your project
> - Submission
    - Repository [Github](https://github.com/) or [Gitlab](https://gitlab.com/)
    - Postman Collection

## Deployment
Deployment using Railway, [Deploy](https://assignment3zhafranafif-production.up.railway.app/api/v1/laptop)

## Stack
The tech stack used in building RESTful API includes:
> - *express*: A fast and minimalist web framework for Node.js, providing a powerful set of features for building web applications and APIs.
> - *dotenv*: This library makes it easier to manage application configuration by using .env files to define environment variables, thus separating configuration from source code.
> - *boom*: This library is used to create HTTP-friendly errors in Node.js. Very useful for handling errors in web applications.
> - *joi*: A schema validation library that helps in defining and validating JavaScript object structures, especially useful for user input validation.
> - *mysql2*: A MySQL driver for Node.js that supports Promises and provides an API compatible with mysql. It is faster and more efficient than mysql.
> - *prisma*: A modern ORM (Object-Relational Mapping) for Node.js and TypeScript that simplifies interaction with databases through a powerful, type-safe query builder.
> - *lodash*: A JavaScript utility library that provides many useful functions for manipulating arrays, objects, and other data types.
> - *fs*: A built-in Node.js module that provides an interface for working with the file system, such as reading, writing, and deleting files.
> - *ioredis*: A library for interacting with Redis, a popular in-memory data store. Supports all Redis features including clusters, sentinels, and pipelines.
> - *JSONStream*: Library for working with JSON streams. Useful for processing large JSON data without having to load everything into memory.
> - *moment*: A library for manipulating and formatting dates and times in JavaScript, although it is no longer actively developed and users are advised to switch to other libraries such as date-fns or Luxon.
> - *pino*: A very fast and JSON-friendly logger for Node.js. Designed for high performance and large log volumes.

## Installation
1. Download or clone this repo.
2. Enter to the project directory.
3. Execute npm install to install the dependencies.
4. Copy .env.example to .env and set the environment variables.
5. Execute prisma migrate dev

## Configuration
Edit environment variables on .env

env
# PRISMA
DATABASE_URL = 'mysql://USER:PASSWORD@HOST:PORT/DATABASE'
# DATABASE
LAPTOP_TABLE =
MYSQL_CONFIG_HOST =
MYSQL_CONFIG_USER =
MYSQL_CONFIG_PASSWORD =
MYSQL_CONFIG_DATABASE =
MYSQL_PORT =

## Usage

### Get List of Laptops

**Endpoint:**
- `GET /api/v1/laptop`
- `GET /api/v2/laptop`

**Response:**
```json
{
    "status": "00000",
    "message": "Success",
    "data": {
        "count": 2,
        "list": [
            {
                "name": "MSI Bravo 14",
                "brand": "BrandName",
                "price": 9499000,
                "stock": 7
            },
            {
                "name": "Retrograde Low Triple Black",
                "brand": "Compass",
                "price": 538000,
                "stock": 10
            }
        ]
    },
    "transaction_id": "A3022407230902330820"
}
```
### Add Laptop

**Endpoint:**
-`POST /api/v1/laptop`
-`POST /api/v2/laptop`

**Request Body**
```json
{
    "name": "MSI Bravo 14",
    "price": 9499000,
    "stock": 7,
    "brand_id": 1
}
```
**Response:**
```json
{
    "status": "00000",
    "message": "Success",
    "data": "Success adding MSI Bravo 14 to the database!",
    "transaction_id": "A3022407230344302130"
}
```
### Update Laptop

**Endpoint:**
-`PUT /api/v1/laptop/:id`
-`PUT /api/v2/laptop/:id`

**Request Body**
```json
{
    "name": "MSI Bravo 14 Updated",
    "price": 9599000,
    "stock": 20,
    "brand_id": 1
}
```
**Response:**
```json
   {
    "status": "00000",
    "message": "Success",
    "data": "Edited id 8",
    "transaction_id": "A3022407230352134140"
}
```
### Delete Laptop

**Endpoint:**
-`DELETE /api/v1/laptop/:id`
-`DELETE /api/v2/laptop/:id`

**Response:**
```json
   {
    "status": "00000",
    "message": "Success",
    "data": "Successfully Delete id 8",
    "transaction_id": "A3022407230355337510"
}
```
### Unit Testing
<p align="center">
  <img src="https://i.ibb.co.com/RpJVnL0/Screenshot-29.png" alt="Unit Test">
</p>
