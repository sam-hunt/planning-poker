# Planning Poker

A realtime webapp for collaborative agile estimation.
Hosted at [planningpoker.samhunt.dev](https://planningpoker.samhunt.dev).

## Features

- Simultaneous card reveal and reset
- Room Leader control for session timings
- Fibonacci/T-Shirt sizing card options
- Room isolation via URL for simple session sharing
- Spectator mode for non-technical participants
- Familar Material UI design
- Dark mode and mobile responsive

## Installation

```bash
$ cp client/.env.example client/.env
$ npm install
$ npm run build
```

## Running locally

```bash
$ npm -w server run start:dev # NestJS
$ npm -w client run dev       # Vite
```
