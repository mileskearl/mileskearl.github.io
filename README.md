# mileskearl.com

My personal site. Built by hand — plain HTML, plain CSS, vanilla JavaScript. No frameworks, no build step.

## Files

| File | What it is |
|---|---|
| `index.html` | The structure. What's on the page and in what order. |
| `style.css` | The looks. Colors and fonts are named at the top in `:root`. |
| `data.js` | **The file I edit most.** Projects, upcoming dates, idea log. |
| `app.js` | The code that turns `data.js` into HTML and fetches the weather. |
| `assets/` | Images. `sketch.jpg` is the paper drawing this site came from. |

## To add a project or a date

Edit `data.js`. Don't touch the HTML.

## Live data

Weather and sunset come from [Open-Meteo](https://open-meteo.com) — free, no API key, no signup. Sunset is the useful part: daylight is the work window for anything outdoors, and it shrinks every week through the fall.

## Still to do

- [ ] Add `assets/hero.jpg` — the background photo for the top of the page
- [ ] Replace the email address in the footer with a real business email
- [ ] Rewrite the About paragraph in my own words
- [ ] Point the domain at this repo

## Rules for this repo

It's public, and so is every commit ever made to it. Nothing goes in here that shouldn't be permanent:

- No home address, no personal phone number
- No schedule showing where I am at a given time
- No customer names, addresses, or identifiable photos of their homes
- No API keys, passwords, or anything secret — ever, even briefly
