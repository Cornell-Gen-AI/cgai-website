"use client";
import Container from "../../components/Container";
import Section from "../../components/Section";
import MemberCard from "../../components/MemberCard";

const members = [
  { name: "Alex Chen", role: "President", imageSrc: "/vercel.svg", linkedInUrl: "https://linkedin.com" },
  { name: "Maya Patel", role: "VP Projects", imageSrc: "/vercel.svg", linkedInUrl: "https://linkedin.com" },
  { name: "Jordan Lee", role: "Lead Engineer", imageSrc: "/vercel.svg", linkedInUrl: "https://linkedin.com" },
  { name: "Sam Rivera", role: "Research Lead", imageSrc: "/vercel.svg", linkedInUrl: "https://linkedin.com" },
];

export default function TeamPage() {
  return (
    <div>
      <Section>
        <Container>
          <h1 className="h1">Our Team</h1>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-300 max-w-2xl">
            Builders, researchers, and operators focused on shipping real AI products.
          </p>
          <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 md:gap-10">
            {members.map((m) => (
              <MemberCard key={m.name} {...m} />
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
} 