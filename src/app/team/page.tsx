"use client";
import Container from "../../components/Container";
import Section from "../../components/Section";
import MemberCard from "../../components/MemberCard";
import Link from "next/link";

const executiveBoard = [
  { name: "Daniel Sachs", role: "Founding President", imageSrc: "/pfps/daniel.png", linkedInUrl: "https://www.linkedin.com/in/daniel-m-sachs/" },
  { name: "Erik Pedersen", role: "Vice-President", imageSrc: "/pfps/erik.png", linkedInUrl: "https://www.linkedin.com/in/erikzhangpedersen/" },
  { name: "Morgan Stuart", role: "Lead Engineer + NME Chair", imageSrc: "/pfps/morgan.png", linkedInUrl: "https://www.linkedin.com/in/morgan-nstuart/" },
  { name: "Merek Soriano", role: "Head of Corporate Partnership", imageSrc: "/pfps/merek.png", linkedInUrl: "https://www.linkedin.com/in/merek-soriano-0ba570291/" },
  { name: "David Lee", role: "Head of Product", imageSrc: "/pfps/david.png", linkedInUrl: "https://www.linkedin.com/in/dave-lee-716318242/" },
 
];

const administrationTeam = [
  { name: "Mahdi Choudhury", role: "Treasurer", imageSrc: "/pfps/mahdi.png", linkedInUrl: "https://www.linkedin.com/in/mahdi-choudhury-h/" },
  { name: "Akul Maheshwari", role: "DEI Chair", imageSrc: "/pfps/akul.png", linkedInUrl: "https://www.linkedin.com/in/akul-maheshwari/" },
];

const developmentTeam = [
  // QuickFi – Credit Document AI Analysis
  { name: "Bhavan Sai Balusu", role: "QuickFi – Credit Document AI Analysis", year: 1, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Surya Chandrakasan", role: "QuickFi – Credit Document AI Analysis", year: 1, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Trishia Khandelwal", role: "QuickFi – Credit Document AI Analysis", year: 1, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Thurushi Kiyara Rajapakse", role: "QuickFi – Credit Document AI Analysis", year: 3, imageSrc: "/pfps/thurushi.png", linkedInUrl: "https://www.linkedin.com/in/thurushi-rajapakse" },
  { name: "Aleks Dzudzevic", role: "QuickFi – Credit Document AI Analysis", year: 1, imageSrc: "/pfps/alek.png", linkedInUrl: "" },
  // QuickFi – Vendor Due Diligence AI
  { name: "Brandon Xu", role: "QuickFi – Vendor Due Diligence AI", year: 2, imageSrc: "/pfps/brandon.png", linkedInUrl: "https://www.linkedin.com/in/brandon-xu-284748322/" },
  { name: "Eddie Hu", role: "QuickFi – Vendor Due Diligence AI", year: 1, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Audrey Lewellen", role: "QuickFi – Vendor Due Diligence AI", year: 3, imageSrc: "/pfps/audrey.png", linkedInUrl: "https://www.linkedin.com/in/audrey-lewellen-686823355/" },
  { name: "Mateo del Rio Lanse", role: "QuickFi – Vendor Due Diligence AI", year: 1, imageSrc: "/pfps/mateo.png", linkedInUrl: "https://www.linkedin.com/in/mdelriolanse" },
  // QuickFi – Invoice AI Analysis
  { name: "Nicole Luo", role: "QuickFi – Invoice AI Analysis", year: 3, imageSrc: "/pfps/nicole.png", linkedInUrl: "https://www.linkedin.com/in/nicoleluo7/" },
  { name: "Pratyush Saxena", role: "QuickFi – Invoice AI Analysis", year: 1, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Anmol Karan", role: "QuickFi – Invoice AI Analysis", year: 1, imageSrc: "/pfps/anmol.jpeg", linkedInUrl: "" },
  { name: "Christina Maria Joseph", role: "QuickFi – Invoice AI Analysis", year: 2, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Lauren Amelie Ah-Hot", role: "QuickFi – Invoice AI Analysis", year: 3, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  // QuickFi (General)
  { name: "Zahrizhal Ali, Jr", role: "QuickFi", year: 5, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  // Vero
  { name: "Dhruv Mandalik", role: "Vero", year: 1, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Zach Riiff", role: "Vero", year: 2, imageSrc: "/pfps/zach.png", linkedInUrl: "https://www.linkedin.com/in/zach-riiff-828018325/" },
  { name: "Alex Kozik", role: "Vero", year: 4, imageSrc: "/pfps/alex.png", linkedInUrl: "https://www.linkedin.com/in/alex-kozik/" },
  { name: "Rei Meguro", role: "Vero", year: 5, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  // Bridge
  { name: "Yashnil Saha", role: "Bridge", year: 1, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Asad Abbas Rizvi", role: "Bridge", year: 1, imageSrc: "/pfps/asad.png", linkedInUrl: "www.linkedin.com/in/asad-rizvi-02a1782a2" },
  { name: "Tanner Brendan Blake", role: "Bridge", year: 1, imageSrc: "/pfps/blank_profile.webp", linkedInUrl: "" },
  { name: "Arshdeep Kaur", role: "Bridge", year: 2, imageSrc: "/pfps/arshdeep.jpg", linkedInUrl: "https://www.linkedin.com/in/arshdeepkaur13/" }
];

export default function TeamPage() {
  return (
    <div>
      <Section>
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="h1">Our Team</h1>
              <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-300 max-w-2xl">
                Builders, researchers, and operators focused on shipping real AI products.
              </p>
            </div>
            
            <div className="md:flex-shrink-0">
                              <Link href="https://docs.google.com/forms/d/e/1FAIpQLSfWeNJ32lSA8jg-X1cBjJsSkinwIv0jX7tiE9ruvhOJJxyzdA/viewform?usp=dialog" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-2xl bg-orange-500 px-6 py-4 text-white font-semibold shadow-lg shadow-orange-500/30 hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
                Coffee Chat
              </Link>
            </div>
          </div>
          
          {/* Executive Board */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Executive Board</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-10">
              {executiveBoard.map((m) => (
                <MemberCard key={m.name} {...m} />
              ))}
            </div>
          </div>

          {/* Development Team */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Development</h2>
            <div>
              {(() => {
                const groups: { role: string; members: typeof developmentTeam }[] = [];
                developmentTeam.forEach((member) => {
                  const lastGroup = groups[groups.length - 1];
                  if (!lastGroup || lastGroup.role !== member.role) {
                    groups.push({ role: member.role, members: [member] });
                  } else {
                    lastGroup.members.push(member);
                  }
                });
                // Sort members within each group by year (descending)
                groups.forEach((group) => {
                  group.members.sort((a, b) => b.year - a.year);
                });
                return groups.map((group, groupIndex) => (
                  <div key={group.role}>
                    {groupIndex > 0 && <div className="my-8 md:my-10 border-t border-white/10"></div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-10">
                      {group.members.map((m) => (
                        <MemberCard key={m.name} {...m} />
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Administration Team */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Administration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-10">
              {administrationTeam.map((m) => (
                <MemberCard key={m.name} {...m} />
              ))}
            </div>
          </div>

        </Container>
      </Section>
    </div>
  );
} 