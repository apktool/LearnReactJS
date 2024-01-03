#!/usr/local/env bash

bin=$(dirname "${BASH_SOURCE-$0}")
bin=$(cd "$bin" > /dev/null || exit; pwd)
cd "$bin" || exit

declare -r current_path=${bin}

function env() {
  cd ${current_path}

  local file=".env"

  rm -f "${file}"
  touch "${file}"
  echo "AUTH_SECRET=$(openssl rand -base64 32)" >> .env
  echo "AUTH_URL=http://localhost:3000/api/auth" >> .env
}

function init() {
  local db_name="data.db"

  cd ${current_path}
  rm -f "${db_name}"
  sqlite3 "${db_name}" < scripts/ddl.sql
  sqlite3 "${db_name}" < scripts/dml.sql
}

:<<'!'
username: user@nextmail.com
password: 123456
!

"$@"