---
image: "~/assets/images/llmnr.webp"
title: "How to Fix LLMNR Poisoning"
excerpt: While LLMNR and NBT-NS provide convenient name resolution services on local networks, especially in environments where DNS configuration is minimal or non-existent, they also present significant security vulnerabilities. 
author: Staff
publishDate: 2024-03-10T00:00:00Z
tags:
 - penetration testing
---

Sign up for an Internal Penetration Test, and one of the first things your tester is going to do is run [Responder](https://github.com/lgandx/Responder). It’s been paydirt for testers since its release over 10 years ago. Even before Responder, there were other ad-hoc tools (even a NBNS Spoofer in Metasploit) attackers could use to get an initial foothold in their target environment.  It even gets [its own special place](https://attack.mitre.org/techniques/T1557/001/) in Mitre. 

But wait, let's back up... 
 

### Understanding LLMNR, NetBIOS, and mDNS 

Before diving into the specifics of hardening your network environment against certain attack vectors, let’s review the basics of Link-Local Multicast Name Resolution (LLMNR) and NetBIOS Name Service (NBT-NS) (and don't forget about [mDNS](https://f20.be/blog/mdns), but that might be for a future post). These protocols play fundamental roles in network communications, especially in Windows environments, but they also open doors for neat security vulnerabilities. 

#### Link-Local Multicast Name Resolution (LLMNR) 

LLMNR is a protocol defined in RFC 4795 that enables devices on a local network to perform name resolution for other hosts when DNS (Domain Name System) fails to resolve the names. LLMNR is multicast over a local network, meaning it doesn't rely on a centralized server to resolve names. Instead, it broadcasts a query for a hostname to the entire network, and the device with the matching name responds with its IP address. Well, not just THE device with that name, and ANY device can respond, and therein lies the problem.  


**How LLMNR Works:** 

1. **Query Broadcast**: When a device needs to resolve a hostname to an IP address, it first attempts to use DNS. If DNS fails (e.g., the DNS server can't resolve the hostname or is unreachable), the device then broadcasts an LLMNR query over the network. 
2. **Response from Host**: Any device on the network with the requested hostname responds directly to the querying device with its IP address. 
3. **Fallback Mechanism**: LLMNR acts as a fallback mechanism when DNS resolution fails, ensuring that local network name resolution can still occur without centralized DNS services. 


#### NetBIOS Name Service (NBT-NS) 


NetBIOS Name Service is part of the older NetBIOS over TCP/IP suite, enabling computers on a local network to communicate with each other using a simple name, rather than an IP address. NBT-NS functions similarly to LLMNR, in that it provides name resolution services on a local network, but it predates LLMNR and is based on the older NetBIOS protocol. NBT-NS was pre-Vista, LLMNR was post-Vista.  


**How NetBIOS Name Service Works:** 

1. **Name Registration**: When a device joins the network, it registers its NetBIOS name with the NBT-NS, making its presence and services known to other devices on the local network. 
2. **Name Query**: To communicate with another device, a device sends out a NetBIOS name query request. If the target device's name is registered, the NBT-NS responds with the IP address of the target device. 
3. **Direct Communication**: With the IP address resolved, the querying device can directly communicate with the target device using its NetBIOS name. 

#### Multicast DNS (mDNS)
mDNS, similar to LLMNR, is a name resolution protocol that operates within a local network without relying on a central DNS server.  It's commonly used by devices like printers, smart TVs, and other IoT devices to advertise their services and discover other devices on the network.  Apple's Bonjour is a well-known implementation of mDNS.

**How mDNS Works:**

1. **Service Announcement:** Devices periodically broadcast mDNS queries announcing their services (e.g., "I'm a printer named 'SuperCoolPrinter'").
2. **Service Discovery:** Devices looking for a specific service (e.g., a printer) send out mDNS queries.
3. **Response:** Devices offering the requested service respond with their name and IP address.


### The Risks
While LLMNR, NBT-NS, and mDNS provide convenient name resolution services on local networks, especially in environments where DNS configuration is minimal or non-existent, they also present significant security vulnerabilities. The primary risk comes from the fact that any device on the network can respond to LLMNR or NBT-NS queries, letting them impersonate another device. Attackers can take advantage of this by using tools like Responder to intercept queries and respond with their own location. This technique is particularly effective in man-in-the-middle (MITM) attacks, where the attacker positions themselves between the querying device and the legitimate responder. 

By default, Responder will answer all LLMNR and NBT-NS queries, setting it’s own IP address as the resolved name. This entices all systems to connect to the attacker's system, which then presents a slew of ‘fake’ services (think HTTP, LDAP, MSSQL) that present authentication. Domain-joined Windows systems will send the NetNTLM hash of the currently logged-on user, which Responder happily captures and saves.  

Typically, all this happens silently in the background. On a populated network with a hundred users, it can result in several NetNTLM hashes every minute. Attackers can take the hashes offline to crack or use something like [ntlmrelayx](https://github.com/fortra/impacket/blob/master/examples/ntlmrelayx.py) to relay those authentication attempts to other systems.  

 
### How do I disable these?

Thankfully, disabling these protocols is easy. Of course, there’s a few caveats: 

- Make sure your DNS is configured properly. You are disabling a DNS failsafe, so requests and responses that rely on broadcast name resolution will fail.  

- Just pushing a GPO might not fix them all. Consider workgroup systems, vendor boxes, and non-Windows hosts that use their own broadcast name resolution. 

 

### Disabling LLMNR   

1. **Group Policy Editor**: Open the Group Policy Editor by typing `gpedit.msc` in the run dialog. Navigate to `Computer Configuration -> Administrative Templates -> Network -> DNS Client`. Find the setting `Turn OFF Multicast Name Resolution` and set it to `Enabled`. This change will prevent Windows from using LLMNR for name resolution. 

2. **Registry**: Alternatively, you can disable LLMNR through the registry. Open `regedit`, and navigate to `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient`. Create a DWORD value named `EnableMulticast` and set it to `0`. 


### Disabling NetBIOS Name Service 


1. **Network Adapter Settings**: Open `Control Panel -> Network and Sharing Center -> Change adapter settings`. Right-click on your network connection, select `Properties`, then `Internet Protocol Version 4 (TCP/IPv4)`, and click `Properties`. Click `Advanced`, navigate to the `WINS` tab, and select `Disable NetBIOS over TCP/IP`. 

2. **DHCP Server**: If your network uses DHCP, you can disable NetBIOS over TCP/IP for all clients through the DHCP options. Set the DHCP option 001 to `0x2`, which tells client computers to disable NetBIOS over TCP/IP. 

### Mitigating mDNS:

mDNS is more challenging to disable completely as it's often baked into devices.  Here are some strategies:

1. **Firewall Rules:** Configure your firewall to block or restrict mDNS traffic (port 5353, both UDP and TCP) between devices that don't need to use it. This is particularly important for isolating sensitive parts of your network.
2. **mDNS Gateway/Proxy:** For larger networks, consider using an mDNS gateway or proxy. This allows you to control and filter mDNS traffic, preventing unwanted announcements and discovery.
3. **Device Configuration:** Check the settings of devices that use mDNS (printers, smart TVs, etc.). Some may offer options to disable or limit mDNS functionality. Note that many devices, especially consumer-grade ones, may not offer this level of control.
4. **VLAN Segmentation:** Isolate IoT devices and other systems that rely heavily on mDNS onto separate VLANs. This limits the potential impact of mDNS-related attacks.
5. **Monitoring:** Monitor your network for unusual mDNS traffic. While not a preventative measure, it can help you detect potential attacks.
6. **Chromebook Considerations:** Chromebooks use mDNS for device discovery (e.g., finding nearby printers). If you manage Chromebooks in an enterprise environment, explore Chrome OS policies related to mDNS. However, for personal Chromebooks, you'll have less control.

That said, you can disable mDNS via Poweshell, although it may break things:
```powershell
# Powershell to set mDNS to disabled
set-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters\" -Name EnableMDNS -Value 0 -Type DWord
```

### Verification and Continuous Monitoring 

After applying these settings, it’s important to test it. You can grab a Linux VM and run Responder on your local usernework in Analyze mode (`Responder.py -I eth0 -A`) and see if you notice any responses. There's also a C# and PowerShell version called [Inveigh](https://github.com/Kevin-Robertson/Inveigh). 
 
Beyond testing, several open-source tools exist as sort of a Responder Honeypot. They probe for invalid hostnames and watch for a response. If they ever get one, it's a sign that an attacker may be performing LLMNR or NBT-NS poisoning in your environment. There are many honeypot type tools to use, one is Asker:  

- [https://github.com/eavalenzuela/asker](https://github.com/eavalenzuela/asker)

This functionality is even built into some modern-day EDR and XDR security solutions, although not all of them.  

### Conclusion 
 
Disabling LLMNR and NetBIOS Name Service is a great step towards hardening your internal network environment. Given that it's such a prolific penetration testing tool, you’d force your testers to work harder by cleaning up some of this low-hanging fruit. We are big fans of making testers work harder, as it increases the value you get through their test. If your tester doesn't know what Responder is, or isn't making use of it as part of their methodology, run the other way ([right into our arms](https://strategicdefense.co/services/network/)).
