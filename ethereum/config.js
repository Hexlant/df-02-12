var infuraApiKey = '';

module.exports = {
    accounts: [
        {
            address: '[ 본인 주소 ]',    // TODO
            key: '[ 본인 개인키 ]'        // TODO
        },
    ],
    networks: {
        local: 'http://127.0.0.1:7545',
        ropsten: 'https://ropsten.infura.io/v3/' + infuraApiKey,
        rinkeby: 'https://rinkeby.infura.io/v3/' + infuraApiKey,
        kovan: 'https://kovan.infura.io/v3/' + infuraApiKey,
        mainnet: 'https://mainnet.infura.io/v3/' + infuraApiKey,
        hexlant: 'http://106.10.58.158:3000/v1/rpc',
    },
    deployInfo: {
        targetFile: 'erc20.sol',
        targetContract: 'ERC20',
        name: '[ 배포할 토큰의 이름 ]',             // TODO
        symbol: '[ 배포할 토큰의 심볼 ]',           // TODO
        supply: '[ 배포할 토큰의 수량 ]',           // TODO
    },
    contract: {
        address: '[ 배포 된 컨트랙트 주소 ]',
    },
    gas: {
        limit: 2000000,
        price: 30000000000, 
    },
    settings: {
        selectedAccountIndex: 0,
        selectedNetwork: 'hexlant',
    }
};
