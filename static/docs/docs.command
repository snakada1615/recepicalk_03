#!/bin/bash
MY_DIRNAME=$(dirname $0)
cd $MY_DIRNAME
vuedoc.md components/*/*.vue --output static/docs/
find *.md > filelist.txt
