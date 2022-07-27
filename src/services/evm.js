import Web3 from 'web3'
import ABIDAPP from '../../abis/ABIDAPP.json'
import ABITOKEN from '../../abis/ABITOKEN.json'
import { ethers } from 'ethers'

const services = (provider_, account_) => {
  let account = account_
  let provider = provider_

  /**
   *
   * @param {*} provider - provider received from Web3Auth login.
   */
  const getBalance = async () => {
    // Get user's balance in ether
    const balance = ethers.utils.formatEther(
      await provider.getBalance(account.address), // Balance is in wei
    )

    return balance
  }

  /**
   *
   * @param {*} provider - provider received from Web3Auth login.
   */
  const getBalanceStable = async stableAddress => {
    const contract = new ethers.Contract(stableAddress, ABITOKEN, account)

    // Read message from smart contract
    const balance = ethers.utils.formatEther(await contract.balanceOf(account.address))
    console.log(balance)
    return balance
  }

  /**
   *
   * @param {*} provider - provider received from Web3Auth login.
   */
  const sendToken = async contractAddress => {
    // const signer = provider.getSigner(account.address)
    const amount = ethers.utils.parseEther('1.0')
    const contract = new ethers.Contract(contractAddress, ABITOKEN, account)
    const tx = await contract.transfer(account.address, amount)
    const receipt = await tx.wait()
    console.log(receipt)

    return receipt
  }

  /**
   *
   * @param {*} provider - provider received from Web3Auth login.
   */
  const send = async provider_ => {
    const signer = provider_.getSigner(account.address)

    const amount = ethers.utils.parseEther('0.0001')

    // Submit transaction to the blockchain
    const tx = await signer.sendTransaction({
      to: account.address,
      value: amount,
    })

    // Wait for transaction to be mined
    const receipt = await tx.wait()
  }

  /**
   *
   * @param {*} provider - provider received from Web3Auth login.
   */
  const sendStable = async (stableAddress, amount_) => {
    const contractAddress = '0x57050995894D576f5F55438486B40c68B07300b6'

    const contract = new ethers.Contract(contractAddress, ABIDAPP, account)
    const amount = ethers.utils.parseEther(amount_)

    const tx = await contract.sendStable(stableAddress, account.address, amount)
    const receipt = await tx.wait()

    console.log(receipt)

    return receipt
  }

  /**
   *
   * @param {*} provider - provider received from Web3Auth login.
   */
  const signMessage = async provider => {
    const pubKey = await provider.request({ method: 'eth_accounts' })

    return new Promise((resolve, reject) => {
      const web3 = new Web3()
      web3.setProvider(provider)
      // hex message
      const message = '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad'
      web3.currentProvider?.send(
        {
          method: 'eth_sign',
          params: [pubKey[0], message],
          from: pubKey[0],
        },
        (err, res) => {
          if (err) {
            return rejects(err)
          }
          return resolve(res)
        },
      )
    })
  }

  /**
   *
   * @param {*} provider - provider received from Web3Auth login.
   */
  const getAccounts = async provider => {
    const web3 = new Web3(provider)
    const accounts = await web3.eth.getAccounts()

    return accounts[0] || '--'
  }

  /**
   *
   * @param {*} provider - provider received from Web3Auth login.
   */
  const getChainId = async provider => {
    const web3 = new Web3(provider)
    const chainId = await web3.eth.getChainId()
    return chainId.toString()
  }

  /**
   *
   * @param {*} provider - provider received from Web3Auth login.
   */
  const signTransaction = async provider => {
    const web3 = new Web3(provider)
    const accounts = await web3.eth.getAccounts()

    // only supported with social logins (openlogin adapter)
    const txRes = await web3.eth.signTransaction({
      from: accounts[0],
      to: accounts[0],
      value: web3.utils.toWei('0.00001'),
    })
    return txRes
  }

  const formatBigNumber = n => {
    let numArr = n.split(',')
    let num = numArr.length

    switch (num) {
      case 1:
        return numArr[0] + ' '
      case 2:
        return numArr[0] + 'K'
      case 3:
        return numArr[0] + 'M'
      case 4:
        return numArr[0] + 'B'
      case 5:
        return numArr[0] + 'T'
      case 6:
        return numArr[0] + 'Q'
      case 7:
        return numArr[0] + 'Qi'
      default:
        return numArr[0]
    }
  }

  const shortenAddress = (address, num = 7) => `${address.slice(0, num)}...${address.slice(address.length - num)}`
  const getErcAddr = symbol => {
    switch (symbol) {
      case 'HTG':
        return '0x8Eacb8F72BE04cfBa9e6553C760E14793A545D45'
      case 'DOP':
        return '0x3Ca856Dbe27d4132103a0A3c158e23Cee16c37fa'
      case 'USD':
        return '0xEc4686e5273322eAE84a0af8abd47ba3f5f68959'
      case 'DAPP':
        return '0x57050995894D576f5F55438486B40c68B07300b6'
      default:
        return ''
    }
  }
  const formatMoney = n => {
    return '' + (Math.round(n * 100) / 100).toLocaleString()
  }
  return {
    signMessage,
    getAccounts,
    getChainId,
    getBalance,
    signTransaction,
    getBalanceStable,
    sendToken,
    sendStable,
    send,
    formatBigNumber,
    shortenAddress,
    getErcAddr,
    formatMoney,
  }
}

export default services
