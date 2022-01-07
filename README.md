## Setup

To run locally, copy `.env.example` to `.env.local` and fill up with the appropriate values.

## Live demo

https://typo-lnl.vercel.app

## Xtstate

### Why?

- [State-driven interfaces with XState](https://blog.logrocket.com/state-driven-interfaces-with-xstate/)
- [Guidelines for State Machines and XState](https://kyleshevlin.com/guidelines-for-state-machines-and-xstate)
- [No, disabling a button is not app logic.](https://dev.to/davidkpiano/no-disabling-a-button-is-not-app-logic-598i)

### Implementation examples

https://gist.github.com/dlcmh/40a8a6bcaf0a2e947c2b03aa9b6bf675

## Azure Cosmos DB

### Why?

- generous limits on free plan:
  - https://docs.microsoft.com/en-us/azure/cosmos-db/optimize-dev-test#azure-cosmos-db-free-tier
  - https://azure.microsoft.com/en-gb/pricing/details/cosmos-db/ (scroll down to Try Azure Cosmos DB for free > Azure Cosmos DB free tier: "...1,000 RU/s provisioned throughput and 25 GB of storage for free each month for the life of one Azure Cosmos DB account per Azure subscription.")
- most similar to relational DBs (eg PostgreSQL, MySQL) of all NoSQL databases:
  - joins
  - where conditions
  - all properties/fields are indexed by default (unlike PK & SK on DynamoDB)

### End-to-end example

This is really worth reading https://devblogs.microsoft.com/cosmosdb/getting-started-end-to-end-example-1/

### Implementation examples

Eg flow:

1. XState action [`writeToCognos`](https://github.com/dlcmh/typo-lnl/blob/main/containers/typo/Challenge/challengeMachine.ts#L140) calls...
2. ...[upsertScore](https://github.com/dlcmh/typo-lnl/blob/01581be7114c5c9ad3d92713b562b4dba5af0dd5/helpers/cosmosdb/upsertScore.ts#L7) calls...
3. ...[https://github.com/dlcmh/typo-lnl/blob/main/pages/api/cosmosdb/upsert-score.ts] calls...
4. [/api/cosmosdb/upsert-score](https://github.com/dlcmh/typo-lnl/blob/main/pages/api/cosmosdb/upsert-score.ts)

([Node.js tutorial](https://docs.microsoft.com/en-us/azure/cosmos-db/sql/sql-api-nodejs-get-started))

## CSS Modules

Short doc - https://github.com/css-modules/css-modules

### Why?

- don't enjoy the css-in-js developer experience
- easily override defaults via setting values for CSS variables (aka [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties))

### Implementation examples

https://gist.github.com/dlcmh/2d8bad086c6500dd94d6c389e881d115
