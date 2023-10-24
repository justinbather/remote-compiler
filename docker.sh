#!/bin/bash

set -e

fileName=$1
executor=$2
image=$3

to=100

cont=$(docker run -it -d -v "$(pwd)"/temp:/temp -w /temp "$image")

# Add a sleep to allow the container to start
# sleep 5

  
  docker exec "$cont" "$executor" "$fileName"
#   output=$(docker logs "$cont")
  docker stop "$cont" &> /dev/null

  docker rm $cont &> /dev/null

#   echo "output: "
#   echo "$output"

#   if [ -z "$output" ]; then
#     echo "Status: Timeout"
#   else
#     echo "Status: Exited"
#   fi
