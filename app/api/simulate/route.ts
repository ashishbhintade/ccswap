// For App Router (Next.js 13+)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const originChainSelector = searchParams.get("originChainSelector");
  const destinationChainSelector = searchParams.get("destinationChainSelector");
  const amount = searchParams.get("amount");
  const token0 = searchParams.get("token0");
  const token1 = searchParams.get("token1");

  const url = `https://ccswap.onrender.com/simulate?originChainSelector=${originChainSelector}&destinationChainSelector=${destinationChainSelector}&amount=${amount}&token0=${token0}&token1=${token1}`;

  const res = await fetch(url);
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
