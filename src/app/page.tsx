"use client";
import Link from "next/link";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import Container from "../components/Container";
import Section from "../components/Section";
import LogoCloud from "../components/LogoCloud";
import { Rocket, Briefcase, Wrench } from "lucide-react";

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const anim: Partial<MotionProps> = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.4 },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <div>
      <Section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-16 h-[400px] w-[400px] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-[#5b9dff] via-[#7b5bff] to-[#c55bff]"></div>
          <div className="absolute -bottom-24 -right-16 h-[400px] w-[400px] rounded-full blur-3xl opacity-20 bg-gradient-to-r from-[#c55bff] via-[#7b5bff] to-[#5b9dff]"></div>
        </div>
        <Container>
          <motion.div {...anim}>
            <h1 className="h1 font-semibold tracking-tight text-white">Cornell Gen AI</h1>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-300 max-w-2xl">
              Where students build, innovate, and collaborate with industry partners in real-world AI projects.
            </p>
            <div className="mt-8">
              <Link href="/apply" className="inline-flex items-center rounded-2xl bg-gradient-to-r from-[#5b9dff] via-[#7b5bff] to-[#c55bff] px-5 py-3 text-white shadow-md shadow-purple-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
                Apply now
              </Link>
            </div>
          </motion.div>
        </Container>
      </Section>

      <Section>
        <Container>
          <motion.div {...anim}>
            <h2 className="h2">Our Mission</h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-300 max-w-3xl">
              Cornell Gen AI is a student-run club building startup-style, autonomous AI projects with real industry collaboration. We focus on shipping practical systems, not demos.
            </p>
            <p className="mt-3 text-base md:text-lg leading-relaxed text-zinc-300 max-w-3xl">
              Members work in small, autonomous teams with mentorship from experienced builders and partners, gaining hands-on experience that translates directly to impactful careers and ventures.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 md:gap-10">
            {[{
              icon: <Rocket className="h-6 w-6" />,
              title: "Startup Autonomy",
              desc: "Operate like a startup: small teams, clear ownership, fast iteration.",
            }, {
              icon: <Briefcase className="h-6 w-6" />,
              title: "Industry Mentorship",
              desc: "Collaborate with partners and mentors who ship real products.",
            }, {
              icon: <Wrench className="h-6 w-6" />,
              title: "Hands-on Projects",
              desc: "Build deployed systems and tools, not slide decks.",
            }].map((item) => (
              <motion.div
                key={item.title}
                {...anim}
                className="rounded-2xl bg-white/5 backdrop-blur p-6 shadow-sm shadow-black/20"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#5b9dff] via-[#7b5bff] to-[#c55bff] text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-lg md:text-xl font-semibold text-zinc-100">{item.title}</h3>
                <p className="mt-2 text-sm md:text-base text-zinc-300 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="h2">Partners</h2>
          <p className="mt-2 text-zinc-400 text-sm md:text-base">We work with real collaborators. Placeholder logos shown.</p>
        </Container>
        <div className="mt-6">
          <LogoCloud />
        </div>
      </Section>
    </div>
  );
}
