#!/bin/sh

set -e

cd "$(dirname "$0")"

if [ -n "$1" ]; then
  if [ "$1" = "deploy" ]; then
    cd "excute"
    node index.js deploy
  elif [ "$1" = "transfer" ]; then
    cd "excute"
    node index.js transfer "$2" "$3" "$4"
  elif [ "$1" = "generate" ]; then
    cd "excute"
    node index.js generate "$2" "$3" "$4"
  else 
    echo ""
    echo "컨트랙트 배포를 원하실 경우"
    echo "./eth.sh deploy"
    echo ""
    echo "토큰 전송을 원하실 경우"
    echo "./eth.sh transfer [코인 타입] [받는 주소] [보내는 수량]"
    echo ""
    echo "정확히 입력해주세요! "
    echo ""
  fi
fi