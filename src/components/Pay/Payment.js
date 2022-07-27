import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import '../../css/styles.css'
import '../../css/boot.css'
import services from '../../services/evm'
import OpenLogin from '@toruslabs/openlogin'

let web3auth, account, provider
export const Payment = ({ onLogged, onPaid, amount, currency }) => {
  const [logged, setLogged] = useState(false)
  const [loading, setLoading] = useState(false)

  const [confirmed, setConfirmed] = useState(false)
  const [info, setInfo] = useState(null)
  const [service, setService] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const clientId = process.env.WEB3AUTH_KEY

    const init = async () => {
      try {
        web3auth = new OpenLogin({
          clientId,
          network: 'mainnet',
        })

        await web3auth.init()

        if (web3auth.privKey) {
          console.log(web3auth.privKey)

          provider = new ethers.providers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org')
          const wallet = new ethers.Wallet('0x' + web3auth.privKey, provider)
          account = wallet.connect(provider)

          const serv = services(provider, account)
          setService(serv)

          let info_ = {}
          info_.provider = provider
          info_.address = account.address
          info_.balance = await serv.getBalance()
          info_.stableBalance = await serv.getBalanceStable(serv.getErcAddr(currency))

          setInfo(info_)

          setLogged(true)
        } else {
          setLogged(false)
        }
      } catch (error) {
        console.error(error)
      }
    }

    init()
  }, [])

  const login = async () => {
    try {
      await web3auth.login({
        redirectUrl: 'http://localhost:6006/iframe.html?id=app-payment-modules--payment&viewMode=story',
      })
    } catch (error) {}
  }
  const logout = async () => {
    try {
      await web3auth.logout()
      window.location.reload()
    } catch (error) {
      onLogged({ logged: false, message: 'User has not been logged successfuly', error: error.message })

      console.error(error.message)
    }
  }
  const payNow = async () => {
    try {
      setLoading(true)
      const pay = await service.sendStable(service.getErcAddr(currency), amount)
      if (pay) {
        setMessage('Payment confirmed')
      } else {
        setMessage('Payment failled')
      }
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setLoading(false)
      onPaid({ paid: true, message: pay })
    } catch (error) {
      onPaid({ paid: false, message: 'paid fail', error: error.message })

      console.error(error.message)
    }
    setConfirmed(false)
  }

  return (
    <div>
      <div>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="card my-4 p-3" style={{ backgroundColor: '#343a40' }}>
              <div className="row main mb-2">
                <div className="col-12">
                  {logged && (
                    <a
                      style={{ cursor: 'pointer' }}
                      onClick={async () => {
                        logout()
                      }}>
                      Disconnect
                    </a>
                  )}
                </div>
              </div>
              <div className="row justify-content-center mrow">
                <div className="col-7">
                  <img
                    src="https://cryptologos.cc/logos/celo-celo-logo.png"
                    height="35px"
                    style={{ textDecoration: 'none' }}
                  />
                </div>
                <div className="col-5">
                  {info && (
                    <h5 style={{}}>
                      {service &&
                        info &&
                        info.stableBalance &&
                        service.formatMoney(parseFloat(info.stableBalance).toFixed(2))}
                      {' ' + currency}
                    </h5>
                  )}
                </div>
              </div>
              <div className="form-card">
                <h6>{service && info && service.shortenAddress(info.address, 7)}</h6>

                <div className="row lrow mt-2 mb-3">
                  <div className="col-7">
                    <h3 style={{}}>Total:</h3>
                  </div>
                  <div className="col-5">
                    <h5 style={{}}>
                      {parseFloat(amount).toFixed(2)} {' ' + currency}{' '}
                    </h5>
                  </div>
                </div>
                <div className="row mb-2">
                  {!loading ? (
                    <div className="col-sm-12">
                      {!logged ? (
                        <button
                          type="button"
                          className="btn btn-success btn-block col-12"
                          onClick={async () => {
                            login()
                          }}>
                          Connect Now
                        </button>
                      ) : (
                        <div>
                          {!confirmed ? (
                            <button
                              type="button"
                              className="btn btn-primary btn-block col-12"
                              onClick={async () => {
                                setConfirmed(true)
                              }}>
                              Pay Now
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-success btn-block col-12"
                              onClick={async () => {
                                payNow()
                              }}>
                              Confirm transaction
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="btn btn-default btn-block col-12 text-white">Loading...</span>
                  )}
                </div>
              </div>
              {message && <p style={{ color: '#fff', margin: 'auto', marginTop: 10 }}>{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
