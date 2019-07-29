#!/bin/bash

DEST_PATH=src/main/webapp/assets/styles/built
INPUT_PATH=src/main/webapp/assets/styles/custom-themes/


echo Building custom theme scss files.

# Get the files
FILES=$(find $INPUT_PATH -name "*.scss")

for FILE in $FILES
do
  FILENAME=${FILE#$INPUT_PATH}
  BASENAME=${FILENAME%.scss}
  $(npm bin)/node-sass $FILE > $DEST_PATH/$BASENAME.css
done

echo Finished building CSS.
