# Not Started

- add unread tab to messages

- imlement backend validation
- implement frontend validation
- doubkle click does not like post

- [ ] # fix the server inconsitent app.use api routes
- [ ] [extract socket io from server.js to to make it cleaner ]
- [ ] [Change styling of videos]
- [ ] [Move non-reusable hooks from context to component level ]
- move trash can in story
- remove unecessayr toast success notifications
- Replace GSAP with framer motion
- implement repost
- add typescript
- add barrel exports
- remove hashtags
- use a glassmorphism
- remove placeholder hashtags
- copy the design of the story section
- double click is currently liking psot and navigating to modal ... it should only like the post
- implement like feature in stories
- add sentry 
- add add stream for video calls 
- add winston 

- shouldnt the following be renamed:
  app.use('/api', likeRoutes)
  app.use('/api', bookmarkRoutes)
  app.use('/api', commentRoutes)

# In Progress

# Completed

- implement share count
- include time posted
- implement share count same way comment count and like count was implemented
- show number of comments, likes, and shares in the feed next to buttons ...
- move follow button to the top right corner of post detials modal, there is some overlap
- when i click on a post shared in messages, it should show post detail modal
- update create story modal to remove the section that says stories posted to your folloers
- [ ] [Implement password reset success page]
- not able to access story when i click on profile pciture in profile page
- getting null is not an object (evaluating 'f.\_id') in friend stories tab
- notificaitons page not loaidng bug
- infinite loading bug in explore page
- conversation lsit shows current user.. this should not be the case
- i should be able to naviate to users profile from story by clicking on their name ..
- suggested users looks like it uses placeholder text .. use actual profile pic .. same thing for the profile information above the the logout button
- clicking on a post in explore page should navigate to post details modal
- remove your story
- remove search sidebar navigtation and remove the component for this search.. no longer needed

# Lint + Prettier + Prettier Plugin for Tailwind CSS

ESLint — Linter: static analysis for bugs, best-practices, and code-quality rules (unused vars, React Hooks rules, possible errors). It can autofix some problems but its main job is correctness/consistency beyond formatting.
Prettier — Formatter: opinionated, deterministic code formatting (whitespace, line breaks, wrapping, quotes/semicolons). It reformats entire files to a single style.
How they work together: use Prettier for formatting and ESLint for quality rules; add eslint-config-prettier to disable overlapping ESLint style rules (or eslint-plugin-prettier to run Prettier inside ESLint).
Common workflow: run prettier --write then eslint --fix (or use Husky + lint-staged to run on commits). This is the typical industry setup.
Tailwind note: use prettier-plugin-tailwindcss to automatically sort Tailwind classes.

cd frontend && npm install -D prettier prettier-plugin-tailwindcss eslint-config-prettier eslint-plugin-prettier eslint-plugin-tailwindcss
