---
title: NameCraft – Bulk File Renamer & Duplicate Finder
date: 2026-09-06T18:12:00
category: Tools
tags:
  - Python
  - PySide6
  - Windows
  - Desktop app
  - File Manager
  - Duplicate finder
github: ''
youtube: https://youtu.be/iqSewl_qsG0
thumbnail: /images/uploads/ChatGPT Image Sep 8, 2026, 03_46_37 AM.png
description: A lightweight Windows desktop tool for bulk file renaming and duplicate file detection, featuring live previews, undo support, SHA-256 scanning, and a clean responsive interface.
what_i_learned: |-
  Building NameCraft helped me develop practical experience in:

      - Creating desktop applications with **Python and PySide6**
      - Designing responsive graphical user interfaces with **Qt**
      - Safely renaming and managing files using Python
      - Detecting duplicate files using **SHA-256 hashing**
      - Using **worker threads** for longer-running operations
      - Implementing validation, error handling and rollback systems
      - Adding features such as **drag-and-drop, live previews and undo**
      - Testing software against edge cases and fixing bugs found during testing
      - Packaging Python applications into standalone Windows `.exe` files using **PyInstaller**
      - Testing software in a clean Windows environment before release
      - Taking a project from initial development through to a **finished, distributable product**
visibility: ''
---

## NameCraft

NameCraft is a Windows desktop utility built with Python and PySide6 for bulk file renaming and duplicate file management. It was designed to make organising large groups of files faster and safer, while giving the user a clear preview before any changes are made.

## Core Features

    - Bulk file renaming
    - Find and replace text within filenames
    - Replace full filenames
    - Add prefixes and suffixes
    - Sequential numbering
    - Live rename preview
    - Undo the most recent rename operation
    - SHA-256 duplicate file detection
    - Duplicate file deletion controls
    - Folder and subfolder scanning
    - Drag-and-drop file support
    - Light and dark themes
    - Responsive desktop interface

## How It Works

NameCraft allows users to select individual files or scan complete folders.

Rename rules are applied before any files are changed, allowing the user to review the result in a live preview. The application also checks for invalid filenames and naming conflicts before performing a rename.

For duplicate detection, files are first compared by size before SHA-256 hashes are generated. Matching files are grouped together and displayed so the user can see which copy will be kept and which duplicates are marked for deletion.

Duplicate scanning is handled using a separate worker thread to help keep the interface responsive during larger scans.

## Purpose

The goal of NameCraft was to build a practical Windows utility while improving my experience with desktop application development, file-system operations, threading, error handling and safe file manipulation.

The project also gave me experience packaging a Python application into a standalone Windows executable that can run without requiring Python to be installed.

## Technologies Used

- Python
- PySide6 / Qt
- SHA-256 hashing
- Qt worker threads
- Windows file-system operations
- PyInstaller

## Platform

- Windows
- Standalone `.exe`
- No Python installation required for the end user

## Get NameCraft

NameCraft is available as a standalone Windows application and can be purchased directly from my store for **€4.99 as a one-time purchase**.

**No installation required** — simply download and run NameCraft. Python or any additional software does not need to be installed.

**No DRM, no activation and no account required.** There are no licence keys, online checks or subscriptions.

**One purchase — download it and use it.**
