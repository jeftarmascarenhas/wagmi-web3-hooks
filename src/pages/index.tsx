import Account from "./components/Account";
import Connect from "./components/Connect";

export default function Home() {
  return (
    <div>
      <h1>NFT Choose | Wagmi - Hooks Web3 for React</h1>
      <br />

      <Connect />
      <br />
      <Account />
    </div>
  );
}
