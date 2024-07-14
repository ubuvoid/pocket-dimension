#!/bin/bash
#
# delete_all_json.sh
#
# Deletes all .json files in the schema directory. Use this after 'compile_all_schemas.sh' to clean your workspace after a successful compilation. 


# make sure we're working from the directory of the script, not the caller's
# working directory.
#
# found on stack overflow, tested on linux mint 19. if you find compatibilty
# issues with your platform, please uploaded fixes or workarounds here. thanks!
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)"

echo Removing .json files from $DIR

for filename in $(find $DIR/src -name "*.json"); do rm $filename ; done

echo "done"
