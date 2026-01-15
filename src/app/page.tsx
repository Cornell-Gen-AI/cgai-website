"use client";
import Link from "next/link";
import Container from "../components/Container";
import Section from "../components/Section";

import { BarChart3, Eye, Sparkles, Network, Smartphone, Leaf } from "lucide-react";
import { Marquee } from "@/components/magicui/marquee";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { NeuralNetwork2D } from "@/components/NeuralNetwork2D";

export default function Home() {
  return (
    <div>
      <Section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-start">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <NeuralNetwork2D nodeCount={250} connectionDensity={0.2} />
        </div>
        
        {/* Hero content - top portion */}
        <Container className="flex items-start relative z-10">
          <div className="py-12 md:py-18 lg:py-21 rounded-3xl bg-black/30 backdrop-blur-sm px-12 md:px-21 -mx-2 border border-white/20">
            <h1 className="h1 font-semibold tracking-tight text-white flex items-center gap-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              <img src="/cgaiweb.svg" alt="CGAI Logo" className="h-24 md:h-32 w-auto drop-shadow-lg" />
              Generative AI @ Cornell
            </h1>
            <p className="mt-12 md:mt-14 text-lg md:text-xl leading-relaxed text-zinc-200 max-w-4xl text-center sm:text-left drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
              Bridging builders, researchers, and industry leaders to explore the frontier of intelligent systems. Join us to develop cutting-edge AI tooling and learn with a community that ships.
            </p>
            <div className="mt-14 md:mt-16 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
              <Link href="/apply" className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-10 py-4 text-lg text-white shadow-md shadow-red-500/20 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 min-w-[180px] sm:min-w-0">
                Apply now
              </Link>
              <Link href="/portfolio" className="inline-flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm px-10 py-4 text-lg text-white border border-white/20 shadow-md shadow-black/20 hover:bg-white/20 hover:shadow-lg hover:shadow-black/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 min-w-[180px] sm:min-w-0">
                Explore Initiatives
              </Link>
            </div>
          </div>
        </Container>

                {/* Partners section */}
        <div className="w-full mt-5 md:mt-6">
          <div className="text-center mb-5 md:mb-6 px-6 md:px-8">
            <p className="text-base text-zinc-300 font-medium">Our Partners</p>
          </div>
          <div className="py-4 relative flex flex-col items-center justify-center overflow-hidden w-full">
            {/* Background for logo contrast */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/60 rounded-2xl"></div>
            <div
              className="
                md:w-3/4 mx-auto
                sm:w-full
                [mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)]
                [mask-repeat:no-repeat]
                [mask-size:100%_100%]
               
              "
            >
      <Marquee pauseOnHover className="[--duration:15s] w-full">
        {[
          { src: "/chartercommunications.png", alt: "Charter Communications" },
          { src: "/vero.webp", alt: "Vero" },
          { src: "/quickfi-logo-01-1.png", alt: "QuickFi" },
          { src: "/cisco.png", alt: "Cisco" },
          { src: "/gradial.jpeg", alt: "Gradial" },
        ].map((logo) => (
          <div
            key={logo.alt}
            className="flex items-center justify-center mx-4 sm:mx-7 min-w-fit"
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-16 sm:h-20 w-auto object-contain rounded-lg"
            />
          </div>
        ))}
      </Marquee>
    </div>
  </div>
</div>
      </Section>

      <Section className="py-8 md:py-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <FlickeringGrid 
            squareSize={20}
            gridGap={16}
            flickerChance={0.2}
            color="rgb(91, 157, 255)"
            maxOpacity={0.15}
            className="opacity-50"
          />
        </div>
        <Container className="relative z-10">
          <div>
            <h2 className="h2">Our Mission</h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-300 max-w-3xl">
              Generative AI @ Cornell is a student-run club building startup-style, autonomous AI projects with real industry collaboration. 
            </p>
            <p className="mt-3 text-base md:text-lg leading-relaxed text-zinc-300 max-w-3xl">
              Members work in small, autonomous teams with mentorship from experienced builders and partners, gaining hands-on experience that translates directly to impactful careers and ventures.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="py-8 md:py-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-purple-900/30 to-transparent"></div>
        </div>
        <Container className="relative z-10">
          <div>
            <h2 className="h2">What We Offer</h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-300 max-w-3xl">
              Join Generative AI @ Cornell to access exclusive opportunities, cutting-edge technology, and a network of innovators.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[{
              icon: <BarChart3 className="h-6 w-6" />,
              title: "Innovative AI Projects",
              desc: "Collaborate on impactful projects like AI-driven accessibility tools, educational assistants, and creative applications.",
              color: "from-blue-600 via-blue-500 to-blue-400",
              shadow: "shadow-blue-500/20"
            }, {
              icon: <Eye className="h-6 w-6" />,
              title: "Exclusive Speaker Series",
              desc: "Engage with AI startup founders, researchers, and tech leaders for insights into the latest opportunities in the field.",
              color: "from-purple-600 via-purple-500 to-purple-400",
              shadow: "shadow-purple-500/20"
            }, {
              icon: <Sparkles className="h-6 w-6" />,
              title: "Real-World Applications",
              desc: "Work on real-world challenges with industry partners, ensuring your projects have tangible outcomes and societal impact.",
              color: "from-green-600 via-green-500 to-green-400",
              shadow: "shadow-green-500/20"
            }, {
              icon: <Network className="h-6 w-6" />,
              title: "Networking & Mentorship",
              desc: "Build connections with industry professionals and like-minded peers through exclusive networking events and collaborative opportunities that foster long-term relationships.",
              color: "from-orange-600 via-orange-500 to-orange-400",
              shadow: "shadow-orange-500/20"
            }, {
              icon: <Smartphone className="h-6 w-6" />,
              title: "Cutting-Edge Tech",
              desc: "Gain hands-on experience with the latest AI tools and platforms to create innovative solutions. Explore how advanced technologies can be applied to solve real-world challenges.",
              color: "from-pink-600 via-pink-500 to-pink-400",
              shadow: "shadow-pink-500/20"
            }, {
              icon: <Leaf className="h-6 w-6" />,
              title: "Career Development",
              desc: "Prepare for the future of AI with personalized career guidance, impactful resume-building projects, access to networking events, and exposure to industry opportunities.",
              color: "from-teal-600 via-teal-500 to-teal-400",
              shadow: "shadow-teal-500/20"
            }].map((item) => (
              <div
                key={item.title}
                className="group relative rounded-2xl bg-white/5 backdrop-blur p-6 shadow-sm shadow-black/20 border border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                
                <div className="relative z-10">
                  <div className={`h-14 w-14 rounded-xl bg-gradient-to-r ${item.color} text-white flex items-center justify-center shadow-md ${item.shadow} p-3`}>
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
