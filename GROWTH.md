# Growth plan

Four steps to build a repeatable acquisition channel for
**react-native-magic-tab-bar**.

## The problem

Downloads are not just low — they are **falling**:

| Month | Downloads | |
| --- | ---: | --- |
| 2026-06 | 308 | launch |
| 2026-07 | 644 | peak |
| 2026-08 | 457 | |
| 2026-09 | 163 | **down 75% from July** |

GitHub stars: **0**. npm total since launch: ~1,572.

Launch interest faded and nothing replaced it. This is not a traffic problem,
it is **no acquisition channel**. At this volume a meaningful share is CI and
bots, so treat **stars** as the truer signal for now.

**Baseline set 2026-09-30**, the day the React Native Directory listing merged
([directory#2847](https://github.com/react-native-community/directory/pull/2847)).
Re-measure in 30 days against the table above.

---

## Step 1 — Expo Snack (highest leverage)

The README has **zero** Snack links. For a visual UI library this is the biggest
conversion loss: today someone must create a project, install the package and
wire up a navigator *before* seeing anything move. A Snack shows the bar
animating in a browser in five seconds.

Build it on the **React Navigation** entry point (`MagicTabBarNavigation`) —
`@react-navigation/bottom-tabs` runs in Snack, Expo Router's file-based routing
does not.

- [ ] Write a single-file Snack: 4–5 tabs, one badge, one `isLight` tab
- [ ] Publish at snack.expo.dev under your account (a saved Snack gets a stable URL)
- [ ] Embed it at the **top** of the README, above the GIFs
- [ ] Add the URL to the Directory entry's `examples` array — this is the one
      legitimate reason to open a second PR against `react-native-libraries.json`

## Step 2 — Reddit (biggest single spike)

r/reactnative is where a visual library earns its first few hundred stars.
Your GIFs are the asset that makes it work.

Frame it as the **problem solved**, never as "I made a library":

> Most custom tab bars lock you into Expo Router *or* React Navigation.
> I built one that drives both from the same component.

- [ ] Shrink the GIFs first — currently 9.2 MB (iOS) and 7.7 MB (Android);
      they will not autoplay reliably. Target well under 3 MB
- [ ] Post to r/reactnative with the iOS GIF
- [ ] Reply to every comment for the first 48 hours; engagement drives ranking
- [ ] Follow up in the Expo Discord `#showcase` and Reactiflux `#react-native`

## Step 3 — Content that compounds

Reddit spikes and dies within days. Search traffic accumulates. This is the step
that actually stops the decline.

Target the queries people really type:

- "custom tab bar in Expo Router" ← highest volume
- "animated bottom tab bar React Native"
- "Expo Router tab bar customization"

- [ ] Write one article on dev.to, cross-post to Medium
- [ ] Answer the existing StackOverflow questions on those terms and link it
      (answer the question properly first — a bare link gets removed)
- [ ] Reuse the GIFs; the article should show the result in the first screen

## Step 4 — Positioning (apply to all of the above)

The most popular custom animated tab bar,
[`react-native-animated-nav-tab-bar`](https://github.com/torgeadelin/react-native-animated-nav-tab-bar),
has **1,108 stars** and was **last committed May 2025**. It predates the New
Architecture. Callstack's `react-native-bottom-tabs` (1,459 stars) is a
different product — *native* SwiftUI/Material tabs, not a custom animated bar.

So the gap is real, and the pitch is:

> **The maintained, New-Architecture-ready alternative — and the only one that
> drives both Expo Router and React Navigation from one component.**

Use that line in the Reddit post, the article, the README opening and the repo
description. "Another tab bar" is not a reason to switch; "the one you're using
has been dead since 2025" is.

---

## Tracking

Check monthly:

```bash
# downloads
curl -s "https://api.npmjs.org/downloads/point/last-month/react-native-magic-tab-bar"

# stars
curl -s "https://api.github.com/repos/Bhavinpethani04/react-native-magic-tab-bar" \
  | grep '"stargazers_count"'
```

| Milestone | Unlocks |
| --- | --- |
| Directory listed | ✅ done 2026-09-30 |
| 100 stars | credibility for blog posts and comments |
| 300–500 stars | resubmit to [awesome-react-native](https://github.com/jondot/awesome-react-native) — its bar is "real adoption or exceptionally novel", which is why PR #1228 is not worth retrying before this |

> Not part of the published package — `package.json#files` ships only
> `src`, `lib` and `CHANGELOG.md`.
