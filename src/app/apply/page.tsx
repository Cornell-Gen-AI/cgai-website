"use client";
import Container from "../../components/Container";
import Section from "../../components/Section";
import Timeline, { TimelineItemData } from "../../components/Timeline";
import { Calendar, Users, FileText, Clock, MessageSquare, CheckCircle } from "lucide-react";
import Link from "next/link";

const items: TimelineItemData[] = [
  { icon: <Calendar className="h-6 w-6" />, title: "Applications Open", date: "8/26/25" },
  { icon: <Users className="h-6 w-6" />, title: "Info Session 1", date: "9/10/25 (6:15pm) @ Gates G01" },
  { icon: <Users className="h-6 w-6" />, title: "Info Session 2", date: "9/14/25 (2:00pm) @ Gates G01" },
  { icon: <FileText className="h-6 w-6" />, title: "Project Submission Deadline", date: "9/20/25 (11:59pm)" },
  { icon: <MessageSquare className="h-6 w-6" />, title: "Interviews", date: "9/21/-9/24" },
  { icon: <CheckCircle className="h-6 w-6" />, title: "Decisions", date: "9/25" },
];

export default function ApplyPage() {
  return (
    <div>
      <Section>
        <Container>
          <h1 className="h1">Apply to Generative AI @ Cornell</h1>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-300 max-w-2xl">
            Build a superstar project.
            Show that you can use AI.
            Join us.
          </p>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <Timeline items={items} />
            </div>
            
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="https://docs.google.com/forms/d/e/1FAIpQLSeGj9KCqA4_iu4gMfV97mGATUtohsvN2yY3JbgpjH45ZTsX8A/viewform?usp=dialog" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-2xl bg-red-600 px-6 py-4 text-white font-semibold shadow-lg shadow-red-500/30 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
                  Open Application Form
                </Link>
                <Link href="https://docs.google.com/forms/d/e/1FAIpQLSfWeNJ32lSA8jg-X1cBjJsSkinwIv0jX7tiE9ruvhOJJxyzdA/viewform?usp=dialog" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-2xl bg-orange-500 px-6 py-4 text-white font-semibold shadow-lg shadow-orange-500/30 hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
                  Coffee Chat
                </Link>
              </div>

              <div className="space-y-4">
                {[{
                  q: "What do you look for in a new member?",
                  a: "The most important trait is drive and ambition. We want to know that you can get things done no matter the challenge. Second most important is the depth of your technical experience. Thirdly, we want people that we can vibe (and vibecode) with.",
                },{
                  q: "What do I submit?", 
                  a: "We want to see your skills put to the test in building and shipping a real AI application. You have 3 weeks either solo or with 1-2 teammates. We'll evaluate based on technical sophistication, innovation, and implementation quality. Any idea goes, so choose something cool that excites you.",
                },  {
                  q: "What will the work environment look like?",
                  a: "You'll be part of a small, agile team working quickly on specific client projects. We focus on delivering real solutions for companies that have hired us to solve their problems.",
                }].map((f) => (
                  <div key={f.q} className="rounded-2xl bg-white/5 backdrop-blur p-6 shadow-sm shadow-black/20">
                    <h3 className="text-lg md:text-xl font-semibold text-zinc-100">{f.q}</h3>
                    <p className="mt-2 text-sm md:text-base text-zinc-300 leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
} 