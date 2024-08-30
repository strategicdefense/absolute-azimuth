---
image: "~/assets/images/castle.webp"
title: Penetration Testing - The Key to Defending Against Ransomware
excerpt: The urgency to “do something” to increase defenses against ransomware has never felt more critical. However, it can be difficult to know where to focus. It doesn’t help that every security vendor on the planet sells you their security software as the golden ticket, only to find out later that it fools gold.
author: Staff
tags: 
 - penetration testing
 - Ransomware
publishDate: 2024-04-04T00:00:00Z
---

Ransomware remains one of the biggest challenges faced by organizations worldwide. Characterized by its ability to encrypt files and demand a ransom for their release, ransomware can cause operational disruption and financial losses. The urgency to “do something” to increase defenses against ransomware has never felt more critical. However, it can be difficult to know where to focus. It doesn't help that every security vendor on the planet sells you their security software as the golden ticket, only to find out later that it fools gold. 

As a professional group of hackers (and ones that have breached thousands of companies and helped on hundreds of ransomware incident response engagements), we’ve got some unique perspective on this. Maybe we should have titled this blog ‘A Hackers Guide to Ransomware Defense’...

Anyways, let's explore some critical steps any organization can take to up their game against ransomware threat actors.

## 1. Proactive Penetration Testing

Penetration testing is an authorized, simulated cyberattack on a computer system, performed to evaluate the security of the system. However, not all pen testing is created equal. Proactive penetration testing goes beyond the basics by not only identifying vulnerabilities but also simulating advanced attack scenarios that mimic the tactics, techniques, and procedures (TTPs) of actual ransomware attackers. This approach provides a realistic assessment of an organization's preparedness and resilience against ransomware threats. By identifying and exploiting weaknesses before attackers do, organizations can significantly reduce their attack surface. Over the years, we’ve built our testing methodology to focus on those specific issues; the ones commonly targeted by ransomware threat actors, but automated scanners struggle to find.

_oh hey look, the penetration testing guys are telling us how awesome penetration testing is!_

Yep. Because time and time again, we’ve seen nasty ransomware cases where basic security hygiene, including a quality penetration test, would have caught the initial access vector used by the threat actor. We’d go so far to say this:

> Never in our entire careers, delivering thousands of penetration tests and assisting with hundreds of IR investigations, did we come across a ransomware initial entry point that wouldn't have surfaced on a quality, well-scoped penetration test.

We've even gone so far as to [make a service out of it.](/services/ransomware/)

### Key Components of Proactive Penetration Testing:

- **Real-World Attack Simulation:** Emulate the behavior of ransomware attackers to identify how they could infiltrate your network and encrypt your data.
- **Quality Testing:** An automated scan, or a lackluster test, isn't going to help you. You need a quality penetration test delivered by an expert practitioner.
- **Phishing and Social Engineering Tests:** Since many ransomware attacks start with a phishing email, [testing employees' awareness](/services/phishing/) and response to such threats is crucial.

## 2. Implementing Multi-Factor Authentication (MFA)

MFA is a security system that requires more than one method of authentication from independent categories of credentials to verify the user's identity for a login or other transaction. MFA can significantly hinder ransomware attackers' attempts to gain initial access to systems. By requiring a second form of identification, such as a code generated from an app or a fingerprint, even if attackers compromise a user's password, they would still need to bypass the additional authentication layer, making unauthorized access exponentially more challenging.

More challenging, but not impossible (looking at you, MFA fatigue). This is another reason why testing is important. If we think about the last 10 clients we’ve compromised performing network penetration testing, we’d wager that 8 of them had MFA that we were able to circumvent. Clicking the MFA box used to put you in the safe zone, but today there’s much more nuance. 


## 3. Efficient Vulnerability Management

Vulnerability management involves the continuous process of identifying, classifying, prioritizing, remediating, and mitigating software vulnerabilities. CISA often highlights the most exploited vulnerabilities by cyber adversaries, emphasizing the importance of timely patching and updates. Organizations must establish a routine for scanning and patching vulnerabilities, especially those known to be exploited in ransomware attacks. Keeping systems and software up to date is a fundamental practice to protect against ransomware.

One of the keys to great vuln management (and something we talk through in our pre-test scoping) is having a good handle on your perimeter inventory. You want to have identified and be scanning the most complete list of your perimeter assets that you can. Many times we find clients hand over a list of systems for us to test, only for us to find a handful more through OSINT. The greatest security stack in the world doesn't help with systems it doesn't know about. 

### Most Exploited Vulnerabilities:

This is a great resource to help focus on what matters. [CISA publishes the most commonly exploited vulnerabilities](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) which you can use to cross-reference with your own vulnerability management. Some of the most commonly exploited vulnerabilities include issues within remote work tools, outdated Windows OS vulnerabilities, and flaws in web-based applications. Regularly consulting CISA advisories can guide organizations in prioritizing which vulnerabilities to address first, helping them cut through the noise.

[CISA even offers a free](https://www.cisa.gov/resources-tools/services/cisa-vulnerability-scanning) (albeit limited) attack surface management scan. You can also roll your own open-source versions with tools like OpenVAS or [Nuclei](https://github.com/projectdiscovery/nuclei). Of course, paid options like Nessus and Qualys also exist. 

## 4. Robust Backup and Recovery Strategy

A robust backup and recovery strategy is your safety net against ransomware. Ensure regular backups of critical data, and more importantly, test the recovery process to ensure you can quickly restore operations. The backups should be stored offline or in a separate environment to prevent them from being encrypted during an attack, which is something we test for during our ransomware-themed internal penetration tests. If your backups reside on a domain-joined host that shares trust with the general user population, they can be easy to encrypt.

## 5. Employee Training and Awareness

Employees are often the first line of defense against ransomware attacks. Regular training on recognizing phishing emails, safe browsing practices, and the importance of reporting suspicious activities can significantly reduce the risk of an attack succeeding. An informed and vigilant workforce is a critical component of any cybersecurity strategy.

The fight against ransomware requires a multifaceted approach, combining technical defenses with human vigilance. We might be biased, but penetration testing emerges as a cornerstone strategy, enabling organizations to stay one step ahead of cybercriminals by identifying and mitigating vulnerabilities before they can be exploited. Coupled with the implementation of MFA, efficient vulnerability management, a robust backup and recovery strategy, and continuous employee training, organizations can significantly enhance their cybersecurity posture and resilience against ransomware threats.


