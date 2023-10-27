#!/bin/bash

# declare -A inputs=( [1]=hello [2]=hi )

# declare -A expected=( [1]=hello [2]=hi )

INFILE=$(pwd)/tests.txt


# cat "$INFILE" | while read LINE
# do  
#     echo "$LINE"
#     IFS=, read -ra values <<< "$LINE"
#     for i in "${values[@]}"
#     do  
#         echo "$i"
#     done
# done

while IFS='' read -r LINE || [ -n "${LINE}" ]; do

    IFS=, read -ra values <<< "$LINE"
    for i in "${values[@]}"
    do  
        echo "$i"
    done

done < "$INFILE"