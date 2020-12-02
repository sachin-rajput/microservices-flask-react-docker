#!/bin/bash

env=$1

echo "ENV:" $env

inspect() {
  if [ $1 -ne 0 ]; then
    fails="${fails} $2"
  fi
}

# run e2e tests
e2e() {
  docker-compose -f docker-compose-prod.yml up -d --build
  docker-compose -f docker-compose-prod.yml exec users python manage.py recreate_db
  docker-compose -f docker-compose-prod.yml exec users python manage.py seed_db
  ./node_modules/.bin/cypress run --config baseUrl=http://$IP
  inspect $? e2e
  docker-compose -f docker-compose-prod.yml down
}

# run all tests
all() {
  docker-compose up -d --build
  docker-compose exec users python manage.py test
  inspect $? users
  docker-compose exec users flake8 project
  inspect $? users-lint
  docker-compose exec client npm run coverage
  inspect $? client
  docker-compose down
  e2e
}

prod() {
  docker-machine kill testdriven-prod
  docker-machine rm -f testdriven-prod
  docker-machine create --driver amazonec2 testdriven-prod
  export IP=`docker-machine env testdriven-prod | grep 'DOCKER_HOST'|cut -f2 -d "="|cut -f2 -d ":"|cut -c 3-`
  export REACT_APP_USERS_SERVICE_URL=http://$IP
  python services/swagger/update-spec.py http://$IP
  export SECRET_KEY=f0d41a61bc3cc5d79f5925c478c3ced8d3e2ab12c35ff231
  eval $(docker-machine env testdriven-prod)
  docker-compose -f docker-compose-prod.yml up -d --build
  all
}

stage() {
  docker-machine kill testdriven-prod
  docker-machine rm -f testdriven-prod
  docker-machine create --driver amazonec2 testdriven-stage
  export IP=`docker-machine env testdriven-stage | grep 'DOCKER_HOST'|cut -f2 -d "="|cut -f2 -d ":"|cut -c 3-`
  export REACT_APP_USERS_SERVICE_URL=http://$IP
  python services/swagger/update-spec.py http://$IP
  export SECRET_KEY=f0d41a61bc3cc5d79f5925c478c3ced8d3e2ab12c35ff231
  eval $(docker-machine env testdriven-stage)
  docker-compose -f docker-compose-stage.yml up -d --build
  all
}

local() {
  eval $(docker-machine env -u)
  export IP=localhost
  export REACT_APP_USERS_SERVICE_URL=http://$IP
  python services/swagger/update-spec.py http://$IP
  export SECRET_KEY=f0d41a61bc3cc5d79f5925c478c3ced8d3e2ab12c35ff231
  dc up -d --build
  all
}

if [[ "${env}" == "stage" ]]; then
  echo "\n"
  echo "Starting Stage ENV on AWS!\n"
  stage
elif [[ "${env}" == "prod" ]]; then
  echo "\n"
  echo "Starting Prod ENV on AWS!\n"
  prod
else
  echo "\n"
  echo "Starting locally!\n"
  local
fi