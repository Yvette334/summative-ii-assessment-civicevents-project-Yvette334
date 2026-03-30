# CivicEvents+ Frontend

This is the frontend for the CivicEvents+ project. It is built with HTML, Tailwind CSS and jQuery. It connects to the backend API to show events, announcements, promos, notifications and more.

---

## How to Run Locally

You do not need to install anything special for the frontend. Just follow these steps:

1. Make sure the backend is running first (see backend README)

2. Open the `frontend` folder

3. Open `login.html` in your browser — you can just double click it or use Live Server in VS Code

That's it. The frontend talks to the backend at `http://localhost:4000`

---

## Connecting to the Backend

The base URL is set in `js/api.js`:

```js
const base_url = "http://localhost:4000";
```

If your backend runs on a different port, change that value.

Make sure the backend is running before you open any page, otherwise the API calls will fail.

---

## Pages

| Page | What it does |
|------|-------------|
| `login.html` | Login page |
| `signup.html` | Register a new account |
| `event.html` | List of all events with search and pagination |
| `event-detail.html` | Single event with register button and feedback |
| `admin-event.html` | Admin form to create or edit an event |
| `announcement.html` | List of audio announcements |
| `admin-announcement.html` | Admin form to upload an announcement |
| `promo.html` | List of video promos |
| `admin-promo.html` | Admin form to upload a promo |
| `admin-dashboard.html` | Admin stats and user management |
| `profile.html` | View and update your profile |
| `registration.html` | See your registered events |
| `services.html` | City services request form |

---

## Role-Based Guards

There are two roles: `admin` and `user`.

**Where the guards are in the code:**

- `js/auth.js` — `enforceRole(['admin'])` at the top of every admin page. If a normal user tries to open an admin page, they get redirected away.

- `js/auth.js` — `setupNavigation()` hides or shows the Admin Dashboard link based on role. It uses the class `admin-only` on elements that only admins should see.

- Inside each page script — admin controls like Edit, Delete buttons are only added to the HTML if `currentUser.role === 'admin'`. Normal users never see those buttons.

- The backend also checks the token on every request, so even if someone bypasses the frontend, the API will reject them.
---

## Tech Used

- HTML5
- Tailwind CSS (via CDN)
- jQuery 3.7.1 (via CDN)
- Vanilla JS for logic
