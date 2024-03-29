import {
  ConnectorNotFoundError,
  UserRejectedRequestError,
  RpcError,
  ResourceUnavailableError,
  SwitchChainNotSupportedError,
} from "wagmi";

import { InjectedConnector } from "wagmi/connectors/injected";
import { Chain, Ethereum } from "@wagmi/core";
import { hexValue } from "ethers/lib/utils.js";

declare global {
  interface Window {
    BinanceChain?: {
      bnbSign?: (
        address: string,
        message: string
      ) => Promise<{ publicKey: string; signature: string }>;
      switchNetwork?: (networkId: string) => Promise<string>;
    } & Ethereum;
  }
}

const mappingNetwork: Record<number, string> = {
  1: "eth-mainnet",
  56: "bsc-mainnet",
  97: "bsc-testnet",
};

const _binanceChainListener = async () => {
  new Promise<void>((resolve) =>
    Object.defineProperty(window, "BinanceChain", {
      get() {
        return this.bsc;
      },
      set(bsc) {
        this.bcs = bsc;
        resolve();
      },
    })
  );
};

export class BinanceWalletConnector extends InjectedConnector {
  readonly id = "bsc";
  readonly ready = typeof window !== "undefined";

  provider?: Window["BinanceChain"];

  constructor({ chains: _chains }: { chains: Chain[] }) {
    const options = {
      name: "Binance",
      shimDisconnect: false,
      shimChainChangedDisconnect: true,
    };

    const chains = _chains.filter((chain) => !!mappingNetwork[chain.id]);

    super({ chains, options });
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider();
      if (!provider) throw new ConnectorNotFoundError();

      if (provider.on) {
        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect);
      }

      this.emit("message", { type: "connecting" });

      const account = await this.getAccount();
      // Switch to chain if provided
      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId);
        id = chain.id;
        unsupported = this.isChainUnsupported(id);
      }

      return { account, chain: { id, unsupported }, provider };
    } catch (error) {
      if (this.isUserRejectedRequestError(error))
        throw new UserRejectedRequestError(error);
      //Sobre RPC - Remote Procedure Call (Chamada de Procedimento Remoto https://deinfo.uepg.br/~alunoso/2017/RPC/
      if ((<RpcError>error).code === -32002)
        throw new ResourceUnavailableError(error);
      throw error;
    }
  }

  async getProvider() {
    if (typeof window !== "undefined") {
      if (window.BinanceChain) {
        this.provider = window.BinanceChain;
      } else {
        await _binanceChainListener();
        this.provider = window.BinanceChain;
      }
    }
    return this.provider;
  }

  async switchChain(chainId: number): Promise<Chain> {
    const provider = await this.getProvider();
    if (!provider) throw new ConnectorNotFoundError();
    const id = hexValue(chainId);

    if (mappingNetwork[chainId]) {
      try {
        await provider.switchNetwork?.(mappingNetwork[chainId]);

        return (
          this.chains.find((chain) => chain.id === chainId) || {
            id: chainId,
            name: `Chain ${id}`,
            network: `${id}`,
            nativeCurrency: { decimals: 18, name: "BNB", symbol: "BNB" },
            rpcUrls: { public: { http: [""] }, default: { http: [""] } },
          }
        );
      } catch (error) {
        if ((error as any).error === "user rejected") {
          throw new UserRejectedRequestError(error);
        }
      }
    }

    throw new SwitchChainNotSupportedError({ connector: this });
  }
}

export class BinanceSmallConnector extends InjectedConnector {
  constructor({ chains }: { chains: Chain[] | undefined }) {
    const options = {
      name: "Binance",
      shimDisconnect: true,
      shimChainChangedDisconnect: false,
    };
    super({
      chains,
      options,
    });
  }

  async getProvider() {
    return typeof window !== "undefined" ? window.BinanceChain : undefined;
  }
}
