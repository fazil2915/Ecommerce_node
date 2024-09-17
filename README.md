# Assignment_nodejs
## Overview
This project is a RESTful API service for an e-commerce platform, built using Node.js, Express.js, and PostgreSQL. It provides a robust backend solution for managing seller and buyers
## Features
* AUTHENTICATION
* PRODUCT MANAGEMENT
* CART MANAGEMENT

## Api Documentation
All complete details have covered in this link [Details](https://documenter.getpostman.com/view/25678286/2sAXqp7iGi).

## Technologies Used

>Backend: Node.js, Express.js for building RESTful APIs.
Database: PostgreSQL
Orm: Prisma
Deployment: Aws Ec2

## Project config
`````
git clone [repo_url] (*main)
`````
#### Setup env 
```````
DATABASE_URL= ""
PORT=""
JWT_SECERET=""
```````
#### Prisma setup
```````
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```````
## Deployment details
(api url without token verify others api's can explore in api documentation)
[Live](http://54.163.26.31:5000/api/user/buyer/get-Products).

#### Working
* Trigger on push to the main branch.
* Build the application using Docker Compose, containerize it, and push the Docker images to a Docker registry.
* Deploy by cloning the Git repository on the server, pulling the latest Docker image from the registry, and running Docker Compose.
* Detailed with comments on [Gh work flow](https://github.com/fazil2915/Assignment_nodejs/blob/main/.github/workflow/main.yaml)
 



