# football-chat-bot-aws
Football Chat Bot. Integrated into Amazon Web Services

## Local Setup

Clone [application repository](https://github.com/tormozz48/football-chat-bot-aws):
```bash
git clone https://github.com/tormozz48/football-chat-bot-aws.git
```

Install npm dependencies:
```bash
npm install
```

Launch [DynamoDB](https://aws.amazon.com/dynamodb/) in Docker
```bash
docker-compose up -d
```

Run service in offline-mode. See [documentation](https://www.serverless.com/plugins/serverless-offline)
```bash
npm run dev
```

## Configuration parameters

Serverless parameters. See [documentation](https://www.serverless.com/framework/docs/guides/parameters)

* `telegramBotToken` - unique telegram bot token.
* `telegramBotWebhookUrl` - url of telegram webhook.
* `vkToken` - unique vk bot token string.
* `vkConfirmation` - vk verification code.

## Scripts

* `npm run lint` - Run static checks.
* `npm run dev` - Launch service in offline mode.
* `npm run deploy` - Launch serverless deploy. See [documentation](https://www.serverless.com/framework/docs/providers/aws/guide/deploying)
* `npm test` - Run unit tests via [Jest](https://jestjs.io/).
* `npm run db-gui` - Open Web UI pointed to local [DynamoDB](https://aws.amazon.com/dynamodb/) instance