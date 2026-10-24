import Link from "next/link";
import type { ReactNode } from "react";
import ChatWidget from "@/components/chatbot/ChatWidget";
import MobileNavigation from "@/components/layout/MobileNavigation";
import BrandLogo from "@/components/layout/BrandLogo";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export default function WebsiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <header className="header">
        <div className="container navigation">
          <BrandLogo />

          <nav
            className="desktop-navigation"
            aria-label="Main navigation"
          >
            <Link href="/services">Services</Link>
            <Link href="/projects">Work</Link>
            <Link href="/about">About</Link>

            <Link href="/contact" className="nav-contact">
              Let&apos;s talk ↗
            </Link>
          </nav>

          <MobileNavigation />
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <p className="footer-eyebrow">
                YOUR NEXT PROJECT STARTS HERE
              </p>

              <h2>
                Have an idea?
                <br />
                Let&apos;s make it happen.
              </h2>
            </div>

            <Link href="/contact" className="footer-cta">
              Start a conversation
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="footer-grid">
            <div className="footer-brand">
              <BrandLogo footer />

              <p>
                Thoughtful websites, useful applications and
                practical automation. Built around your goals.
              </p>

              <p className="founder-credit">
                Founded by Aditya Pandey.
              </p>

              <a
                className="footer-email"
                href="mailto:adityapandey0456@gmail.com"
              >
                adityapandey0456@gmail.com
              </a>
            </div>

            <nav aria-label="Explore">
              <h3>Explore</h3>
              <Link href="/">Home</Link>
              <Link href="/about">About me</Link>
              <Link href="/projects">Selected work</Link>
              <Link href="/contact">Contact</Link>
            </nav>

            <nav aria-label="Services">
              <h3>What I do</h3>
              <Link href="/services">Web development</Link>
              <Link href="/services">Data dashboards</Link>
              <Link href="/services">Automation tools</Link>
              <Link href="/services">AI prototypes</Link>
            </nav>

            <nav aria-label="Resources and profiles">
              <h3>Find out more</h3>

              <a
                href="https://github.com/adityapandey0456"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile (opens in a new tab)"
              >
                GitHub ↗
              </a>

              <Link href="/faq">FAQs</Link>
              <Link href="/privacy">Privacy notice</Link>
            </nav>
          </div>

          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} StackBloom Studio.
              All rights reserved.
            </p>

            <span>
              Designed with purpose. Built with care.
            </span>

            <a href="#page-top">Back to top ↑</a>
          </div>
        </div>
      </footer>
<WhatsAppButton />
<ChatWidget />
      
    </>
  );
}