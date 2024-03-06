"use client";

import { Payments } from "@nevermined-io/payments";
import { useEffect, useRef, useState } from "react"

export default function Home() {
  const nvmRef = useRef(
    new Payments({ returnUrl: "http://localhost:8080", environment: "appStaging", appId: "test", version: "v1"})
  )
  
  const [payments, setPayments] = useState<Payments>(nvmRef.current)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false)
  const [subscriptionDid, setSubscriptionDid] = useState<string>("")
  const [serviceDid, setServiceDid] = useState<string>("")
  const [fileDid, setFileDid] = useState<string>("")

  const onLogin = () => {
    nvmRef.current.connect()
  }

  const onLogout = () => {
    nvmRef.current.logout()
    setPayments(nvmRef.current)
    setIsUserLoggedIn(payments.isLoggedIn)
  }

  useEffect(() => {
    nvmRef.current.init()
    setPayments(nvmRef.current)
  }, [])

  useEffect(() => {
    if (payments.isLoggedIn) {
      setIsUserLoggedIn(true)
    }
  }, [payments.isLoggedIn])


  async function createSubscription() {
    if (payments.isLoggedIn) {
      console.log("creating subscription");
      const result = await payments.createSubscription({
        name: "test subscription",
        description: "test",
        price: 10000000n,
        tokenAddress: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
        amountOfCredits: undefined,
        duration: 30,
        tags: ["test"]
      }
      )
      setSubscriptionDid(result.did)
      console.log(result)
    }
  }

  async function createService() {
    if (payments.isLoggedIn) {
      console.log("creating webservice");
      const result = await payments.createService({
        subscriptionDid: "did:nv:6b1bcfd7b41b688b1cddd3dfdd847fbaa0c90014cad33026fa4f768503260de6", 
        name: "test webservice",
        description: "test",
        price: 10000000n,
        tokenAddress: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
        serviceChargeType: "fixed",
        authType: "none",
        amountOfCredits: 0,
        duration: 30,
        endpoints: [{ post: "https://chatgpt-plugin.nevermined.app/ask" }],
        openEndpoints: ["https://chatgpt-plugin.nevermined.app/openapi.json"],
        openApiUrl: "https://chatgpt-plugin.nevermined.app/openapi.json",
        tags: ["test"]
      })
      setServiceDid(result.did)
      console.log(result);
    }
  }

  async function createFile() {
    if (payments.isLoggedIn) {
      console.log("creating dataset");
      const result = await payments.createFile({
        subscriptionDid: "did:nv:6b1bcfd7b41b688b1cddd3dfdd847fbaa0c90014cad33026fa4f768503260de6", 
        name: "test dataset",
        description: "test",
        price: 10000000n,
        tokenAddress: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
        amountOfCredits: 0,
        duration: 30,
        tags: ["test"], 
        assetType: 'model',
        files: [
          {
            index: 0,
            contentType: "text/markdown",
            url: "https://raw.githubusercontent.com/nevermined-io/tutorials/main/README.md",
          }]
      })
      setFileDid(result.did)
      console.log(result);
    }
  }

  const onSubscritionGoToDetails = (did: string) => {
    payments.getSubscriptionDetails(did)
  }

  const onServiceGoToDetails = (did: string) => {
    payments.getServiceDetails(did)
  }

  const onFileGoToDetails = (did: string) => {
    payments.getFileDetails(did)
  }


  return (
    <main>
      <div>
        {!isUserLoggedIn && <button onClick={onLogin}>{"Log in"}</button>}
        {isUserLoggedIn && <button onClick={onLogout}>{"Log out"}</button>}

        <div>
          <button disabled={!isUserLoggedIn} onClick={createSubscription}>Create Subscription</button>
          <button disabled={!isUserLoggedIn} onClick={createService}>Create Webservice</button>
          <button disabled={!isUserLoggedIn} onClick={createFile}>Create Dataset</button>
        </div>
        {isUserLoggedIn && <div>User is logged in with app ID {payments.appId} and version {payments.version}</div>}
        {isUserLoggedIn && subscriptionDid && <div>Subscription DID: <button onClick={() => onSubscritionGoToDetails(subscriptionDid)}>{subscriptionDid}</button> </div>}
        {isUserLoggedIn && serviceDid && <div>Service DID: <button onClick={() => onServiceGoToDetails(serviceDid)}>{serviceDid}</button> </div>}
        {isUserLoggedIn && fileDid && <div>File DID: <button onClick={() => onFileGoToDetails(fileDid)}>{fileDid}</button> </div>}
      </div>
    </main>
  )
}
