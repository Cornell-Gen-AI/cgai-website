import Container from "../components/Container";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-white/5">
      <Container className="py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-400">
        <p className="text-sm md:text-base">© {new Date().getFullYear()} Cornell Gen AI</p>
        <div className="text-sm md:text-base">
          Built by students at Cornell. <span className="text-zinc-500">Autonomous projects. Real impact.</span>
        </div>
      </Container>
    </footer>
  );
} 