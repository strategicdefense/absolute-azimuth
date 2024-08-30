---
image: "~/assets/images/goalbased.webp"
title: Cutting Through the Fog
publishDate: 2024-03-26T00:00:00Z
author: Staff
excerpt: Penetration testing should be drastically different than your vuln management program. Sure - there might be some overlap between exploitable vulnerabilities, but those similarities end at 10:15 on Monday morning.
tags:
 - penetration testing
---


# Pentesting to Focus on What Matters

## Intro
I got an email from a potential client the other day. We have been ramping up our outreach here at Strategic Defense and had sent over our core services list. We've been around for decades, but our entity is new, so it's taking a little education to explain to people who we are. Anyways, I got this (paraphrased) response back:

> I get a dozen calls/emails a week from companies that do pen testing. My problem isn't finding problems to fix, it's having the team and the time to fix the problems we've already found. The world needs less companies doing pen testing, and more companies offering remediation services.

I pondered this for a bit. He's right, there is no shortage of vendors selling pentests. Especially ones selling their services as quick, easy, and automated. The problem is, he's assuming that the issues his pentest providers are finding are all important. Or even more bluntly, that all pentest providers (and their output) are equal. 

(_Sidenote, I can't believe its 2024 and I'm about to explain the difference between a pentest and a vuln scan_) 

We've all seen those reports; the test cost $799, says pentest on the front page, and has about 500 findings ranging from SSLv3 to anonymous FTP access. Most of them are critical, and there's zero additional context. 

In that light, I'd agree with this potential client. 500 things to fix, all critical, and all painstakingly difficult to fix. You'd need a large team, and lots of time to even make a dent. It would feel hopeless, and all pentest providers would feel the same.

The issue here is that's not good penetration testing, that's vulnerability management. 

## Good Penetration Testing
Penetration testing should be drastically different than your vuln management program. Sure - there might be some overlap between exploitable vulnerabilities, but those similarities end at 10:15 on Monday morning. Testing should focus on things that matter, have increased context, and work on threat models that a scanner can't even dream of. It's of zero use to a customer if their tester shows up, runs the same scanner they use for vuln management, and tries to exploit the exploitables. You'd end up with hundreds of CVSS Critical findings, all of which would feel nearly impossible to fix. 

Cue that remediation services company making cash-register noises.

### More Than Just a Vulnerability Scan

That's where _good_ penetration testing can help. They don't check for the 20,000 things that an engineer could write signatures for. They check for the things they _can't_ write signatures for. Complex application issues, layer 2/broadcast attacks, and things that require user interaction, for example. Beyond that, they don't just stop at identifying the surface vulnerability. They start to carve a path through your infrastructure, leveraging stolen credentials and abusing trust relationships along the way. They find the same killchains that a real-world attacker would, and threats where they show their value. 

### What About Automation?
This is key, scanners (or heavily automated BAS-style testing) can only check for the issues they've been programmed to check for. Having worked for more than one large infosec company that rolled their own scanner, I know that engineers trend towards writing vulnerability checks that are easy to develop and scale, with a low margin for false positives (although, ask me about the time the engineer told me their scanner could replace pentesting, and then it started flagging Windows boxes with critical Cisco vulns the next time I ran it :)). Thats great, but what about the other issues? The ones that are a little more difficult to automate, maybe require a human to help them along, and require context about the environment to pull off? Well, those probably don't get checks written for them, and we've found that over thousands of tests, that those are the ones that exist in more environments. 

Put shortly, if it's easy to scan for and exploit, someone's probably already found it. The pickings are slim. If its a little more difficult (say, the kind our penetration testing services target), those can exist for years in an environment, even with a healthy vuln management program, just waiting for an attacker to take advantage of. We've heard this time and time again...."why didn't my last pentest find that?" Well, probably because your last pentest wasn't really a pentest.

The key here is that good penetration testing approaches your environment with a few things in mind:

- **A thought-out threat model.** Not just 'scan everything and show me all the findings', but specifics like:
    - _Where are we starting from?_ A Cloud environment, the guest wireless, or a populated user network?
    - _Where are we trying to go?_ To a different Cloud environment, across a Vendor VPN, or out to the OT plant floor?
    - _What are we starting with?_ Credentials, access, or specific knowledge? Is this an insider threat, or someone that guessed external credentials?
    - _What type of data are we expecting to see along the way?_ This can be key to clue your tester in on what to look for, and what to try and exfiltrate.

- **TTPs that match what you're up against.** Its useless to check for scanner issues when you're worried about APT groups. 
- **Wide-open communication and collaboration.** You get to ride along as your tester peels back the onion and starts to identify kill chains. You can help provide context (if you want), to change how the engagement unfolds. I've seen the whole gamut, from "I'm not telling you anything" to "Check that .25 box, there's a keepass database on it you might be interested in."
- **Adaptability that only humans can provide.** I can't tell you how many times I've reviewed scan results for a network, found nothing but unexploitable fluff, and then 20 minutes of manual poking later had RCE on a system.


## Am I the Victim Of Trash Pentesting?
How can you tell? I've written thousands of pentest reports over the years (and seen thousands more), so it's easy for me to sniff-test a report to know if it was a good test or not. Some things i've seen in the past that tell me it's not a good test:

- **More than ~15 findings.** Ok - this is subjective. It could have been a bloodbath of a internal test, and the tester really identified a rainbow of issues. Typically, once you get much higher than that number, a scanner produced it. Bonus points if they are all ranked by CVSS, most of them are high/critical severity, and the tester didn't shell a single box with them.
- **Zero narrative or storyline.** Just a raw list of findings with no additional context.
- **Vuln Scanner References.** References hosted on Nessus or Qualys domains.
- **No Threat Modeling.** No mention of the importance of the source network, the target network(s), or their relationship. No strategic objectives. Just a broad sweep and a list of IPs and associated findings.

Of course these tests feel overwhelming. There's no context or sane prioritization. 

## Getting Strategic
My legs are getting tired from standing on this soap box, so I'll leave you with this. 

Context and prioritization are important. We find that we can do a pre-engagement threat model with a client, scope up a valuable test, and leave them with a handful of findings that have true critical impact to their environment. They usually end up being the same types of findings that scanners struggle to find, _and_ ones the real bad guys use.

That 5-10 finding number feels important. It lets IT teams focus on what _really_ matters, and helps paint a future with a clear, manageable list of priorities. Many clients have taken our pentest findings and directly mapped them to their strategic objectives for the upcoming year. 

They spend some time working on remediation (which is usually low-cost or free), and then we come back to tweak the threat model and run testing again. That back-and-forth, blue vs red can produce a ton of value. It's the best kind of exercise.

In my mind, a pentest is the best way to set your security vision for the year. It helps validate your assumptions, challenge them some more, and find critical ways to breach you weren't even thinking of.

Got questions? [We'd be happy to chat](/contact/)
