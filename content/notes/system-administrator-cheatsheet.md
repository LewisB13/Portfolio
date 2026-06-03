---
title: System Administrator Cheatsheet
date: 2026-06-03T04:22:00
category: System Admin
tags: []
visibility: ''
---

# User Management

| Command | Description |
| --- | --- |
| `Get-LocalUser` | List local users |
| `New-LocalUser username` | Create user |
| `Remove-LocalUser username` | Delete user |
| `Add-LocalGroupMember -Group Administrators -Member user` | Add admin |
| `whoami` | Current user |




# Process Management

| Command | Description |
| --- | --- |
| `Get-Process` | List processes |
| `Stop-Process -Name chrome` | Kill process |
| `tasklist` | Show tasks |
| `taskkill /PID 1234 /F` | Force kill |




# Service Management

| Command | Description |
| --- | --- |
| `Get-Service` | List services |
| `Start-Service name` | Start service |
| `Stop-Service name` | Stop service |
| `Restart-Service name` | Restart service |
| `Set-Service name -StartupType Automatic` | Auto start |




# Networking

| Command | Description |
| --- | --- |
| `ipconfig /all` | Full network config |
| `ping host` | Ping host |
| `tracert host` | Trace route |
| `nslookup domain.com` | DNS lookup |
| `netstat -ano` | Open ports/connections |
| `Test-NetConnection host -Port 443` | Port test |




# File System

| Command | Description |
| --- | --- |
| `Get-ChildItem` | List files |
| `Get-Content file.txt` | Read file |
| `Copy-Item` | Copy files |
| `Move-Item` | Move files |
| `Remove-Item` | Delete files |
| `robocopy src dst /MIR` | Mirror copy |




# Disk Management

| Command | Description |
| --- | --- |
| `Get-Disk` | List disks |
| `Get-Volume` | Show volumes |
| `Get-PSDrive` | Show drives |
| `chkdsk` | Check disk |
| `diskpart` | Disk utility |




# System Information

| Command | Description |
| --- | --- |
| `systeminfo` | System details |
| `Get-ComputerInfo` | Full info |
| `hostname` | Machine name |
| `Get-Date` | Date/time |
| `uptime` | System uptime |




# Event Logs

| Command | Description |
| --- | --- |
| `Get-EventLog -LogName System` | System logs |
| `Get-WinEvent -LogName Security` | Security logs |
| `eventvwr` | Open Event Viewer |




# Active Directory

| Command | Description |
| --- | --- |
| `Get-ADUser` | Query AD users |
| `Get-ADComputer` | Query computers |
| `Unlock-ADAccount user` | Unlock account |
| `Set-ADUser` | Modify user |




# Remote Management

| Command | Description |
| --- | --- |
| `Enter-PSSession host` | Remote shell |
| `Invoke-Command` | Run remote command |
| `mstsc` | Remote Desktop |
| `ssh user@host` | SSH login |




# Scheduled Tasks

| Command | Description |
| --- | --- |
| `Get-ScheduledTask` | List tasks |
| `Start-ScheduledTask name` | Run task |
| `schtasks` | Task scheduler CLI |




# Windows Updates

| Command | Description |
| --- | --- |
| `Get-WindowsUpdate` | Check updates |
| `Install-WindowsUpdate` | Install updates |
| `wuauclt /detectnow` | Force detection |




# Security

| Command | Description |
| --- | --- |
| `Get-MpComputerStatus` | Defender status |
| `Set-MpPreference` | Defender settings |
| `Get-NetFirewallRule` | Firewall rules |
| `Enable-NetFirewallRule` | Enable firewall rule |




# Useful Admin Shortcuts

| Command | Description |
| --- | --- |
| `services.msc` | Services console |
| `compmgmt.msc` | Computer Management |
| `gpedit.msc` | Group Policy |
| `secpol.msc` | Security Policy |
| `taskmgr` | Task Manager |
| `regedit` | Registry Editor |




# Quick Emergency Commands

```plain
shutdown /r /t 0     # Restart immediately
shutdown /s /t 0     # Shutdown immediately
sfc /scannow         # Repair system files
DISM /Online /Cleanup-Image /RestoreHealth
```

for windows 10 server

# Windows Server 2019 / 2016 Sysadmin Cheatsheet

_(Works for most Windows 10/11 admin tasks too)_




# System Information

| Command | Description |
| --- | --- |
| `systeminfo` | Full system info |
| `hostname` | Computer name |
| `winver` | Windows version |
| `Get-ComputerInfo` | Detailed system info |
| `Get-Date` | Current date/time |




