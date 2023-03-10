import Account from "./components/Account";
import Connect from "./components/Connect";

export default function Home() {
  return (
    <div>
      <h1>Wagmi - Hooks Web3 for React</h1>
      <Connect />
      <br />
      <Account />
    </div>
  );
}
