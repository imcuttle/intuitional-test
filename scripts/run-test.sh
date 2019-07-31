#!/usr/bin/env bash
pids=()
runCommandBg() {
  local pid
  eval "$@" & pid=$!
  pids+=($pid)
}

array=($(ls -d packages/*))

for name in "${array[@]}"
do
	pushd $name > /dev/null
	runCommandBg "npx jest ${name}/__tests__/* $@"
	popd > /dev/null
done


for pid in "${pids[@]}"
do
	wait $pid || exit $?
done
