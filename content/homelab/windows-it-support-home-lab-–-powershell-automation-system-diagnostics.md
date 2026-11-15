---
title: Windows IT Support Home Lab PowerShell Automation And System Diagnostics
date: 2026-10-26T18:37:00
category: System Admin
status: Completed
tags:
  - Powershell
  - IT Support
  - Windows Admin
  - Home Lab
  - Automation
  - System Diagnostics
  - Help nDesk
  - Windows 10
github: https://github.com/LewisB13/windows-it-support-health-check
demo: ''
youtube: https://youtu.be/JLPpkb9oJMM
thumbnail: ''
description: Developed a PowerShell-based IT Support tool to automate Windows system health checks, network diagnostics, connectivity testing, disk space monitoring, and Windows Update service checks, generating a report to simplify troubleshooting.
what_i_learned: Through this home lab, I gained practical experience using PowerShell to automate routine IT Support tasks and troubleshoot Windows systems. I learned how to retrieve system information, analyse network configurations, test connectivity, monitor disk storage, and check Windows services. I also improved my scripting, troubleshooting, and technical documentation skills by developing a reusable diagnostic tool that generates automated health reports.
visibility: public
---

## Windows IT Support Home Lab – PowerShell Automation & System Diagnostics

### Project Overview

Developed a PowerShell-based Windows diagnostic tool to automate routine system health checks and streamline common IT Support troubleshooting tasks. The aim was to create a reusable script that gathers essential diagnostic information into a single report, reducing the need to manually execute multiple commands.

### Objectives

- Automate common Windows system diagnostic tasks.
- Retrieve system and network configuration information.
- Test network connectivity and identify potential issues.
- Monitor disk storage capacity and available space.
- Check Windows Update service status.
- Generate a consolidated troubleshooting report.

### Tools & Technologies

- **Operating System:** Windows 10 Enterprise
- **Scripting:** Windows PowerShell
- **Networking:** TCP/IP, DNS, ICMP
- **System Management:** WMI/CIM, Windows Services

### Implementation

**1. System Information**

Used PowerShell to retrieve the computer name, Windows edition and operating system version.

**2. Network Diagnostics**

Collected network adapter information, IPv4 addresses, default gateways and DNS server configurations to assist with network troubleshooting.

**3. Connectivity Testing**

Implemented automated ping testing against an external IP address, providing PASS or WARNING results based on connectivity.

**4. Disk Storage Monitoring**

Used PowerShell and CIM commands to retrieve total and available disk space across multiple local drives.

**5. Windows Update Service Monitoring**

Checked the current status of the Windows Update service to assist with diagnosing potential update-related issues.

**6. Automated Reporting**

Configured the script to automatically generate a text-based health report containing all diagnostic results.

### Results & Outcomes

Successfully developed and tested the PowerShell script on Windows 10 Enterprise.

The generated report confirmed successful network connectivity, displayed storage information across multiple drives, retrieved Windows system details and identified the Windows Update service status.

### Skills Demonstrated

- PowerShell scripting and automation
- Windows system administration
- Network configuration and troubleshooting
- System diagnostics and monitoring
- IT Support troubleshooting
- Technical documentation

### Future Improvements

Potential enhancements include automated disk space alerts, DNS resolution checks, HTML reporting and more advanced error handling.

### Conclusion

This project demonstrates how PowerShell automation can simplify routine IT Support diagnostics by consolidating multiple system checks into a single reusable tool. It provided practical experience in Windows administration, troubleshooting and scripting, with skills directly applicable to Helpdesk, Desktop Support and IT Support roles.
