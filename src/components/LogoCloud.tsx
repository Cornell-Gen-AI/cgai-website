import Image from "next/image";
import Container from "../components/Container";

const logos = [
  { src: "/vercel.svg", alt: "Partner 1" },
  { src: "/next.svg", alt: "Partner 2" },
  { src: "/globe.svg", alt: "Partner 3" },
  { src: "/window.svg", alt: "Partner 4" },
  { src: "/file.svg", alt: "Partner 5" },
];

export default function LogoCloud() {
  return (
    <Container>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-6 md:gap-10 items-center opacity-70">
        {logos.map((logo) => (
          <div key={logo.alt} className="flex items-center justify-center">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={120}
              height={40}
              className="grayscale brightness-200 contrast-75"
            />
          </div>
        ))}
      </div>
    </Container>
  );
} 