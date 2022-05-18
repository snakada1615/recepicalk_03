#!/bin/bash
MY_DIRNAME=$(dirname $0)
cd $MY_DIRNAME
/Users/shunichinakada/Documents/nuxt/recepi-calk03/node_modules/.bin/vuedoc.md /Users/shunichinakada/Documents/nuxt/recepi-calk03/components/*/*.vue --output /Users/shunichinakada/Documents/nuxt/recepi-calk03/static/docs/
/Users/shunichinakada/Documents/nuxt/recepi-calk03/node_modules/.bin/vuedoc.md /Users/shunichinakada/Documents/nuxt/recepi-calk03/pages/*.vue --output /Users/shunichinakada/Documents/nuxt/recepi-calk03/static/docs/
find *.md > filelist.txt
