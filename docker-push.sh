#!/bin/sh

if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]
then

  if [[ "$TRAVIS_BRANCH" == "staging" ]]; then
    export DOCKER_ENV=stage
    export REACT_APP_USERS_SERVICE_URL="http://testdriven-staging-alb-406204066.us-west-1.elb.amazonaws.com"
  elif [[ "$TRAVIS_BRANCH" == "production" ]]; then
    export DOCKER_ENV=prod
    export REACT_APP_USERS_SERVICE_URL="http://testdriven-production-alb-919309532.us-west-1.elb.amazonaws.com"
    export DATABASE_URL="$AWS_RDS_URI"  # new
    export SECRET_KEY="$PRODUCTION_SECRET_KEY"  # new
  fi

  if [ "$TRAVIS_BRANCH" == "staging" ] || \
     [ "$TRAVIS_BRANCH" == "production" ]
  then
    curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
    unzip awscli-bundle.zip
    ./awscli-bundle/install -b ~/bin/aws
    export PATH=~/bin:$PATH
    # add AWS_ACCOUNT_ID, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY env vars
    eval $(aws ecr get-login --region us-west-1 --no-include-email)
    export TAG=$TRAVIS_BRANCH
    export REPO=$AWS_ACCOUNT_ID.dkr.ecr.us-west-1.amazonaws.com
  fi

  if [ "$TRAVIS_BRANCH" == "staging" ] || \
     [ "$TRAVIS_BRANCH" == "production" ]
  then
    # users
    cd services/users
    docker pull $REPO/$USERS:$TRAVIS_BRANCH
    docker build --cache-from $REPO/$USERS:$TRAVIS_BRANCH -t $USERS:$COMMIT -f Dockerfile-$DOCKER_ENV . # new
    docker tag $USERS:$COMMIT $REPO/$USERS:$TAG
    docker tag $USERS:$COMMIT $REPO/$USERS:$COMMIT
    docker tag $USERS:$COMMIT $REPO/$USERS:latest
    docker push $REPO/$USERS:$TAG
    docker push $REPO/$USERS:$COMMIT
    docker push $REPO/$USERS:latest
    cd ../../
    # users db
    cd services/users/project/db
    docker pull $REPO/$USERS_DB:$TRAVIS_BRANCH
    docker build --cache-from $REPO/$USERS_DB:$TRAVIS_BRANCH -t $USERS_DB:$COMMIT -f Dockerfile .
    docker tag $USERS_DB:$COMMIT $REPO/$USERS_DB:$TAG
    docker tag $USERS_DB:$COMMIT $REPO/$USERS_DB:$COMMIT
    docker tag $USERS_DB:$COMMIT $REPO/$USERS_DB:latest
    docker push $REPO/$USERS_DB:$TAG
    docker push $REPO/$USERS_DB:$COMMIT
    docker push $REPO/$USERS_DB:latest
    cd ../../../../
    # client
    cd services/client
    docker pull $REPO/$CLIENT:$TRAVIS_BRANCH
    docker build --cache-from $REPO/$CLIENT:$TRAVIS_BRANCH -t $CLIENT:$COMMIT -f Dockerfile-$DOCKER_ENV --build-arg REACT_APP_USERS_SERVICE_URL=$REACT_APP_USERS_SERVICE_URL . # new
    docker tag $CLIENT:$COMMIT $REPO/$CLIENT:$TAG
    docker tag $CLIENT:$COMMIT $REPO/$CLIENT:$COMMIT
    docker tag $CLIENT:$COMMIT $REPO/$CLIENT:latest
    docker push $REPO/$CLIENT:$TAG
    docker push $REPO/$CLIENT:$COMMIT
    docker push $REPO/$CLIENT:latest
    cd ../../
    # swagger
    cd services/swagger
    docker pull $REPO/$SWAGGER:$TRAVIS_BRANCH
    docker build --cache-from $REPO/$SWAGGER:$TRAVIS_BRANCH -t $SWAGGER:$COMMIT -f Dockerfile-$DOCKER_ENV  . # new
    docker tag $SWAGGER:$COMMIT $REPO/$SWAGGER:$TAG
    docker tag $SWAGGER:$COMMIT $REPO/$SWAGGER:$COMMIT
    docker tag $SWAGGER:$COMMIT $REPO/$SWAGGER:latest
    docker push $REPO/$SWAGGER:$TAG
    docker push $REPO/$SWAGGER:$COMMIT
    docker push $REPO/$SWAGGER:latest
    cd ../../
  fi
fi