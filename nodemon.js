{
  "watch": [
    "src"
  ],
  "ext": "ts, json",
  "exec": "npm run ts -- --files ./src/main.ts | pino-pretty --colorize --translateTime SYS:standard"
}