#!/bin/bash

# Check if an argument is passed (single or multiple files)
if [ "$1" == "1" ]; then
    python3 C:\Users\Poseidon\Desktop\Mr_Keyword\python child\hello.py 1
elif [ "$1" == "2" ]; then
    python3 C:\Users\Poseidon\Desktop\Mr_Keyword\python child\hello.py 2
else
    echo "Invalid argument"
    exit 1
fi
