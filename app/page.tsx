import Container from "@/components/Container";
import SwapCard from "@/components/SwapCard";

export default function Home() {
  return (
    <Container className="flex items-center justify-center">
      <main className="flex items-center justify-center w-full max-w-2xl p-4">
        <SwapCard />
      </main>
    </Container>
  );
}
