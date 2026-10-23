# ⛅ SkyPulse — Live Weather Tracker

Μια σύγχρονη, κομψή single-page web εφαρμογή (HTML5 / CSS3 / Vanilla JS) για ζωντανή παρακολούθηση του καιρού σε πραγματικό χρόνο, με δεδομένα από το [Open-Meteo API](https://open-meteo.com/).

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Vanilla JS](https://img.shields.io/badge/Built%20With-Vanilla%20JS-yellow.svg)
![CSS3 Glassmorphism](https://img.shields.io/badge/UI-Glassmorphism-0284c7.svg)

---

## ✨ Χαρακτηριστικά (Features)

- 🌍 **Ζωντανά Δεδομένα Καιρού**: Πραγματικά δεδομένα θερμοκρασίας, υγρασίας, ταχύτητας ανέμου, ατμοσφαιρικής πίεσης και βροχόπτωσης.
- 🔍 **Αναζήτηση Πόλεων & Geocoding**: Άμεση αναζήτηση για οποιαδήποτε πόλη στον κόσμο (με υποστήριξη ελληνικών και αγγλικών) καθώς και quick-select κουμπιά για δημοφιλείς πόλεις.
- 🕒 **Ωριαία Πρόγνωση (24 Ώρες)**: Οριζόντιο interactive slider με την εξέλιξη της θερμοκρασίας και των συνθηκών ανά ώρα.
- 📅 **Πρόγνωση 7 Ημερών**: Εβδομαδιαία πρόγνωση με μέγιστες και ελάχιστες θερμοκρασίες.
- 🎨 **Δυναμικό Θέμα & SVG Icons**: Το φόντο και τα ambient orbs αλλάζουν αυτόματα ανάλογα με τις καιρικές συνθήκες (ήλιος, συννεφιά, βροχή, καταιγίδα, χιόνι) και την ώρα (ημέρα/νύχτα).
- 🌡️ **Εναλλαγή Μονάδων**: Άμεση εναλλαγή μεταξύ Κελσίου (°C) και Φαρενάιτ (°F).
- 📱 **Responsive Design**: Πλήρως βελτιστοποιημένο για κινητά, τάμπλετ και υπολογιστές.
- ⚡ **Zero Dependencies / No API Key Required**: Δεν απαιτείται καμία εγγραφή ή API key για να τρέξει.

---

## 🚀 Προβολή στο GitHub Pages (Live Demo)

Για να είναι η σελίδα άμεσα προσβάσιμη online σε όλους:
1. Μεταβείτε στο αποθετήριο στο GitHub: **Settings** > **Pages**.
2. Στο **Branch**, επιλέξτε `main` και `/ (root)`.
3. Πατήστε **Save**.
4. Σε 1-2 λεπτά η εφαρμογή θα είναι live στο:
   `https://<your-username>.github.io/<repository-name>/`

---

## 💻 Τοπική Εκτέλεση (Run Locally)

Μπορείτε απλά να ανοίξετε το αρχείο `index.html` σε οποιονδήποτε σύγχρονο περιηγητή (Google Chrome, Firefox, Safari, Edge), ή να εκκινήσετε έναν τοπικό server:

```bash
# Με Python
python -m http.server 3000

# Με Node.js (npx serve)
npx serve
```
Και επισκεφθείτε τη διεύθυνση `http://localhost:3000`.

---

## 🧪 Έλεγχος & Tests

Το project περιλαμβάνει αυτοματοποιημένο script ελέγχου `test_weather_app.py`:

```bash
python test_weather_app.py
```

Ελέγχει:
- Ακεραιότητα και μέγεθος αρχείων (`index.html`, `style.css`, `app.js`).
- Σύνδεση DOM element IDs μεταξύ HTML και JavaScript.
- Ζωντανή απόκριση API (Geocoding & Forecast endpoints).
- Λειτουργία τοπικού HTTP server.

---

## 📄 Άδεια Χρήσης (License)

Το έργο διατίθεται υπό την άδεια [MIT](LICENSE).
