"use client";

import {  useEffect, useRef, useState } from "react"
import { Payments } from "@nevermined-io/payments"

export default function Home() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false)
  const nvmRef = useRef(
    new Payments({ returnUrl: "http://localhost:8080", environment: "appStaging" })
  )
  const [subscriptionDid, setSubscriptionDid] = useState<string>("")
  const [serviceDid, setServiceDid] = useState<string>("")
  const [fileDid, setFileDid] = useState<string>("")

  const onLogin = () => {
    nvmRef.current.connect()
  }

  useEffect(() => {
    nvmRef.current.init()
  }, []);

  useEffect(() => {
    if(nvmRef.current.isLoggedIn) {
      setIsUserLoggedIn(true)
    }
  }, [nvmRef.current.isLoggedIn])


  async function createSubscription() {
    if (nvmRef.current.isLoggedIn) {
      console.log("creating subscription");
      const result = await nvmRef.current.createSubscription({
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
    if (nvmRef.current.isLoggedIn) {
      console.log("creating webservice");
      const result = await nvmRef.current.createService({
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
    if (nvmRef.current.isLoggedIn) {
      console.log("creating dataset");
      const result = await nvmRef.current.createFile({
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
    nvmRef.current.getSubscriptionDetails(did)
  }

  const onServiceGoToDetails = (did: string) => {
    nvmRef.current.getServiceDetails(did)
  }

  const onFileGoToDetails = (did: string) => {
    nvmRef.current.getFileDetails(did)
  }


  return (
    <main>
      <div>
        <button onClick={onLogin}>Login</button>
        {isUserLoggedIn ? "Logged in" : "Not logged in"}
        <div>
          <button onClick={createSubscription}>Create Subscription</button>
          <button onClick={createService}>Create Webservice</button>
          <button onClick={createFile}>Create Dataset</button>
        </div>
        {subscriptionDid && <div>Subscription DID: <button onClick={() => onSubscritionGoToDetails(subscriptionDid)}>{subscriptionDid}</button> </div>}
        {serviceDid && <div>Service DID: <button onClick={() => onServiceGoToDetails(serviceDid)}>{serviceDid}</button> </div>}
        {fileDid && <div>File DID: <button onClick={() => onFileGoToDetails(fileDid)}>{fileDid}</button> </div>}
      </div>
    </main>
  )
}
