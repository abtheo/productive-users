# Productive Users

Suite of Restful API endpoints within a containerised project using Docker and built in the Nest.Js Framework.

## Setup

The simplest way to run the project is using [Docker](https://www.docker.com/).

First clone the repository:

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

## Endpoints

## Development

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
