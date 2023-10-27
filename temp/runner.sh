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
    test_id="${values[0]}"
    input="${values[1]}"
    expected="${values[2]}"
    x=$(node test.js "$input")
    
    if [[ "$x" == "$expected" ]]; then
    echo "$test_id,$input,$expected,$x" >> output.txt
    else 
        echo "failed: $test_id,$input,$expected,$x" >> output.txt
        mv output.txt errors.txt
        exit 1
    fi

    # echo "input: $input"
    # echo "output: $output"


    # for i in "${values[@]}"
    # do  
    #      node test.js "$input"
       
    # done

done < "$INFILE"

mv output.txt success.txt