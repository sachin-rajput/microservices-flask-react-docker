#!/bin/bash

dm env testdriven-prod

variable=`dm env testdriven-prod | grep 'DOCKER_HOST'|cut -f2 -d "="|cut -f2 -d "/"`