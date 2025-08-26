"use client";
import Link from "next/link";
import Container from "../components/Container";
import Section from "../components/Section";

import { Rocket, Briefcase, Wrench, BarChart3, Eye, Sparkles, Network, Smartphone, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

export default function Home() {
  return (
    <div>
      <Section className="relative overflow-hidden py-16 md:py-20 lg:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-16 h-[400px] w-[400px] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-[#5b9dff] via-[#7b5bff] to-[#c55bff]"></div>
          <div className="absolute -bottom-24 -right-16 h-[400px] w-[400px] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-[#c55bff] via-[#7b5bff] to-[#5b9dff]"></div>
        </div>
        <Container>
          <div className="py-8 md:py-10 lg:py-12">
            <h1 className="h1 font-semibold tracking-tight text-white">Cornell Gen AI</h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg leading-relaxed text-zinc-300 max-w-2xl">
              Bridging students and industry leaders to build cutting-edge AI tools.
            </p>
            <div className="mt-6 md:mt-8">
              <Link href="/apply" className="inline-flex items-center rounded-2xl bg-gradient-to-r from-[#5b9dff] via-[#7b5bff] to-[#c55bff] px-5 py-3 text-white shadow-md shadow-purple-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
                Apply now
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-8 md:py-10">
        <Container>
          <h2 className="h2">Partners</h2>
        </Container>
        <div className="mt-6 relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:10s]" repeat={6}>
            {[
              { src: "/quickfi-logo-01-1.png", alt: "QuickFi" },
              { src: "/cisco.png", alt: "Cisco" },
            ].map((logo) => (
              <div
                key={logo.alt}
                className="flex items-center justify-center mx-4"
              >
                                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-20 w-auto object-contain"
                  />
              </div>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black"></div>
        </div>
      </Section>

      <Section className="py-8 md:py-10">
        <Container>
          <div>
            <h2 className="h2">Our Mission</h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-300 max-w-3xl">
              Cornell Gen AI is a student-run club building startup-style, autonomous AI projects with real industry collaboration. 
            </p>
            <p className="mt-3 text-base md:text-lg leading-relaxed text-zinc-300 max-w-3xl">
              Members work in small, autonomous teams with mentorship from experienced builders and partners, gaining hands-on experience that translates directly to impactful careers and ventures.
            </p>
          </div>


        </Container>
      </Section>

      <Section className="py-8 md:py-10">
        <Container>
          <div>
            <h2 className="h2">What We Offer</h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-300 max-w-3xl">
              Join Cornell Gen AI to access exclusive opportunities, cutting-edge technology, and a network of innovators.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[{
              icon: <BarChart3 className="h-6 w-6" />,
              title: "Innovative AI Projects",
              desc: "Collaborate on impactful projects like AI-driven accessibility tools, educational assistants, and creative applications.",
            }, {
              icon: <Eye className="h-6 w-6" />,
              title: "Exclusive Speaker Series",
              desc: "Engage with AI startup founders, researchers, and tech leaders for insights into the latest opportunities in the field.",
            }, {
              icon: <Sparkles className="h-6 w-6" />,
              title: "Real-World Applications",
              desc: "Work on real-world challenges with industry partners, ensuring your projects have tangible outcomes and societal impact.",
            }, {
              icon: <Network className="h-6 w-6" />,
              title: "Networking & Mentorship",
              desc: "Build connections with industry professionals and like-minded peers through exclusive networking events and collaborative opportunities that foster long-term relationships.",
            }, {
              icon: <Smartphone className="h-6 w-6" />,
              title: "Cutting-Edge Tech",
              desc: "Gain hands-on experience with the latest AI tools and platforms to create innovative solutions. Explore how advanced technologies can be applied to solve real-world challenges.",
            }, {
              icon: <Leaf className="h-6 w-6" />,
              title: "Career Development",
              desc: "Prepare for the future of AI with personalized career guidance, impactful resume-building projects, access to networking events, and exposure to industry opportunities.",
            }].map((item) => (
              <div
                key={item.title}
                className="group relative rounded-2xl bg-white/5 backdrop-blur p-6 shadow-sm shadow-black/20 border border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                
                <div className="relative z-10">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-[#5b9dff] via-[#7b5bff] to-[#c55bff] text-white flex items-center justify-center shadow-md shadow-purple-500/20 p-3">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-lg md:text-xl font-semibold text-zinc-100">{item.title}</h3>
                  <p className="mt-2 text-sm md:text-base text-zinc-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
