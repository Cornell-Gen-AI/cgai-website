"use client";
import Container from "../../components/Container";
import Section from "../../components/Section";
import Image from "next/image";

export default function PortfolioPage() {
  return (
    <div>
      <Section>
        <Container>
          <h1 className="h1">Project Portfolio</h1>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-300 max-w-3xl">
            A showcase of the tools, projects, and innovations our team has developed to push the boundaries of Generative AI.
          </p>
          
          {/* ClassGPT Project */}
          <div className="mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">ClassGPT (SP25)</h2>
                <p className="text-zinc-300 leading-relaxed">
                  CGAI is currently working on ClassGPT, which is a Cornell-exclusive product for both professors and students. 
                  ClassGPT will allow professors to create AI Tutors educated on their course content. Students will be able to 
                  join classes that are supported and instantly have access to a AI Tutor specifically educated on that classes content.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-green-500/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 lg:p-8 border border-zinc-700/50">
                  <div className="w-full h-48 md:h-56 lg:h-64 relative">
                    <Image
                      src="/classgpt.png"
                      alt="ClassGPT Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QuickFi Project */}
          <div className="mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="relative order-2 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-blue-400/30 rounded-2xl blur-xl"></div>
                <div className="relative bg-zinc-700/30 backdrop-blur-sm rounded-2xl p-4 md:p-6 lg:p-8 border border-zinc-600/40">
                  <div className="w-full h-48 md:h-56 lg:h-64 relative">
                    <Image
                      src="/quickfi-logo-01-1.png"
                      alt="QuickFi Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-2xl font-bold text-white mb-4">QuickFi (SP25)</h2>
                <p className="text-zinc-300 leading-relaxed">
                  CGAI has worked with QuickFi on the following projects:
                </p>
                <p className="text-zinc-300 leading-relaxed mt-4">
                  <strong>AI Insurance Verification:</strong> An AI agent initiates outreach to insurance providers, requests required commercial insurance certificates, 
                  validates that all contract-specific coverage details are present, and updates internal records. It handles 
                  follow-ups for incomplete submissions and ensures documentation is stored and tagged correctly for compliance.
                </p>
                <p className="text-zinc-300 leading-relaxed mt-4">
                  <strong>Automated Vendor Due Diligence:</strong> An intelligent system verifies vendor legitimacy by cross-referencing public business records, risk databases, 
                  and online presence. It flags potential issues like high-risk scores, inactive registrations, mismatched addresses, 
                  or adverse news, then routes findings for internal review — streamlining risk management and fraud prevention.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
} 