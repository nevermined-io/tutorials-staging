[![banner](https://raw.githubusercontent.com/nevermined-io/assets/main/images/logo/banner_logo.png)](https://nevermined.io)

# Tutorial on how to use the Nevermined Payments Protocol in a React app (using Nextjs)

## Quickstart

Run the development server

```
yarn
yarn dev
```

### Initialize the payments library

For a full description of what you can do with the _payments_ library please refer to [@nevermined-io/payments](https://github.com/nevermined-io/payments)

```typescript
import { useEffect } from "react";
import { Payments } from "@nevermined-io/payments";

export default function Home() {
  const payments = new Payments({
    returnUrl: "http://localhost:8080",
    environment: "staging",
  });

  const onLogin = () => {
    payments.connect();
  };

  useEffect(() => {
    payments.init();
  }, []);

  return (
    <main>
      <div>
        <button onClick={onLogin}>Login</button>
      </div>
    </main>
  );
}
```

The `init()` method should be called immediately after the app returns the user to `returnUrl`.

### Create a subscription

Once the app is initialized we can create a subscription:

```typescript
async function createSubscription() {
  if (payments.isLoggedIn) {
    const { did } = await payments.createSubscription({
      name: "test subscription",
      description: "test",
      price: 10000000n,
      tokenAddress: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
      duration: 30,
      tags: ["test"],
    });
  }
}
```
