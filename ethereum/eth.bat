@ECHO OFF 

set argc=0
for %%x in (%*) do Set /A argc+=1

IF %argc% == 0 ( 
  echo.
  echo.��Ʈ��Ʈ ������ ���Ͻ� ���
  echo../eth.sh deploy
  echo. 
  echo.��ū ������ ���Ͻ� ���
  echo../eth.sh transfer [���� Ÿ��] [�޴� �ּ�] [������ ����]
  echo. 
  echo.��Ȯ�� �Է����ּ���!
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