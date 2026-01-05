"use client";
import Container from "../../components/Container";
import Section from "../../components/Section";
import Timeline, { TimelineItemData } from "../../components/Timeline";
import { Calendar, Users, FileText, Clock, MessageSquare, CheckCircle } from "lucide-react";

const items: TimelineItemData[] = [
  { icon: <Calendar className="h-6 w-6" />, title: "Applications Open", date: "1/26/26" },
  { icon: <Users className="h-6 w-6" />, title: "Info Session 1", date: "TBD..." },
  { icon: <Users className="h-6 w-6" />, title: "Info Session 2", date: "TBD..." },
  { icon: <FileText className="h-6 w-6" />, title: "Project Submission Deadline", date: "TBD..." },
  { icon: <MessageSquare className="h-6 w-6" />, title: "Interviews", date: "TBD..." },
  { icon: <CheckCircle className="h-6 w-6" />, title: "Decisions", date: "TBD..." },
];

export default function ApplyPage() {
  return (
    <div>
      <Section>
        <Container>
          <h1 className="h1">Apply to Generative AI @ Cornell</h1>
          <div className="mt-4 text-base md:text-lg leading-relaxed text-zinc-300 max-w-2xl">
            <div className="apply-strikeout"> Build a superstar project.
            Show that you can use AI.
            Join us.</div>
            We are currently not in the recruitment season. Check back in around the time of SP 26' instruction start.
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <Timeline items={items} />
            </div>
            
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="inline-flex items-center rounded-2xl bg-red-600 px-6 py-4 text-white font-semibold shadow-lg shadow-red-500/30">
                  <div className="apply-strikeout">Open Application Form</div>
                </div>
                <div className="inline-flex items-center rounded-2xl bg-orange-500 px-6 py-4 text-white font-semibold shadow-lg shadow-orange-500/30">
                  Coffee Chat
                </div>
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