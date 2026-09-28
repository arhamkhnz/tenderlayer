"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "about", label: "TenderLayer" },
  { id: "approach", label: "The approach" },
  { id: "story", label: "Our story" },
];

export function SectionNavigation() {
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-10% 0px -60% 0px", threshold: 0 },
    );

    for (const section of document.querySelectorAll("[data-nav-section]")) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="navigation" aria-label="Page sections">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          aria-current={activeSection === section.id ? "location" : undefined}
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}
