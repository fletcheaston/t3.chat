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

PG_DB=postgres
PG_USER=postgres
PG_PASSWORD=postgres
PG_HOST=localhost

GITHUB_OAUTH_CLIENT_ID=fake
GITHUB_OAUTH_CLIENT_SECRET=fake

OPENAI_API_KEY=fake
GEMINI_API_KEY=fake
```

While you do NOT need to enter a valid `GITHUB_OAUTH_CLIENT_ID` or `GITHUB_OAUTH_CLIENT_SECRET` when running locally,
you will need to add a valid `OPENAI_API_KEY` and `GEMINI_API_KEY` to run these models.

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

This will run the frontend on [localhost:3000](http://localhost:3000), the backend
on [localhost:8000](http://localhost:8000), and a Celery worker.

You can ensure the backend is running by visiting [the API docs](http://localhost:8000/api/docs).
