"use client";
import Container from "../../components/Container";
import Section from "../../components/Section";
import MemberCard from "../../components/MemberCard";

const executiveBoard = [
  { name: "Daniel Sachs", role: "Founding President", imageSrc: "/pfps/daniel.png", linkedInUrl: "https://www.linkedin.com/in/daniel-m-sachs/" },
  { name: "Erik Pedersen", role: "Vice-President", imageSrc: "/pfps/erik.png", linkedInUrl: "https://linkedin.com" },
  { name: "Mahdi Choudhury", role: "Treasurer", imageSrc: "/pfps/mahdi.png", linkedInUrl: "https://www.linkedin.com/in/mahdi-choudhury-h/" },
  { name: "Akul Maheshwari", role: "DEI Chair", imageSrc: "/pfps/akul.png", linkedInUrl: "https://www.linkedin.com/in/akul-maheshwari/" },
];

const businessTeam = [
  { name: "David Lee", role: "Business", imageSrc: "/pfps/david.png", linkedInUrl: "https://www.linkedin.com/in/dave-lee-716318242/" },
  { name: "Merek Soriano", role: "Business", imageSrc: "/pfps/merek.png", linkedInUrl: "https://www.linkedin.com/in/merek-soriano-0ba570291/" },
];

const developmentTeam = [
  { name: "Morgan Stuart", role: "NME + Development", imageSrc: "/pfps/morgan.png", linkedInUrl: "https://www.linkedin.com/in/morgan-nstuart/" },
  { name: "Alex Kozik", role: "AI/ML", imageSrc: "/pfps/alex.png", linkedInUrl: "https://www.linkedin.com/in/alex-kozik/" },
  { name: "Audrey Lewellen", role: "AI/ML", imageSrc: "/pfps/audrey.png", linkedInUrl: "https://www.linkedin.com/in/audrey-lewellen-686823355/" },
  { name: "Brandon Xu", role: "Backend", imageSrc: "/pfps/brandon.png", linkedInUrl: "https://www.linkedin.com/in/brandon-xu-284748322/" },
  { name: "Nicole Luo", role: "Backend", imageSrc: "/pfps/nicole.png", linkedInUrl: "https://www.linkedin.com/in/nicoleluo7/" },
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
          
          {/* Executive Board */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Executive Board</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {executiveBoard.map((m) => (
                <MemberCard key={m.name} {...m} />
              ))}
            </div>
          </div>

          {/* Business Team */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Business</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {businessTeam.map((m) => (
                <MemberCard key={m.name} {...m} />
              ))}
            </div>
          </div>

          {/* Development Team */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Development</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {developmentTeam.map((m) => (
                <MemberCard key={m.name} {...m} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
} 