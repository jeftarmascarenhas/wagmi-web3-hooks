import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Connect() {
  const { connect, connectors, isLoading } = useConnect();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  return (
    <div>
      {!isConnected ? (
        connectors.map((connectItem) => (
          <button
            key={connectItem.id}
            onClick={() =>
              connect({
                connector: connectItem,
              })
            }
          >
            {!isLoading ? connectItem.name : "Loading..."}
          </button>
        ))
      ) : (
        <button onClick={() => disconnect()}>Disconnect</button>
      )}
    </div>
  );
}
