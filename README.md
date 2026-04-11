# openrouter

sadly , openrouter is not so open.

so building a way to run and compare various open source AI models together,

helps in tracking token budget, compute costs in a nice format.

## Architecture

- frontend(openrouter.com) -> primary backend -> database
  - signup
  - signin
  - create api key
  - stripe webhook
  - get current credits
  - get usage
  - get existing conversations

- user  app frontend -> api backend -> database \-> timeseries db \-> llm providers
  - post /completions
