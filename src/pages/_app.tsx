import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { WagmiConfig, createClient, configureChains } from "wagmi";
import {
  avalanche,
  goerli,
  mainnet,
  optimism,
  bsc,
  bscTestnet,
} from "wagmi/chains";
import { useEffect, useState } from "react";

// import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import {
  BinanceWalletConnector,
  BinanceSmallConnector,
} from "@/libs/wagmi/connnectors/binanceWallet";

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, optimism, avalanche, bsc, bscTestnet],
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
        appName: "Bush Associates",
      },
    }),
    BinanceSmallConnector,
  ],
  provider,
  webSocketProvider,
});

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ready) {
      setReady(true);
    }
  }, [ready]);

  return (
    ready && (
      <WagmiConfig client={client}>
        <Component {...pageProps} />
      </WagmiConfig>
    )
  );
}
