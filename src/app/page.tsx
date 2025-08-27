"use client";
import Link from "next/link";
import Container from "../components/Container";
import Section from "../components/Section";

import { Rocket, Briefcase, Wrench, BarChart3, Eye, Sparkles, Network, Smartphone, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

export default function Home() {
  return (
    <div>
      <Section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-between">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* Large blobs */}
          <div className="absolute -top-24 -left-16 h-[400px] w-[400px] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-[#5b9dff] via-[#7b5bff] to-[#c55bff]"></div>
          <div className="absolute -bottom-24 -right-16 h-[400px] w-[400px] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-[#c55bff] via-[#7b5bff] to-[#5b9dff]"></div>
          
          {/* Medium blobs */}
          <div className="absolute top-1/4 right-1/4 h-[300px] w-[300px] rounded-full blur-3xl opacity-15 bg-gradient-to-r from-[#4a8eff] via-[#6a4aff] to-[#b44aff]"></div>
          <div className="absolute bottom-1/3 left-1/3 h-[250px] w-[250px] rounded-full blur-3xl opacity-15 bg-gradient-to-r from-[#6cafff] via-[#8c6cff] to-[#d66cff]"></div>
          
          {/* Small blobs */}
          <div className="absolute top-1/2 left-1/6 h-[200px] w-[200px] rounded-full blur-3xl opacity-10 bg-gradient-to-r from-[#3d7eff] via-[#5d3dff] to-[#a73dff]"></div>
          <div className="absolute top-1/6 right-1/6 h-[180px] w-[180px] rounded-full blur-3xl opacity-10 bg-gradient-to-r from-[#7dbfff] via-[#9d7dff] to-[#e77dff]"></div>
          <div className="absolute bottom-1/4 left-1/2 h-[150px] w-[150px] rounded-full blur-3xl opacity-10 bg-gradient-to-r from-[#5e9fff] via-[#7e5eff] to-[#c85eff]"></div>
          
          {/* Tiny accent blobs */}
          <div className="absolute top-3/4 right-1/3 h-[120px] w-[120px] rounded-full blur-3xl opacity-8 bg-gradient-to-r from-[#4f8fff] via-[#6f4fff] to-[#b94fff]"></div>
          <div className="absolute bottom-1/6 right-1/6 h-[100px] w-[100px] rounded-full blur-3xl opacity-8 bg-gradient-to-r from-[#6cafff] via-[#8c6cff] to-[#d66cff]"></div>
          <div className="absolute top-1/3 left-1/4 h-[80px] w-[80px] rounded-full blur-3xl opacity-8 bg-gradient-to-r from-[#7dbfff] via-[#9d7dff] to-[#e77dff]"></div>
        </div>
        
        {/* Hero content - top portion */}
        <Container className="flex-1 flex items-center">
          <div className="py-8 md:py-10 lg:py-12">
            <h1 className="h1 font-semibold tracking-tight text-white flex items-center gap-4">
              <img src="/cgaiweb.svg" alt="CGAI Logo" className="h-24 md:h-32 w-auto" />
              Generative AI @ Cornell
            </h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg leading-relaxed text-zinc-300 max-w-2xl text-center sm:text-left">
              Bridging builders, researchers, and industry leaders to explore the frontier of intelligent systems. Join us to develop cutting-edge AI tooling and learn with a community that ships.
            </p>
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <Link href="/apply" className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-8 py-3 text-white shadow-md shadow-red-500/20 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 min-w-[200px] sm:min-w-0">
                Apply now
              </Link>
              <Link href="/portfolio" className="inline-flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm px-8 py-3 text-white border border-white/20 shadow-md shadow-black/20 hover:bg-white/20 hover:shadow-lg hover:shadow-black/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 min-w-[200px] sm:min-w-0">
                Explore Initiatives
              </Link>
            </div>
          </div>
        </Container>

                {/* Partners section - bottom portion */}
        <div className="w-full">
          <div className="text-center mb-6 px-6 md:px-8">
            <p className="text-base text-zinc-300 font-medium">Our Partners</p>
          </div>
          <div className="py-7 relative flex flex-col items-center justify-center overflow-hidden w-full">
            {/* Background blobs for marquee contrast */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute top-1/2 left-1/4 h-[200px] w-[200px] rounded-full blur-3xl opacity-25 bg-gradient-to-r from-[#5b9dff] via-[#7b5bff] to-[#c55bff]"></div>
              <div className="absolute top-1/3 right-1/3 h-[150px] w-[150px] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-[#4a8eff] via-[#6a4aff] to-[#b44aff]"></div>
              <div className="absolute bottom-1/4 left-1/2 h-[180px] w-[180px] rounded-full blur-3xl opacity-30 bg-gradient-to-r from-[#6cafff] via-[#8c6cff] to-[#d66cff]"></div>
              <div className="absolute top-1/4 right-1/6 h-[120px] w-[120px] rounded-full blur-3xl opacity-15 bg-gradient-to-r from-[#7dbfff] via-[#9d7dff] to-[#e77dff]"></div>
            </div>
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
