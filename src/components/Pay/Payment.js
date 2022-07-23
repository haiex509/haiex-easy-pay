import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Web3Auth } from '@web3auth/web3auth'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import '../../css/styles.css'
import '../../css/boot.css'
import rpc from '../../services/evm'

let web3auth
export const Payment = ({ onLogged, onDisconnected, onPaid, amount, currency }) => {
  // const [web3auth, setWeb3auth] = useState(null)
  const [provider, setProvider] = useState(null)
  const [logged, setLogged] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const clientId = process.env.WEB3AUTH_KEY
    const init = async () => {
      try {
        web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: 'eip155',
            chainId: '0xaef3',
            rpcTarget: 'https://alfajores-forno.celo-testnet.org',
          },
        })

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            network: 'mainnet',
            clientId,
          },
        })

        web3auth.configureAdapter(openloginAdapter)

        await web3auth.initModal()

        if (web3auth.provider) {
          console.log('Logged')
          setProvider(web3auth.provider)
          setLogged(true)
        } else {
          console.log('not Logged')
        }
      } catch (error) {
        console.error(error)
      }
    }

    init()
  }, [])

  const login = async () => {
    try {
      await web3auth.connect({
        redirectUrl: '/',
      })
      if (web3auth.provider) {
        console.log('Logged')
        setProvider(web3auth.provider)
        setLogged(true)
        onLogged({ logged: true, message: 'User has been logged successfuly' })
      } else {
        onLogged({ logged: false, message: 'User has not been logged successfuly', error: 'Bad connection' })
        console.log('not Logged')
      }
    } catch (error) {
      onLogged({ logged: false, message: 'User has not been logged successfuly', error: error.message })
      console.error(error.message)
    }
  }
  const logout = async () => {
    try {
      await web3auth.logout()
      if (!web3auth.provider) {
        setLogged(false)

        onDisconnected({ disconnected: true })
      }
    } catch (error) {
      onLogged({ logged: false, message: 'User has not been logged successfuly', error: error.message })

      console.error(error.message)
    }
    //  window.location.reload()
  }
  const payNow = async () => {
    try {
      const pay = await rpc().sendEth(web3auth.provider, amount)
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
                  <span
                    onClick={async () => {
                      logout()
                    }}>
                    Disconnect
                  </span>
                </div>
              </div>
              <div className="row justify-content-center mrow">
                <div className="col-12">
                  <img
                    src="https://cryptologos.cc/logos/celo-celo-logo.png"
                    height="35px"
                    style={{ textDecoration: 'none' }}
                  />
                  <img
                    src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/pstweatifgo8tmub5atc"
                    height="35px"
                    style={{ textDecoration: 'none' }}
                  />
                </div>
              </div>
              <div className="form-card">
                <div className="row lrow mt-2 mb-3">
                  <div className="col-sm-8 col-12">
                    <h3>Total:</h3>
                  </div>
                  <div className="col-sm-4 col-12">
                    <h5>${parseFloat(amount).toFixed(2)}</h5>
                  </div>
                </div>
                <div className="row mb-2">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div
        dangerouslySetInnerHTML={{
          __html: status ? status : '',
        }}></div> */}
    </div>
  )
}
