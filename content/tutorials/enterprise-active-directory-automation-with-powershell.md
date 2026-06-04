---
title: Enterprise Active Directory Automation with PowerShell
date: 2026-06-04T14:04:00
category: System Admin
difficulty: ''
tags: []
youtube: https://youtu.be/fx4H235YqMY
thumbnail: /images/uploads/sysadmin ep2.png
description: ''
visibility: ''
---

Designed and implemented an enterprise-style Active Directory automation lab using Windows Server and PowerShell scripting to streamline user provisioning and organizational management.

### Project Overview

This project simulated a real-world enterprise onboarding workflow where manually creating employee accounts through Active Directory Users and Computers would not scale efficiently.

To solve this, I developed a PowerShell automation solution that:

- Imported employee data from a CSV file
- Automatically provisioned 50 Active Directory user accounts
- Assigned users to department-specific Organizational Units (OUs)
- Applied secure default passwords
- Forced password changes at first login
- Enabled all accounts automatically

### Technologies Used

- Windows Server
- Active Directory Domain Services (AD DS)
- PowerShell
- CSV Data Processing
- Organizational Units (OUs)

### Key Skills Demonstrated

- Active Directory Administration
- PowerShell Scripting
- Enterprise Automation
- User Provisioning
- Identity & Access Management
- Windows Server Administration
- IT Infrastructure Management

### Automation Workflow

1. Created departmental Organizational Units:
    - Sales
    - Marketing
    - IT
    - HR
    - Finance
2. Developed a PowerShell script using:
    - `Import-Csv`
    - `New-ADUser`
    - Secure password handling
    - Dynamic OU targeting
3. Verified domain password policies through client logins and forced password resets.

### Outcome

Successfully automated the deployment of 50 enterprise user accounts in seconds, significantly reducing administrative overhead while demonstrating scalable systems administration practices used in production environments.
