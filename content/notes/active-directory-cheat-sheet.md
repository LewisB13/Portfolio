---
title: Active Directory Cheat Sheet
date: 2026-06-04T12:48:00
category: System Admin
tags: []
visibility: ''
---

Here is your ultimate **Active Directory (AD) Cheat Sheet**. Whether you are administering a network, troubleshooting replication, or preparing for a security audit, this guide covers the essential concepts, architecture, and daily CLI commands you need.

## 1. AD Architecture & Core Concepts

Understanding how AD structures its data is crucial for proper management.

- **Objects:** The basic building blocks (Users, Computers, Groups, Printers).
- **Organizational Units (OUs):** Containers used to organize objects _within_ a domain. This is the smallest unit to which you can assign Group Policy Objects (GPOs) or delegate administrative permissions.
- **Domains:** A logical grouping of network objects that share a common AD database and security policy.
- **Trees:** A collection of domains that share a contiguous namespace (e.g., `corp.com` and `dev.corp.com`).
- **Forests:** The ultimate security boundary. A collection of one or more domain trees that share a common schema, configuration, and global catalog.

## 2. FSMO Roles (Flexible Single Master Operation)

Active Directory operates on a multi-master model, but 5 specific roles must be held by a single Domain Controller (DC) at any given time to prevent conflicts.

### Forest-Wide Roles (1 per Forest)

- **Schema Master:** Controls all updates and modifications to the AD schema.
- **Domain Naming Master:** Controls the addition or removal of domains in the forest.

### Domain-Wide Roles (1 per Domain)

- **PDC Emulator:** Handles password changes, time synchronization (acts as the primary time source), and Group Policy updates.
- **RID Master:** Allocates pools of Relative IDs to DCs so they can create new security principals (Users/Groups) with unique SIDs.
- **Infrastructure Master:** Translates SIDs to Distinguished Names (DNs) in cross-domain object references. _Note: Do not host this on a Global Catalog server unless all DCs are Global Catalogs._

## 3. Essential PowerShell Commands (ActiveDirectory Module)

PowerShell is the modern standard for AD administration. Make sure to `Import-Module ActiveDirectory` before running these.

### User Management

PowerShell

```plain
# Create a new user
New-ADUser -Name "John Doe" -SamAccountName "jdoe" -UserPrincipalName "jdoe@domain.com" -Path "OU=Users,OU=Corp,DC=domain,DC=com" -Enabled $true

# Get user details
Get-ADUser -Identity "jdoe" -Properties *

# Unlock a locked-out user account
Unlock-ADAccount -Identity "jdoe"

# Reset a user's password
Set-ADAccountPassword -Identity "jdoe" -NewPassword (Read-Host -AsSecureString "Enter Password")
```

### Group Management

PowerShell

```plain
# Create a new security group
New-ADGroup -Name "Finance-Dept" -GroupScope Global -GroupCategory Security

# Add a user to a group
Add-ADGroupMember -Identity "Finance-Dept" -Members "jdoe"

# List all members of a group
Get-ADGroupMember -Identity "Finance-Dept" | Select-Object Name, SamAccountName
```

### Computer & DC Management

PowerShell

```plain
# Find inactive computers (e.g., older than 90 days)
$date = (Get-Date).AddDays(-90)
Get-ADComputer -Filter 'LastLogonDate -le $date' -Properties LastLogonDate | Select-Object Name, LastLogonDate

# Find which DC holds which FSMO roles
Get-ADForest | Select-Object SchemaMaster, DomainNamingMaster
Get-ADDomain | Select-Object PSDCPRole, RIDMaster, InfrastructureMaster
```

## 4. Security & Maintenance Best Practices

- **The Principle of Least Privilege:** Never use the Domain Admin account for daily tasks. Use delegated OU permissions instead.
- **Protect the PDC Emulator:** Ensure your PDC Emulator is syncing its time with a reliable external NTP stratum-1 time source. If AD time drifts by more than 5 minutes, Kerberos authentication will break.
- **Active Directory Recycle Bin:** Enable it immediately if it isn’t already. It allows you to recover accidentally deleted objects with their attributes intact without restoring from backups.
PowerShellEnable-ADOptionalFeature 'Recycle Bin Feature' -Scope ForestOrConfigurationSet -Target 'yourdomain.com'
- **AGDLP Group Nesting Strategy:** \* Add **A**ccounts to **G**lobal Groups.
    - Add Global Groups to **D**omain **L**ocal Groups.
    - Assign **P**ermissions to the Domain Local Groups.
