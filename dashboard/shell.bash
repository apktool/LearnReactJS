#!/usr/local/env bash

bin=$(dirname "${BASH_SOURCE-$0}")
bin=$(cd "$bin" > /dev/null || exit; pwd)
cd "$bin" || exit

declare -r current_path=${bin}

function init() {
  local db_name="data.db"

  cd ${current_path}
  rm -f "${db_name}"
  sqlite3 "${db_name}" < scripts/ddl.sql
  sqlite3 "${db_name}" < scripts/dml.sql
}

"$@"