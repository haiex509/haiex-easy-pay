const networks = [
  {
    name: 'CELO',
    decimals: 18,
    main: {
      node: 'https://forno.celo.org',
      chainid: 42220,
      chainIdHex: '0xa4ec',
      blockExplorer: 'https://explorer.celo.org',
      DAPP: {
        type: 'ADAPP',
        name: 'DAPP',

        address: '0x18C50Aad7f7450C49F2A0aF0aa097915358Cc004',
      },
      GOUD: {
        type: 'TOKEN',
        name: 'TGOUD',
        decimals: 18,

        address: '0x1aFE8796C2734Ab5938265c335bd49B5E7E48CfD',
      },
      USD: {
        type: 'TOKEN',
        name: 'Celo Dollar',
        decimals: 18,

        address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
      },
    },
  },

  {
    name: 'ALFAROJES',
    decimals: 18,
    withdrawWallet: '0xbff2ebc5bd7405d6574f05d1e54834a97a7eaa17',
    depositWallet: '0xbff2ebc5bd7405d6574f05d1e54834a97a7eaa17',
    webhooksGas:
      'https://api.defender.openzeppelin.com/autotasks/c9114d6c-83ed-484c-ac7f-a2d533ed93bb/runs/webhook/6ed50cf7-8219-4af4-a547-c2c70baf134b/Uod2q7z9Nu2JL8zdsyXYKW',
    webhooksUsd:
      'https://api.defender.openzeppelin.com/autotasks/08483ca7-3e8f-49a5-8fd4-59cb0bd555e6/runs/webhook/6ed50cf7-8219-4af4-a547-c2c70baf134b/VywawDwhdRiuFLdcfbUTaZ',
    webhooksHtg:
      'https://api.defender.openzeppelin.com/autotasks/9c600a4c-74e1-4f7e-a96f-d3f914d5ae20/runs/webhook/6ed50cf7-8219-4af4-a547-c2c70baf134b/BPh9FGfojqVmZcB7eXVnQL',
    main: {
      node: 'https://alfajores-forno.celo-testnet.org',
      chainid: 44787,
      chainIdHex: '0x64',
      blockExplorer: 'https://alfajores-blockscout.celo-testnet.org',

      decimals: 18,
      DAPP: {
        type: 'ADAPP',
        name: 'DAPP',
        address: '0x57050995894D576f5F55438486B40c68B07300b6',
      },
      stables: {
        HTG: {
          type: 'TOKEN',
          name: 'TGOUD',
          decimals: 18,
          address: '0x8Eacb8F72BE04cfBa9e6553C760E14793A545D45',
        },
        USD: {
          type: 'TOKEN',
          name: 'USDC',
          decimals: 18,
          address: '0xEc4686e5273322eAE84a0af8abd47ba3f5f68959',
        },
        DOP: {
          type: 'TOKEN',
          name: 'DOP',
          decimals: 18,
          address: '0x3Ca856Dbe27d4132103a0A3c158e23Cee16c37fa',
        },
      },
    },
  },
]

export default networks
