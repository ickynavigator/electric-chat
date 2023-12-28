# ElectricSQL - Web example

This is an example web application using ElectricSQL in the browser with [wa-sqlite](https://github.com/rhashimoto/wa-sqlite).

## Pre-reqs

You need [NodeJS >= 16.11 and Docker Compose v2](https://electric-sql.com/docs/usage/installation/prereqs). Install `yarn` if you don't have it already:

```shell
npm -g install yarn
```

## Install

Install the dependencies:

```sh
yarn
```

## Setup

Start Postgres and Electric using Docker (see [running the examples](https://electric-sql.com/docs/examples/notes/running) for more options):

```shell
yarn backend:up
```

Setup your [database schema](https://electric-sql.com/docs/usage/data-modelling):

```shell
yarn db:migrate
```

Generate your [type-safe client](https://electric-sql.com/docs/usage/data-access/client):

```shell
yarn client:generate
```

## Run

Start your app:

```sh
yarn start
```

Open [localhost:3001](http://localhost:3001) in your web browser.

## Develop

`./src/Example.tsx` has the main example code. For more information see the:

- [Documentation](https://electric-sql.com/docs)
- [Quickstart](https://electric-sql.com/docs/quickstart)
- [Usage guide](https://electric-sql.com/docs/usage)

If you need help [let us know on Discord](https://discord.electric-sql.com).
