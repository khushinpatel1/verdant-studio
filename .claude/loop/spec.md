# Loop Spec — the pin that stops invention

> Fill **GOAL** and **ACCEPTANCE CRITERIA** before launching. Everything else the
> planner phase (Opus) may refine. The builder is forbidden from inventing work
> outside this file. If it isn't an acceptance criterion, it isn't "done."

## GOAL
<!-- ONE paragraph. What does the finished product look like? Write it as if the
     work is already shipped. e.g. "Verdant ships with zero hot-linked or picsum
     assets; every image/video is self-hosted under public/ and attributed." -->

(YOU FILL THIS)

## IN SCOPE
- (bullet)

## OUT OF SCOPE
- Editing `main` directly (the loop only ever touches its worktree branch)
- New skins or new section components unless listed in IN SCOPE
- Anything that changes the public deploy without a human merge

## ACCEPTANCE CRITERIA (objective, machine-checkable where possible)
<!-- These are the GATE. The loop will not declare done until ALL are true and
     the verify command is green. Prefer checks a script can confirm. -->
- [ ] `npm run build` exits 0
- [ ] `npm run check` exits 0
- [ ] (your criterion, e.g. "grep finds no picsum.photos / images.unsplash.com in src/")
- [ ] (your criterion)

## VERIFY COMMAND
<!-- The single command the loop runs to gate completion. Default below. -->
```
npm run build && npm run check
```
