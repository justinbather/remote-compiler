#!/bin/bash

set -e

fileName=$1
executor=$2
image=$3

cont=$(docker run -it -d -v "$(pwd)"/temp:/temp -w /temp "$image")
  
  docker exec "$cont" "$executor" "$fileName"
#   output=$(docker logs "$cont")
  # docker stop "$cont" &> /dev/null
  docker kill $cont &> /dev/null
  docker rm $cont &> /dev/null

#   add timeout?