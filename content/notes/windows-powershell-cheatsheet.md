---
title: Windows PowerShell Cheatsheet
date: 2026-06-03T04:19:00
category: ''
tags: []
visibility: ''
---

## Navigation

| Command | Description |
| --- | --- |
| `pwd` | Show current directory |
| `ls` | List files and folders |
| `cd folder` | Change directory |
| `cd ..` | Go up one level |
| `cls` | Clear screen |

***

# File Operations

| Command | Description |
| --- | --- |
| `New-Item file.txt` | Create file |
| `mkdir FolderName` | Create folder |
| `Copy-Item a.txt b.txt` | Copy file |
| `Move-Item a.txt C:\Temp` | Move file |
| `Rename-Item old.txt new.txt` | Rename file |
| `Remove-Item file.txt` | Delete file |

***

# Viewing Files

| Command | Description |
| --- | --- |
| `cat file.txt` | Show file contents |
| `Get-Content file.txt` | Read file |
| `type file.txt` | Display file |

***

# Processes

| Command | Description |
| --- | --- |
| `Get-Process` | List processes |
| `Stop-Process -Name notepad` | Kill process |
| `Start-Process notepad` | Launch app |

***

# Services

| Command | Description |
| --- | --- |
| `Get-Service` | List services |
| `Start-Service Spooler` | Start service |
| `Stop-Service Spooler` | Stop service |
| `Restart-Service Spooler` | Restart service |

***

# Networking

| Command | Description |
| --- | --- |
| `ipconfig` | Network config |
| `ping google.com` | Ping host |
| `Test-NetConnection google.com -Port 443` | Test port |

***

# Variables

```plain
$name = "John"
Write-Output $name
```

***

# Loops

### ForEach

```plain
1..5 | ForEach-Object {
    $_
}
```

### While

```plain
$count = 1

while ($count -le 5) {
    $count
    $count++
}
```

***

# Conditionals

```plain
if ($x -gt 10) {
    "Greater"
} else {
    "Smaller"
}
```

***

# Functions

```plain
function Hello {
    param($name)

    "Hello $name"
}
```

***

# Pipelines

```plain
Get-Process | Sort-Object CPU
Get-Service | Where-Object {$_.Status -eq "Running"}
```

***

# Search

| Command | Description |
| --- | --- |
| `Get-ChildItem -Recurse` | Recursive listing |
| `Select-String "text" file.txt` | Search text |

***

# Scripts

| Command | Description |
| --- | --- |
| `.\script.ps1` | Run script |
| `Get-ExecutionPolicy` | View policy |
| `Set-ExecutionPolicy RemoteSigned` | Change policy |

***

# Useful Aliases

| Alias | Real Command |
| --- | --- |
| `ls` | `Get-ChildItem` |
| `cd` | `Set-Location` |
| `pwd` | `Get-Location` |
| `cat` | `Get-Content` |
| `rm` | `Remove-Item` |
| `cp` | `Copy-Item` |
| `mv` | `Move-Item` |

***

# Quick Commands

```plain
shutdown /r /t 0      # Restart PC
shutdown /s /t 0      # Shutdown PC
Get-Date              # Current date/time
Get-History           # Command history
Clear-History         # Clear history
```
