#!/bin/bash

declare -A inputs=( [1]=hello [2]=hi )

declare -A expected=( [1]=hello [2]=hi )

for key in "${!inputs[@]}"; do
    echo "$key"
    echo "${inputs[$key]}"
    echo "${expected[$key]}"

done