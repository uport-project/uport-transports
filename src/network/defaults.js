const NETWORK = 'rinkeby'

const networks = {
  mainnet: {
    id: '0x1',
    registry: '0xab5c8051b9a1df1aab0149f8b0630848b7ecabf6',
    rpcUrl: 'https://mainnet.infura.io/v3/e72b472993ff46d3b5b88faa47214d7f',
  },
  ropsten: {
    id: '0x3',
    registry: '0x41566e3a081f5032bdcad470adb797635ddfe1f0',
    rpcUrl: 'https://ropsten.infura.io/v3/e72b472993ff46d3b5b88faa47214d7f',
  },
  kovan: {
    id: '0x2a',
    registry: '0x5f8e9351dc2d238fb878b6ae43aa740d62fc9758',
    rpcUrl: 'https://kovan.infura.io/v3/e72b472993ff46d3b5b88faa47214d7f',
  },
  rinkeby: {
    id: '0x4',
    registry: '0x2cc31912b2b0f3075a87b3640923d45a26cef3ee',
    rpcUrl: 'https://rinkeby.infura.io/v3/e72b472993ff46d3b5b88faa47214d7f',
  },
}

export { networks, NETWORK }
