# Campus Event Countdown 🎓

A responsive web app to organise college events, exams and assignment deadlines, with a live countdown for every item.

**Live demo:** https://YOUR-USERNAME.github.io/campus-event-countdown/

## Features

- Add and delete events and tasks
- Live countdown to each date and time
- Types (Event / Task) and categories (College, Exam, Assignment, Workshop, Festival, Personal, Other)
- Search, plus filters by type and status
- Completion confirmation (OK = Yes, Cancel = Not yet)
- Motivational messages after completing an item
- Reopen completed items
- Saved in the browser with `localStorage`
- Responsive layout for mobile, tablet and desktop

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (no frameworks, no installation)

## Project Structure

```text
campus-event-countdown/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── LICENSE
├── .gitignore
└── README.md
```

## Run Locally

1. Download or clone this repository.
2. Open the `campus-event-countdown` folder.
3. Double-click `index.html` to open it in a browser.

No server or installation is required.

## How It Works

- Items are stored in an array and saved to `localStorage` under the key `campusCountdownItems_v1`.
- `render()` redraws the list whenever you add, complete, delete, search or filter.
- A timer re-renders the list every minute so countdowns stay up to date.
- User text is escaped before being shown, so typed HTML cannot break the page.

## Data Storage

Items are saved in your browser on the current device. Clearing browser data removes them, and data does not sync between devices.

## What I Learned

- Building a form and handling the submit event
- Rendering a list from an array with JavaScript
- Working with dates and times to calculate countdowns
- Searching and filtering data
- Saving and loading data with `localStorage`
- Making a responsive layout with CSS Grid and media queries

## Future Improvements

- Dark mode
- Browser notifications
- Calendar view
- Cloud sync and user accounts

## Author

**Vaishnavi Shelke**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file.
