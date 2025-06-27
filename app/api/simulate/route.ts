export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const originChainSelector = searchParams.get("originChainSelector");
    const destinationChainSelector = searchParams.get(
      "destinationChainSelector"
    );
    const amount = searchParams.get("amount");
    const token0 = searchParams.get("token0");
    const token1 = searchParams.get("token1");

    // Basic validation
    if (
      !originChainSelector ||
      !destinationChainSelector ||
      !amount ||
      !token0 ||
      !token1
    ) {
      return new Response(
        JSON.stringify({ error: "Missing query parameters" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const url = `https://ccswap.onrender.com/simulate?originChainSelector=${originChainSelector}&destinationChainSelector=${destinationChainSelector}&amount=${amount}&token0=${token0}&token1=${token1}`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error("Downstream API error:", await res.text());
      return new Response(JSON.stringify({ error: "Upstream fetch failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Simulation route error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
