import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Connect() {
  const { connectors, connect, isLoading } = useConnect();
  const { isConnected } = useAccount();
  const disconnect = useDisconnect();

  return (
    <div>
      {!isConnected ? (
        connectors.map((connectItem) => (
          <button
            key={connectItem.id}
            onClick={() => connect({ connector: connectItem })}
            disabled={isLoading}
          >
            {connectItem.name}
          </button>
        ))
      ) : (
        <button onClick={() => disconnect.disconnect()}>Disconnect</button>
      )}
    </div>
  );
}
