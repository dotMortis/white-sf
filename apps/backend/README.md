# backend

## Description

Available environment variables:

| Variable              | Type                   | Default    | Description                                         |
| --------------------- | ---------------------- | ---------- | --------------------------------------------------- |
| LOG_LEVEL             | debug \| info \| error | debug      | Sets the log level                                  |
| LOG_PATH              | string                 | ./log      | path to log file directory                          |
| GMAE_MIN_PLAYERS      | number                 | 3          | required number of players to start a game          |
| GAME_TICK_INTERVAL_MS | number                 | 2 seconds  | time until next state is calculated in milliseconds |
| GAME_VOTING_TIME_MS   | number                 | 10 seconds | duration of votings are running in milliseconds     |
| SERVER_PORT           | number                 | 3000       | Port the webserver is listening to                  |

### Starting dev env:

1. install all packages

```ssh
pnpm i
```

2. start in hotreload dev mode

```ssh
npx turbo dev
```

### Building Project

```ssh
npx turbo build [--force]
```

### Generate deploy build

```ssh
npx turbo deploy
```

### Generate docker images

```ssh
pnpm docker:generate
```
