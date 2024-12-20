#!/bin/sh

if [ "${ENV}" = "development" ]; then 
  deno install
  deno task db:migrate:push
  deno task db:seed
  deno task dev
else
  deno install --allow-scripts
  deno task start
fi
