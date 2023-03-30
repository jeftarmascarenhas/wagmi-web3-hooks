import "@/styles/globals.css";
import { useEffect, useState } from "react";
import type { AppProps } from "next/app";

import { WagmiConfig, createClient, configureChains } from "wagmi";
import { avalanche, goerli, mainnet, optimism } from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, optimism, avalanche],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "Wagmi",
      },
    }),
  ],
  provider,
  webSocketProvider,
});

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    ready && (
      <WagmiConfig client={client}>
        <Component {...pageProps} />
      </WagmiConfig>
    )
  );
}
