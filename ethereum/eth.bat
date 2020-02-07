@ECHO OFF 

set argc=0
for %%x in (%*) do Set /A argc+=1

IF %argc% == 0 ( 
  echo.
  echo.컨트랙트 배포를 원하실 경우
  echo../eth.sh deploy
  echo. 
  echo.토큰 전송을 원하실 경우
  echo../eth.sh transfer [코인 타입] [받는 주소] [보내는 수량]
  echo. 
  echo.정확히 입력해주세요!
  echo. 
) ELSE (
  IF "%1" == "deploy"  (
    cd "excute"
    node index.js deploy
  )
  IF "%1" == "transfer"  (
    cd "excute"
    node index.js transfer "%2" "%3" "%4"
  )
  IF "%1" == "generate" (
    cd "excute"
    node index.js generate "%2" "%3" "%4"
  )  
)