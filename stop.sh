#!/bin/bash

env=$1

prod() {
  docker-machine stop testdriven-prod
}

stage() {
  docker-machine stop testdriven-stage
}

local() {
  docker-compose down
}

if [[ "${env}" == "stage" ]]; then
  echo "\n"
  echo "Stopping Stage ENV on AWS!\n"
  stage
elif [[ "${env}" == "prod" ]]; then
  echo "\n"
  echo "Stopping Prod ENV on AWS!\n"
  prod
else
  echo "\n"
  echo "Stopping local!\n"
  local
fi