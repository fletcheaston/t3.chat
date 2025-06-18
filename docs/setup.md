# Setup

## Install packages

From the root of the repo, run:

```shell
npm install
```

When you start the app, backend packages will be installed automatically.
If you'd like to install these packages manually, run:

```shell
cd backend
npm run setup
```

The backend uses [`uv`](https://docs.astral.sh/uv/) for package/environment management, [
`ruff`](https://docs.astral.sh/ruff/) for linting and formatting, and [`ty`](https://github.com/astral-sh/ty) for
type-checking.

## Start docker

From the root of the repo, run:

```shell
docker compose up -d
```

This will start a local Postgres and Redis database.

## Create `.env` file in `/backend`

You can use the following values to get started:

```text
DEBUG=True

VERSION=local
SECRET_KEY=local

PG_DB=t3chat
PG_USER=postgres
PG_PASSWORD=postgres
PG_HOST=localhost

GITHUB_OAUTH_CLIENT_ID=fake
GITHUB_OAUTH_CLIENT_SECRET=fake

OPENAI_API_KEY=fake
GEMINI_API_KEY=fake
```

## Run database migrations

To update your local database schema, run:

```shell
cd backend
npm run migrate
```

## Running the app

Once you've followed the above steps, try running the app.
To do so, run this from the root of the repo:

```shell
npm run dev
```

This will run the frontend on [localhost:3000](http://localhost:3000) and the backend
on [localhost:8000](http://localhost:8000).

You can ensure the backend is running by visiting [the API docs](http://localhost:8000/api/docs).

## Create user

To create a user, run:

```shell
cd backend
npm run create:user
```

## Run tests

Before running tests, you'll need to create a new local database with the name `test`.
Once you have that database, run:

```shell
npm run test
```
