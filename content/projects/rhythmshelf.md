---
title: RhythmShelf
date: 2026-05-31T02:16:00
category: Tools
tags:
  - Python
  - Windows
  - Music Organiser
  - MusicBrainz
  - Desktop App
github: ''
demo: ''
thumbnail: ''
description: A simple desktop app that helps you clean, organise and manage your music library.
visibility: ''
---

# RhythmShelf – Music Library Cleaner & Organiser

## RhythmShelf

RhythmShelf is a Windows desktop utility built with Python and Tkinter for cleaning, organising and managing music libraries. It was designed to make sorting large music collections easier while keeping file operations simple and safe.

The application combines duplicate detection, music file gathering, metadata clean-up and automatic library organisation into a single workflow.

## Core Features

```plain
- SHA-256 exact duplicate detection
- Automatic duplicate file management
- Recursive folder and subfolder scanning
- Gather music files into one location
- Clean and standardise song information
- Local metadata and filename processing
- MusicBrainz online metadata lookup
- Artist, title, album and release date clean-up
- Automatic file renaming
- Organise music by artist and album
- Copy or move files when building a library
- Session-based undo system
- Individual undo controls for each stage
- Full workflow undo
- Progress tracking and cancellation
- Dark, responsive Windows interface
```

## How It Works

RhythmShelf divides music library clean-up into four stages.

The first stage scans files for exact duplicates. Files are initially grouped by size before SHA-256 hashes are calculated, allowing byte-for-byte identical files to be identified. When duplicates are found, RhythmShelf attempts to keep the file with the cleaner filename.

The second stage gathers supported music files from folders and subfolders into a single location, making scattered music collections easier to work with.

The third stage cleans song information. RhythmShelf can work locally using existing metadata and filenames, or use MusicBrainz to look up additional information. Online matching is deliberately cautious to reduce incorrect matches, with support for cleaning artist names, song titles, albums and release dates.

The final stage builds an organised music library using an Artist and Album folder structure. Files can either be copied or moved, allowing the original collection to be preserved if required.

RhythmShelf also includes a session-based undo system so changes made during the current session can be reversed.

## Purpose

The goal of RhythmShelf was to create a practical tool for turning disorganised music folders into a cleaner and more consistent library.

The project also allowed me to expand my experience with Python desktop development, metadata processing, external web services, SHA-256 hashing, threading, file-system operations, error handling and safe file manipulation.

It also gave me further experience packaging Python applications as standalone Windows executables that can run without requiring Python to be installed.

## Technologies Used

- Python
- Tkinter
- Mutagen
- MusicBrainz
- SHA-256 hashing
- Multithreading
- Windows file-system operations
- PyInstaller

## Platform

- Windows
- Standalone `.exe`
- No Python installation required for the end user

## Get RhythmShelf

RhythmShelf is available as a standalone Windows application and can be purchased directly from my store for **€4.99 as a one-time purchase**.

**No installation required** — simply download and run RhythmShelf. Python or any additional software does not need to be installed.

**No DRM, no activation and no account required.** There are no licence keys, online activation checks or subscriptions.

**One purchase — download it and use it.**
