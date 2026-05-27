---
title: Linux CLI Cheat Sheet
date: 2026-05-27T03:17:00
category: Linux
tags: []
visibility: ''
---

````plain
# 🐧 Linux CLI Cheat Sheet

A full quick-reference guide for Linux terminal commands used in homelabs, servers, and daily development work.

---

# 📁 Navigation

```bash
pwd                 # print current directory
ls                  # list files
ls -la              # detailed list including hidden files
cd folder           # move into folder
cd ..               # go back one directory
cd ~                # go to home directory
cd /                # go to root directory
````


***

# 📂 File & Directory Management

```plain
mkdir foldername        # create directory
mkdir -p a/b/c          # create nested directories
touch file.txt          # create empty file
rm file.txt             # delete file
rm -r folder            # delete folder recursively
rm -rf folder           # force delete (dangerous)
cp file1 file2          # copy file
cp -r dir1 dir2         # copy directory
mv file1 folder/        # move file
mv oldname newname      # rename file
```


***

# 📄 Viewing Files

```plain
cat file.txt            # print file content
less file.txt           # scrollable view
more file.txt           # paginated view
head file.txt           # first 10 lines
head -n 50 file.txt     # first 50 lines
tail file.txt           # last 10 lines
tail -f log.txt         # live log monitoring
```


***

# 🔍 Searching & Filtering

```plain
grep "text" file.txt           # search text in file
grep -r "text" folder/         # recursive search
grep -i "text" file.txt        # case insensitive
find . -name "*.txt"           # find files by name
find / -type f -name "test"    # search system-wide
```


***

# ⚙️ Permissions

```plain
chmod +x script.sh       # make executable
chmod 755 file           # standard permissions
chmod 644 file           # read/write owner only
chown user file          # change owner
chown user:group file    # change owner + group
```


***

# 📦 System Information

```plain
whoami              # current user
id                  # user and groups
uname -a            # system info
uptime              # system uptime
df -h               # disk usage
du -sh folder       # folder size
free -h             # memory usage
top                 # process viewer
htop                # improved process viewer
```


***

# 🌐 Networking

```plain
ip a                     # show IP addresses
ip r                     # routing table
ping google.com          # test connectivity
curl https://example.com # fetch webpage
wget https://file.url    # download file
netstat -tulnp           # open ports (legacy systems)
ss -tulnp                # modern alternative
```


***

# ⚡ Process Management

```plain
ps aux               # list processes
ps -ef               # alternative format
kill PID             # terminate process
kill -9 PID          # force kill
pkill name           # kill by process name
```


***

# 📦 Package Management (Debian/Ubuntu)

```plain
sudo apt update            # update package lists
sudo apt upgrade           # upgrade packages
sudo apt install nginx     # install package
sudo apt remove nginx      # remove package
sudo apt autoremove        # clean unused packages
```


***

# 📦 Package Management (RHEL/CentOS/Fedora)

```plain
sudo dnf install nginx     # install package
sudo dnf update            # update system
sudo dnf remove nginx      # remove package
```


***

# 🔐 SSH & Remote Access

```plain
ssh user@server_ip        # connect to server
ssh -i key.pem user@host  # connect using key
scp file user@host:/path  # copy file to server
scp user@host:/file .     # copy file from server
```


***

# 🧠 Useful Shortcuts

```plain
CTRL + C      # stop running command
CTRL + Z      # pause process
CTRL + L      # clear screen
CTRL + R      # search history
TAB           # autocomplete
history       # show command history
clear         # clear terminal
```


***

# 🧰 Disk & Storage

```plain
lsblk             # list block devices
fdisk -l          # disk partitions
mount             # show mounted drives
umount /dev/sda1  # unmount drive
```


***

# 📊 Logs & Debugging

```plain
dmesg | tail          # kernel logs
journalctl -xe        # system logs
tail -f /var/log/syslog  # live system log
```
