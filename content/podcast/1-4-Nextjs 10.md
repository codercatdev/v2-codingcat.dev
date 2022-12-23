---
episode: 4
recording_date: January 1, 2021
season: 1
status: released
podcast: CodingCat.dev
chapters_done: true
cloudinary_convert: false
devto: https://dev.to/codingcatdev/1-4-next-js-10-56k1
excerpt: Talking with Guillermo Rauch about Next.js 10 and Vercel. Including plans for 2021.
hashnode: https://hashnode.codingcat.dev/podcast-1-4-next-js-10-with-guillermo-rauch
slug: 1-4-next-js-10-with-guillermo-rauch
spotify: https://open.spotify.com/episode/5mrXe0wPHc84li5d1ZvVYd?si=SnzQ51ErR8ysFEuCuYJvsg
start: January 1, 2021
title: Next.js 10
youtube: https://www.youtube.com/watch?v=Xr4wqU5FyMI
---

Guest Details
Guillermo Rauch – CEO Vercel
https://www.linkedin.com/in/guillermo-rauch-b834b917b/

https://vercel.com/

Who is Guillermo Rauch?
He’s the founder and CEO of Vercel, a cloud platform for static sites that fits around a Jamstack workflow. He’s also the co-creator of Next.js. He previously founded LearnBoost and CloudUp, and is well-known as the creator of several popular node open source libraries like Socket.io, Mongoose, and SlackIn. Prior to that, he was a core developer on MooTools.

Since we last talked a year ago
Zeit became Vercel and gained $21M in funding.
Vercel’s $40M Series B happened in December.
Next.js 9 added (to name a few)
Preview Mode
Environment Variables
Fast Refresh
Static Regeneration
Next.js Analytics / Commerce
Next.js 10 released
next/image
@next/mdx
Vercel
We are now using Vercel and Next.js in our next version of codingcat.dev. It has taken me a little bit of getting used to the CI/CD flow coming from Amplify and Google Cloud Build for Firebase hosting. Can you tell me more about Deploy Preview?
https://rauchg.com/2020/vercel#preview
NextJS
I have seen a lot of movement to NextJS in the Jamstack community in the last year. What do you think is driving this move from Gatsby to Next? – Brittney
What is in store for NextJS in 2021? – Brittney
In browser navigation not working in Firefox and editing in dev tools requires the server to be restarted.
Images must be in the public folder.
CodingCatDev on NextJS
Currently we are running on Firebase as a backend with two separate Next.js sites

Admin – Next.js, React, MaterialUI, backed by Firebase
Main – Next.js, React, Tailwindcss, backed by Firebase
How can we statically build only our important pages, and then rely on regeneration for the rest? Is it as simple as saying build latest 50 pages and let page props do the rest?

Lighthouse vs. Vercel Analytics how to get 100?

I have read what I will call “way” too much about the Next.js chunks and that Lighthouse complaining about them is basically a non-issue, but is this true?

So in looking at the P99 on Vercel we actually get 100, so what gives, what is this actually showing?

Purrfect Picks
Guillermo Rauch
https://rauchg.com/2020/next-for-vercel

https://vercel.com/virtual-event-starter-kit

https://demo.vercel.store/

https://nextjs.org/commerce

https://cleanshot.com/

https://lighthouse-metrics.com/

“Impossible just takes longer”

Alex Patterson
Next.js Discussion

[https://github.com/vercel/next.js/discussions?discussions_q=preview+mode&page=2

](https://github.com/vercel/next.js/discussions?discussions_q=preview+mode&page=2)Lightest

https://lightest.app/

Brittney Postma

Bridgerton – Netflix show: https://www.netflix.com/title/80232398

The Console Logs (my digital garden/notes site) – https://www.theconsolelogs.com/