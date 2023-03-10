/* eslint-disable @next/next/no-img-element */
import { useAccount, useEnsAvatar, useEnsName, useBalance } from "wagmi";

export default function Account() {
  const { address } = useAccount();
  const ensAvatar = useEnsAvatar({
    address,
  });
  const ensName = useEnsName({
    address,
  });
  const { data, isLoading, isError } = useBalance({ address });

  if (!data) return null;
  if (isLoading) return <div>Fetching balance</div>;
  if (isError) return <div>Error fetching balance</div>;

  return (
    <div>
      {ensAvatar.data && <img src={ensAvatar.data} alt="Avatar" />}
      <p>{ensName.data ?? address}</p>

      <p>
        {data?.symbol}: {parseFloat(data?.formatted).toFixed(4)}
      </p>
    </div>
  );
}
