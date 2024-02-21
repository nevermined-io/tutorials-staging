"use client";

import { useEffect, useRef } from "react";
import { Payments } from "@nevermined-io/payments";

export default function Home() {
  const nvmRef = useRef(
    new Payments({ returnUrl: "http://localhost:8080", environment: "staging" })
  );

  const onLogin = () => {
    nvmRef.current.connect();
  };

  useEffect(() => {
    nvmRef.current.init();
  }, []);

  useEffect(() => {
    async function createSubscription() {
      if (nvmRef.current.isLoggedIn()) {
        console.log("creating subscription");
        const result = await nvmRef.current.createSubscription(
          "test subscription",
          "test",
          10000000n,
          "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
          undefined,
          30,
          ["test"]
        );
        console.log(result);
      }
    }

    createSubscription();
  }, []);

  return (
    <main>
      <div>
        <button onClick={onLogin}>Login</button>
      </div>
    </main>
  );
}