# User & Group Management

| Command | Description |
| --- | --- |
| `Get-LocalUser` | List users |
| `New-LocalUser user` | Create user |
| `Remove-LocalUser user` | Delete user |
| `Get-LocalGroup` | List groups |
| `Add-LocalGroupMember -Group Administrators -Member user` | Add admin |




# Active Directory

| Command | Description |
| --- | --- |
| `Get-ADUser username` | Find AD user |
| `Get-ADComputer` | List computers |
| `Unlock-ADAccount user` | Unlock account |
| `Reset-ADServiceAccountPassword` | Reset service account |
| `gpupdate /force` | Refresh Group Policy |




# Networking

| Command | Description |
| --- | --- |
| `ipconfig /all` | Network config |
| `ping host` | Ping server |
| `tracert host` | Trace route |
| `nslookup domain.com` | DNS lookup |
| `netstat -ano` | Open ports |
| `Get-NetIPAddress` | IP addresses |
| `Test-NetConnection host -Port 443` | Test port |




# DNS

| Command | Description |
| --- | --- |
| `Get-DnsClientServerAddress` | DNS servers |
| `ipconfig /flushdns` | Clear DNS cache |
| `Resolve-DnsName domain.com` | DNS query |




# Services

| Command | Description |
| --- | --- |
| `Get-Service` | List services |
| `Start-Service name` | Start service |
| `Stop-Service name` | Stop service |
| `Restart-Service name` | Restart service |
| `services.msc` | Open Services GUI |




# Processes

| Command | Description |
| --- | --- |
| `Get-Process` | List processes |
| `Stop-Process -Name chrome` | Kill process |
| `tasklist` | Show processes |
| `taskkill /PID 1234 /F` | Force kill |




# Disk & Storage

| Command | Description |
| --- | --- |
| `Get-Disk` | Show disks |
| `Get-Volume` | Show volumes |
| `Get-PSDrive` | Show drives |
| `diskmgmt.msc` | Disk Management |
| `chkdsk` | Disk check |
| `sfc /scannow` | Repair system files |




# File Operations

| Command | Description |
| --- | --- |
| `Get-ChildItem` | List files |
| `Copy-Item` | Copy |
| `Move-Item` | Move |
| `Remove-Item` | Delete |
| `robocopy src dst /MIR` | Mirror copy |




# Event Logs

| Command | Description |
| --- | --- |
| `eventvwr` | Event Viewer |
| `Get-EventLog -LogName System` | System logs |
| `Get-WinEvent -LogName Security` | Security logs |




# Remote Administration

| Command | Description |
| --- | --- |
| `mstsc` | Remote Desktop |
| `Enter-PSSession host` | Remote PowerShell |
| `Invoke-Command` | Run remote commands |
| `ssh user@host` | SSH |




# Windows Updates

| Command | Description |
| --- | --- |
| `sconfig` | Server Core config |
| `Get-WindowsUpdate` | Check updates |
| `Install-WindowsUpdate` | Install updates |
| `wuauclt /detectnow` | Force update check |




# Hyper-V

| Command | Description |
| --- | --- |
| `Get-VM` | List VMs |
| `Start-VM name` | Start VM |
| `Stop-VM name` | Stop VM |
| `Checkpoint-VM name` | Snapshot VM |




# Firewall

| Command | Description |
| --- | --- |
| `Get-NetFirewallRule` | List rules |
| `Enable-NetFirewallRule` | Enable rule |
| `New-NetFirewallRule` | Create rule |
| `wf.msc` | Firewall GUI |




# Scheduled Tasks

| Command | Description |
| --- | --- |
| `Get-ScheduledTask` | List tasks |
| `Start-ScheduledTask name` | Run task |
| `schtasks` | Task scheduler |




# Group Policy

| Command | Description |
| --- | --- |
| `gpupdate /force` | Refresh policies |
| `gpresult /r` | Applied policies |
| `gpmc.msc` | Group Policy Console |




# Common Admin Tools

| Tool | Purpose |
| --- | --- |
| `taskmgr` | Task Manager |
| `compmgmt.msc` | Computer Management |
| `regedit` | Registry Editor |
| `secpol.msc` | Local Security Policy |
| `lusrmgr.msc` | Local Users & Groups |




# Emergency Recovery

```plain
shutdown /r /t 0
shutdown /s /t 0

DISM /Online /Cleanup-Image /RestoreHealth
sfc /scannow

net user administrator /active:yes
```




# Server Core Essentials

```plain
sconfig
Get-NetIPAddress
Get-Service
Restart-Computer
```
