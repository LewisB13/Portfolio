---
title: Building a Dynamic Tutorials System With Sveltia CMS
date: 2026-05-15T00:58:00
tags: []
---

# Building a Dynamic Tutorials System With Sveltia CMS

Today I worked on improving the tutorials section of my portfolio website.

The main goal was to stop relying on placeholder content and build a proper dynamic system that works directly with Sveltia CMS and Markdown files stored in GitHub.

## What I Added

I created a new Tutorials collection inside Sveltia CMS that allows me to create tutorial posts directly from the admin panel.

The tutorials now support:

- categories
- difficulty levels
- tags
- YouTube links
- thumbnails
- markdown content

Everything is stored as Markdown files inside:

\`\`\`txt
content/tutorials
