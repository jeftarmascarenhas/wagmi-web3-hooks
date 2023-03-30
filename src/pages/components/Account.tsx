import { useAccount, useBalance } from "wagmi";

export default function Account() {
  const { address } = useAccount();
  const { data } = useBalance({
    address,
  });

  if (!data) return null;

  return (
    <div>
      <p>{address}</p>
      <p>
        {data?.symbol} : {data?.formatted}
      </p>
    </div>
  );
}
