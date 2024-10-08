# white-sf

## Description

Available environment variables:

| Variable              | Type                   | Default               | Description                                         |
| --------------------- | ---------------------- | --------------------- | --------------------------------------------------- |
| LOG_LEVEL             | debug \| info \| error | debug                 | Sets the log level                                  |
| LOG_PATH              | string                 | ./log                 | path to log file directory                          |
| GAME_MIN_PLAYERS      | number                 | 3                     | required number of players to start a game          |
| GAME_TICK_INTERVAL_MS | number \| milliseconds | 2.5 seconds           | time until next state is calculated in milliseconds |
| GAME_VOTING_TIME_MS   | number \| milliseconds | 10 seconds            | duration of votings are running in milliseconds     |
| SERVER_PORT           | number                 | 3000                  | Port the webserver is listening to                  |
| SERVER_BASE_PATH      | string                 | localhost             | Server dns name                                     |
| FRONTEND_URL          | string                 | http://localhost:5173 | url to the frontend                                 |

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

### Generate docker images(generates both back- and frontend)

```ssh
pnpm docker:generate
```

### Commands to generate single docker Image

```ssh
pnpm docker-generate-backend
pnpm docker-generate-frontend
```
