# openrouter

sadly , openrouter is not so open.

so building a way to run and compare various open source AI models together,

helps in tracking token budget, compute costs in a nice format.

## Architecture

- frontend(openrouter.com) -> primary backend (used for user registation - dashboard/ admin related functionality exposed here) ; (primary backend also called the timeseried db) -> database
  - signup
  - signin
  - create api key
  - stripe webhook
  - get current credits
  - get usage
  - get existing conversations

- user  app frontend -> api backend (stream back the response) -> database \-> timeseries db (for all the metrics that we want to gather ; for all the LLM calls that are called) \-> llm providers
  - post /completions
