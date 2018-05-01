const registryArtifact = require('uport-registry')

const NETWORK = 'rinkeby'

const networks = {
  'mainnet':   {  id: '0x1',
                  registry: registryArtifact.networks['1'].address,
                  rpcUrl: 'https://mainnet.infura.io' },
  'ropsten':   {  id: '0x3',
                  registry: registryArtifact.networks['3'].address,
                  rpcUrl: 'https://ropsten.infura.io' },
  'kovan':     {  id: '0x2a',
                  registry: registryArtifact.networks['42'].address,
                  rpcUrl: 'https://kovan.infura.io' },
  'rinkeby':   {  id: '0x4',
                  registry: registryArtifact.networks['4'].address,
                  rpcUrl: 'https://rinkeby.infura.io' }
}

export { networks, NETWORK }
