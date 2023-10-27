#!/bin/bash
# This script carries out the operations required to compile a users code and compare to the test cases
# Called by the container upon start up in DockerCompiler.js:execute()

#We run the users code and compare the output to the test case expected output
#if equal we write it to output.txt
# if all equal we rename output.txt to success.txt
# else write it to output and rename to errors.txt
# there is a setInterval() waiting for a success or error file to be written


#File to read test cases from
# Contains test_id,input,expected_output
INFILE=$(pwd)/test.txt 






#Read the INFILE, for each line (test case), store the values and save the result of the users code into a variable
while IFS='' read -r LINE || [ -n "${LINE}" ]; do

    IFS=, read -ra values <<< "$LINE"
    test_id="${values[0]}"
    input="${values[1]}"
    expected="${values[2]}"
    echo $input
    echo "expected: $expected"
    x=$(node test.js "$input")
    echo "recieved: $x"


    
    # Compare expected output from test with user code result
    if [[ "$x" == "$expected" ]]; then
    echo "$test_id,$input,$expected,$x" >> output.txt
    else 
        echo "failed: $test_id,$input,$expected,$x" >> output.txt
        mv output.txt errors.txt
        exit 1
    fi

done < "$INFILE"

mv output.txt success.txt

rm test.txt
rm temp/test.js
