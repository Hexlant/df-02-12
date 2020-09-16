const Web3 = require('web3');
const solc = require('solc');
const Tx = require('ethereumjs-tx').Transaction;
const colors = require('colors'); 

const appConfig = require('../config');
const erc20 = require('../contract');
const abi = require('../contract/abi')

const accounts = appConfig['accounts'][ appConfig['settings']['selectedAccountIndex'] ];
const selectedNetwork = appConfig['networks'][ appConfig['settings']['selectedNetwork'] ];
var network = appConfig['settings']['selectedNetwork'];
if (network == 'hexlant') network == 'ropsten'; 
const contractFile = appConfig['deployInfo']['targetFile'];
const mainContract = appConfig['deployInfo']['targetContract'];
const deployTokenName = appConfig['deployInfo']['name'];
const deployTokenSymbol = appConfig['deployInfo']['symbol'];
const deployTokenSupply = appConfig['deployInfo']['supply'];
const contractAddr = appConfig['contract']['address'];
const gasPrice = appConfig['gas']['price'];
const gasLimit = appConfig['gas']['limit'];

colors.setTheme({
  verbose: 'cyan',   
  info: 'green',   
  warn: 'yellow',   
  todo: 'red' 
});

const web3 = new Web3(selectedNetwork);

function build(name, symbol, supply) {
  if (!contractFile || !mainContract || !name || !symbol || !supply) {
    console.log()
    console.log('========================================')
    console.log()
    console.log('config.js 파일안에 deployInfo를 모두 입력해주세요!'.warn)
    console.log()
    console.log('========================================')
    console.log()
    return;
  } 
  var input = {
    language: 'Solidity',
    sources: {
      [`${contractFile}`]: {
        content: erc20(name, symbol, supply)
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const bytecode = output.contracts[contractFile][mainContract].evm.bytecode.object;
  const abi = output.contracts[contractFile][mainContract].abi;
  const result = {
    bytecode,
    abi,
  }
  return result;
}

async function deploy() {
  try {  
    console.log()
    console.log('========================================')
    console.log()
    console.log('컨트랙트 빌드 중...'.verbose)
    console.log()
    console.log('========================================')
    console.log()

    const buildRet = build(deployTokenName, deployTokenSymbol, deployTokenSupply);
    const newContract = new web3.eth.Contract(buildRet.abi);
  
    let deploy = newContract.deploy({
      data: buildRet.bytecode,
      from: accounts.address}).encodeABI();
  
    const nonce = await web3.eth.getTransactionCount(accounts.address, 'pending');
    const rawTx = {
      nonce,
      gasPrice,
      gasLimit,
      data: '0x' + deploy,
    }
    const account = web3.eth.accounts.privateKeyToAccount(accounts.key);
    const signedTx = await account.signTransaction(rawTx)

    console.log()
    console.log('========================================')
    console.log()
    console.log('컨트랙트 배포 중...'.verbose)
    console.log()
    console.log('========================================')
    console.log()
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      .once('transactionHash', (hash) => {
        console.log()
        console.log('========================================')
        console.log()
        console.log('트랜잭션 해쉬 : ', hash.info);
        console.log()
        console.log('========================================')
        console.log()
      })
      .once('receipt', (receipt) => {
        console.log()
        console.log('========================================')
        console.log()
        console.log('컨트랙트 배포 완료, 현재는 Pending 상태 일 수 있습니다.')
        console.log()
        console.log('========================================')
        console.log()
        console.log()
        console.log('========================================')
        console.log()
        console.log('새로 발행된 컨트랙트 주소 : ', receipt.logs[0].address.info)
        console.log()
        console.log('========================================')
        console.log()
        console.log()
        console.log('========================================')
        console.log()
        console.log('새로 발행된 컨트랙트 주소를 config.js 파일 안 contract의 address에 추가해주세요'.todo)
        console.log()
        console.log('========================================')
        console.log()
      })
      .on('error', () => {
        console.log()
        console.log('========================================')
        console.log()
        console.log('컨트랙트 배포 중 예러 발생'.warn)
        console.log()
        console.log('========================================')
        console.log()
      })
  } catch (e) {
    return
  } 
};

async function tokenTransfer(toAddr, amount) {
  if (!contractAddr) {
    console.log()
    console.log('========================================')
    console.log()
    console.log('ㅊonfig.js 파일 안 contract의 address에 올바른 주소를 추가해주세요'.warn)
    console.log()
    console.log('========================================')
    console.log()  
    return;
  } else {
    try {
      const nonce = web3.eth.getTransactionCount(accounts.address, 'pending');

      const contract = new web3.eth.Contract(abi, contractAddr);
      const inputData = contract.methods.transfer(toAddr, web3.utils.toWei(amount, 'ether')).encodeABI();
      const symbol = await contract.methods.symbol().call();
  
      const rawTx = {
        to: contractAddr,
        value: 0,
        nonce,
        gasPrice,
        gasLimit,   
        data: inputData,
      };

      const account = web3.eth.accounts.privateKeyToAccount(accounts.key);
      const signedTx = await account.signTransaction(rawTx)
      console.log()
      console.log('========================================')
      console.log()
      console.log('트랜잭션 전파 중...'.verbose)
      console.log()
      console.log('========================================')
      console.log()
      const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('transactionHash', (hash) => {
          console.log()
          console.log('========================================')
          console.log()
          console.log('트랜잭션 해쉬 : ', hash.info);
          console.log()
          console.log('========================================')
          console.log()
        })
        .on('error', () => {
          console.log()
          console.log('========================================')
          console.log()
          console.log('트랜잭션 전파 중 예러 발생'.warn)
          console.log()
          console.log('========================================')
          console.log()
        })
        .on('receipt', (receipt) => {
          console.log()
          console.log('========================================')
          console.log()
          console.log('트랜잭션 전파 완료, 현재는 Pending 상태 일 수 있습니다.')
          console.log()
          console.log('========================================')
          console.log()
          console.log()
          console.log('========================================')
          console.log()
          console.log(' from   : ', accounts.address.info)
          console.log('  to    : ', toAddr.info)
          console.log(' amount : ', amount.info, '', symbol.info)
          console.log()
          console.log('========================================')
          console.log()
        })
    } catch (e) {
      return
    } 
  }
}

async function etherTransfer(toAddr, amount) {
  try {
    const nonce = web3.eth.getTransactionCount(accounts.address, 'pending');
    const rawTx = {
      from: accounts.address,
      to: toAddr,
      value: web3.utils.toWei(amount, 'ether'),
      gasPrice,
      gasLimit,
      nonce,
    }
    const account = web3.eth.accounts.privateKeyToAccount(accounts.key);
    const signedTx = await account.signTransaction(rawTx)
    console.log()
    console.log('========================================')
    console.log()
    console.log('트랜잭션 전파 중...'.verbose)
    console.log()
    console.log('========================================')
    console.log()
    const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      .on('transactionHash', (hash) => {
        console.log()
        console.log('========================================')
        console.log()
        console.log('트랜잭션 해쉬 : ', hash.info);
        console.log()
        console.log('========================================')
        console.log()
      })
      .on('error', () => {
        console.log()
        console.log('========================================')
        console.log()
        console.log('트랜잭션 전파 중 예러 발생'.warn)
        console.log()
        console.log('========================================')
        console.log()
      })
      .on('receipt', (receipt) => {
        console.log()
        console.log('========================================')
        console.log()
        console.log('트랜잭션 전파 완료, 현재는 Pending 상태 일 수 있습니다.')
        console.log()
        console.log('========================================')
        console.log()
        console.log()
        console.log('========================================')
        console.log()
        console.log(' from   : ', accounts.address.info)
        console.log('  to    : ', toAddr.info)
        console.log(' amount : ', amount.info, 'ETH'.info)
        console.log()
        console.log('========================================')
        console.log()
      })
  } catch (e) {
    return
  }
}

async function genSignedRawTx(type, to, amount) {
  try {
    let tx;

    // nonce 값
    const nonce = await web3.eth.getTransactionCount(accounts.address)
  
    // 이더 전송에 사용되는 트랜잭션 객체    ( type: ETH )
    if (type == 'ETH' || type == 'eth') {
      tx = {
        nonce,
        to,
        value: web3.utils.toWei(amount, 'ether'),
        gasPrice,
        gasLimit,
      }
    } else if (type == 'ERC' || type == 'erc') {
      if (!contractAddr) console.log('config.js 파일 안 contract의 address에 올바른 컨트랙트 주소를 입력해주세요.'.warn)
      // 토큰 전송에 사용되는 트랜잭션 객체    ( type: ERC )
      const token = new web3.eth.Contract(abi, contractAddr)
      const inputData = token.methods.transfer(to, web3.utils.toWei(amount, 'ether')).encodeABI()
      tx = {
        nonce,
        to,
        value: 0,
        data: inputData,
        gasPrice,
        gasLimit,
      }
    }
   
    // 계정 객체
    const account = web3.eth.accounts.privateKeyToAccount(accounts.key);
  
    // 트랜잭션 서명
    const signedTx = await account.signTransaction(tx)
  
    console.log()
    console.log('============================================')
    console.log()
    console.log('서명된 트랜잭션 데이터 : ', signedTx.rawTransaction.info)
    console.log()
    console.log('============================================')
    console.log()
  } catch (e) {
    return
  }
}




(function excution(excute) {

  // 컨트랙트 배포
  if (excute == 'deploy') {
    deploy()
  }
  
  // 이더 혹은 토큰 전송
  if (excute == 'transfer') {
    let type = process.argv[3];
    const to = process.argv[4];
    const amount = process.argv[5];
  
    if (!type || !to || !amount) {
      console.log('코인 타입과 받는 주소, 보내는 수량을 정확히 입력해주세요!'.warn)
      return
    }
    if(type == 'ETH' || type == 'eth') etherTransfer(to, amount)
    if(type == 'ERC' || type == 'erc') tokenTransfer(to, amount)
  }
  
  // 서명된 트랜잭션 생성
  if (excute == 'generate') {
    const type = process.argv[3];
    const to = process.argv[4];
    const amount = process.argv[5];
  
    if (!type || !to || !amount) {
      console.log('서명된 트랜잭션을 만들기 위해서는 코인 타입, 받는 주소, 보내는 수량을 정확히 입력해주세요'.warn)
    }
  
    if (type == 'ETH' || type == 'eth' || type == 'ERC' || type == 'erc') genSignedRawTx(type, to, amount)
  }
}(process.argv[2]))
