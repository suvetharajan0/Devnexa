
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Users,
  MessageSquare,
  FileText,
  FolderKanban,
  KanbanSquare,
} from 'lucide-react';
import { GithubIcon, TwitterIcon, LinkedinIcon } from '../components/ui/SocialIcons.jsx';
import { fetchProjects } from '../api/projects.js';
import { PublicHeader } from '../components/layout/PublicHeader.jsx';
import { StatItem } from '../components/landing/StatItem.jsx';
import { FeatureCard } from '../components/landing/FeatureCard.jsx';
import { StepCard } from '../components/landing/StepCard.jsx';
import { ProjectCard } from '../components/projects/ProjectCard.jsx';
import { Button } from '../components/ui/Button.jsx';
import { BRAND_NAME } from '../lib/constants.js';


const FEATURES = [
  {
    icon: FolderKanban,
    title: 'Discover real projects',
    description: 'Search and filter open-source and portfolio projects by tech stack, skills needed, and status.',
  },
  {
    icon: Users,
    title: 'Build a team',
    description: 'Apply to join a project, or review applicants and build your own team from scratch.',
  },
  {
    icon: KanbanSquare,
    title: 'Team workspaces',
    description: 'Every project gets a real task board — assign work, track progress, and ship together.',
  },
  {
    icon: MessageSquare,
    title: 'Real-time messaging',
    description: 'Talk to teammates instantly, with live delivery — no refreshing, no waiting.',
  },
  {
    icon: Sparkles,
    title: 'Code Mentor AI',
    description: 'Paste any code and get a plain-English explanation or improvement suggestions on demand.',
  },
  {
    icon: FileText,
    title: 'AI Resume Analyzer',
    description: 'Get an ATS score plus concrete strengths and improvements for your resume, powered by AI.',
  },
];


const STEPS = [
  {
    number: '1',
    title: 'Create your profile',
    description: 'Add your skills, bio, and what you want to build — takes less than a minute.',
  },
  {
    number: '2',
    title: 'Find or start a project',
    description: 'Browse open projects that match your skills, or post your own and recruit a team.',
  },
  {
    number: '3',
    title: 'Build, ship, grow',
    description: 'Collaborate in a real team workspace — tasks, messages, and AI tools included.',
  },
];


// NOTE: replace these with your real profile URLs.
const SOCIAL_LINKS = [
  { icon: GithubIcon, href: 'https://github.com/your-username', label: 'GitHub' },
  { icon: TwitterIcon, href: 'https://twitter.com/your-username', label: 'Twitter / X' },
  { icon: LinkedinIcon, href: 'https://linkedin.com/in/your-username', label: 'LinkedIn' },
];

export default function LandingPage() {
  const [featuredProjects, setFeaturedProjects] = useState([]);


  useEffect(() => {
    fetchProjects({ status: 'active', limit: 3 })
      .then((res) => setFeaturedProjects(res.data))
      .catch(() => setFeaturedProjects([]));
  }, []);


  return (
    <div className="min-h-screen bg-surface-page">
      <PublicHeader />


      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-600">
          ✨ AI-Powered Developer Collaboration
        </span>


        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
          Find Projects. Build Teams.
          <br />
          <span className="bg-gradient-to-r from-brand-500 via-purple-500 to-brand-600 bg-clip-text text-transparent">
            Write Better Code.
          </span>
        </h1>


        <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-600">
          {BRAND_NAME} connects developers with real projects, helps you find the right team, and
          gives you AI-powered coding assistance to turn ideas into production reality.
        </p>


        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/projects" className="w-full sm:w-auto">
            <Button className="w-full">
              Explore Projects
              <ArrowRight className="ml-1.5 size-4" />
            </Button>
          </Link>
          <Link to="/register" className="w-full sm:w-auto">
            <Button variant="ghost" className="w-full">
              Join Now
            </Button>
          </Link>
        </div>
      </section>


      {/* Stats — its own clearly bounded band */}
      <section className="border-y border-border-subtle bg-surface-card">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6">
          <StatItem value="MERN" label="Full Stack" />
          <StatItem value="Real-time" label="Messaging & Tasks" />
          <StatItem value="AI" label="Code Mentor + Resume Tools" />
          <StatItem value="Open" label="Source Friendly" />
        </div>
      </section>


      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-ink-900 sm:text-4xl">
            Everything you need to build your next project
          </h2>
          <p className="mt-3 text-ink-600">
            From finding the right project to getting AI-powered coding help — {BRAND_NAME} covers
            the whole journey.
          </p>
        </div>


        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>


      {/* How it works — its own clearly bounded band */}
      <section id="how-it-works" className="border-y border-border-subtle bg-surface-card py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-ink-900 sm:text-4xl">How {BRAND_NAME} works</h2>
          <p className="mt-3 text-ink-600">
            From zero to an active project with real teammates, in three steps.
          </p>


          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {STEPS.map((s) => (
              <StepCard key={s.number} {...s} />
            ))}
          </div>
        </div>
      </section>


      {/* Featured real projects */}
      {featuredProjects.length > 0 && (
        <section id="projects" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
              Live projects on {BRAND_NAME}
            </h2>
            <Link to="/projects" className="text-sm font-semibold text-brand-600 hover:underline">
              View all →
            </Link>
          </div>


          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </section>
      )}


      {/* CTA — its own clearly bounded band */}
      <section className="border-y border-border-subtle bg-surface-muted py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="rounded-card bg-gradient-to-br from-brand-500 to-purple-600 p-10 sm:p-14">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to build something great?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-brand-100">
              Join {BRAND_NAME} and start collaborating on real projects today.
            </p>
            <Link
              to="/register"
              className="mt-6 inline-flex items-center justify-center rounded-control bg-white px-6 py-3 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
            >
              Get Started — it's free
            </Link>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-surface-card">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt={BRAND_NAME} className="size-7" />
                <span className="text-sm font-bold text-ink-900">{BRAND_NAME}</span>
              </div>
              <p className="mt-3 max-w-sm text-sm text-ink-400">
                The platform to discover projects, build teams, and ship better code — together.
              </p>
            </div>


            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-border-subtle text-ink-600 transition hover:border-brand-300 hover:text-brand-600"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>


          <div className="mt-10 border-t border-border-subtle pt-6">
            <p className="text-xs text-ink-400">
              © {new Date().getFullYear()} {BRAND_NAME}. Built as a portfolio project.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}