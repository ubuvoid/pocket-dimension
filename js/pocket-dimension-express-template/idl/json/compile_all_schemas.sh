# compile_all_schemas.sh
#
# Convenience script to convert all the '.js' schemas into json with
# dependencies resolved. Good for testing whether the schemas result in valid
# javascript objects.
#
# You almost certainly don't want to commit the resulting json files to github
# (because it would be annoying to track whether this script has been run), so
# you can use delete_all_json.sh afterwards to clean up all json files in
# the schema directory.
#
# NOTE: This script attempts to delete the existing json files before
# recompiling, so you'll see extraneous 'file does not exist' errors during that
# step on your first run. These are safe to ignore.

# make sure we're working from the directory of the script, not the caller's
# working directory.
#
# found on stack overflow, tested on linux mint 19. if you find compatibilty
# issues with your platform, please uploaded fixes or workarounds here. thanks!
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)"

pushd $DIR
for filename in $(find ./src -name "*.js"); do outfile="$filename""on"; rm $outfile ; node ./compile2json.js $filename > $outfile ; done
echo "done. if you see any errors other than 'rm: cannot remove <filename>: No such file or directory', then the js schemas did not evaluate to valid json objects."
popd
