"use client";

import {  useEffect, useRef, useState } from "react"
import { Payments } from "@nevermined-io/payments"

export default function Home() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false)
  const nvmRef = useRef(
    new Payments({ returnUrl: "http://localhost:8080", environment: "staging" })
  )

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
      );
      console.log(result);
    }
  }

  async function createWebservice() {
    if (nvmRef.current.isLoggedIn) {
      console.log("creating webservice");
      const result = await nvmRef.current.createWebservice({
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
      console.log(result);
    }
  }

  return (
    <main>
      <div>
        <button onClick={onLogin}>Login</button>
        {isUserLoggedIn ? "Logged in" : "Not logged in"}
        <button onClick={createSubscription}>Create Subscription</button>
        <button onClick={createWebservice}>Create Webservice</button>
      </div>
    </main>
  )
}
