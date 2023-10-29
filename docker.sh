#!/bin/bash

# Called by DockerCompiler.js:execute() 
# Usage ./docker.sh file.txt node node:20 4

# Copies necessary files to /temp and spins up docker container with /temp mounted for code compilation
# Once running executes runner.sh script to carry out compilation and testing
# after process is done and exits, we kill and remove the container


fileName=$1
executor=$2
image=$3
testid=$4

cp ./tests/twoSum.txt ./temp/test.txt
cp ./tests/$fileName ./temp/test.js

cont=$(docker run -it -d -v "$(pwd)"/temp:/temp -w /temp "$image")

  docker exec "$cont" ./runner.sh

  output=$(docker logs "$cont")
  echo "output: $output"
  docker kill $cont &> /dev/null
  docker rm $cont &> /dev/null
