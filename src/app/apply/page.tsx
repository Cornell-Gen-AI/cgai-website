"use client";
import Container from "../../components/Container";
import Section from "../../components/Section";
import Timeline, { TimelineItemData } from "../../components/Timeline";
import { Calendar, MessageSquare, CheckCircle } from "lucide-react";
import Link from "next/link";

const items: TimelineItemData[] = [
  { icon: <Calendar className="h-4 w-4" />, title: "Applications Open", date: "8/26/25" },
  { icon: <MessageSquare className="h-4 w-4" />, title: "Info Session 1", date: "9/10/25 (6:15pm) @ Gates G01" },
  { icon: <MessageSquare className="h-4 w-4" />, title: "Info Session 2", date: "9/14/25 (2:00pm) @ Gates G01" },
  { icon: <MessageSquare className="h-4 w-4" />, title: "Project Submission Deadline", date: "9/15/25 (11:59pm)" },
  { icon: <MessageSquare className="h-4 w-4" />, title: "Interviews", date: "9/16/-9/22" },
  { icon: <CheckCircle className="h-4 w-4" />, title: "Decisions", date: "9/23" },
];

export default function ApplyPage() {
  return (
    <div>
      <Section>
        <Container>
          <h1 className="h1">Apply to Cornell Gen AI</h1>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-300 max-w-2xl">
            Build a superstar project.
            Show that you can use AI.
            Join us.
          </p>

          <div className="mt-10">
            <Timeline items={items} />
          </div>

          <div className="mt-10">
            <Link href="https://docs.google.com/forms/u/1/d/1E5yTo-NvoSspzyLJQ0XyaFozGajN6Z6-9Gdowfq4M0Y" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-2xl bg-gradient-to-r from-[#5b9dff] via-[#7b5bff] to-[#c55bff] px-5 py-3 text-white shadow-md shadow-purple-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
              Open Application Form
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 md:gap-10">
            {[{
              q: "Who should apply?",
              a: "Curious builders who like autonomy, fast iteration, and shipping.",
            }, {
              q: "What time commitment?",
              a: "About 6–8 hours per week, including team meetings and build time.",
            }, {
              q: "Do I need prior AI experience?",
              a: "No. We value product sense and execution. You'll learn on the job.",
            }].map((f) => (
              <div key={f.q} className="rounded-2xl bg-white/5 backdrop-blur p-6 shadow-sm shadow-black/20">
                <h3 className="text-lg md:text-xl font-semibold text-zinc-100">{f.q}</h3>
                <p className="mt-2 text-sm md:text-base text-zinc-300 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
} 