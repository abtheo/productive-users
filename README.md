# Productive Users

Suite of Restful API endpoints within a containerised project using Docker and built in the Nest.Js Framework.

## Setup

**Prerequesits**:
The simplest way to run the project is using [Docker](https://www.docker.com/). Alternatively, follow the Development guide to run the project with npm.

First, clone the repository:

```
git clone https://github.com/abtheo/productive-users
```

Next, create a file named `.env` in the root directory of the repository. An example is provided in the file `.env.example`. The environment file should contain a secret key for JWT token signing in the following format:

```
JWT_TOKEN=MYSECRETKEY
```

Finally, to generate a Docker image and run it inside a local container, execute the command:

```
docker compose up
```

The container will automatically launch the NestJs web server, accessible via `http://localhost:3000`.

## Accessing the API

A small collection of example Postman requests is available in [productive-users.postman_collection.json](productive-users.postman_collection.json)

To start using the API, first send a GET request to `http://localhost:3000/auth/login`. In the request body, a `username` and `password` should be provided. You can use the following default credentials to get started:

```
{"username": "admin", "password": "password"}
```

Successfully authenticating with this endpoint will cause a JWT token to be returned like so:

```
{
    "access_token": "eyJhbG...oZKoU"
}
```

In order to authenticate with any endpoint under `/users/` or `/products/`, this JWT token should be added as a parameter to the header of any request:

```
curl -H 'Authorization: Bearer <JWT_token>' http://localhost:3000/<protected-endpoint>
```

## Endpoints

For more information on the available endpoints in this API, please reference their controller source code.

- [Users endpoints](./src/users/users.controller.ts)

- [Products endpoints](./src/products/products.controller.ts)

## Development

### Installation

```bash
$ npm install
```

### Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
