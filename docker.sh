#!/bin/bash

# Called by DockerCompiler.js:execute()
# Usage ./docker.sh file.txt node node:20 4

# Copies necessary files to /temp and spins up docker container with /temp mounted for code compilation
# Once running executes runner.sh script to carry out compilation and testing
# after process is done and exits, we kill and remove the container

fileName=$1
executor=$2
image=$3
fileExt=$4
output=$5
input=$6

cp ./tests/$output ./temp/test.txt
cp ./tests/$fileName ./temp/$fileName
cp ./tests/$input ./temp/$input

cont=$(docker run -it -d -v "$(pwd)"/temp:/temp -w /temp "$image")

sudo docker exec "$cont" ./runner.sh $fileName

output=$(docker logs "$cont")
echo "output: $output"

docker kill $cont &>/dev/null
docker rm $cont &>/dev/null
