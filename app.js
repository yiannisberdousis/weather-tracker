/**
 * Live Weather Tracker (SkyPulse)
 * Real-time weather dashboard powered by Open-Meteo API
 */

// Application State
const state = {
  city: 'Αθήνα',
  country: 'GR',
  lat: 37.9838,
  lon: 23.7275,
  unit: 'c', // 'c' for Celsius, 'f' for Fahrenheit
  weatherData: null,
  autoRefreshInterval: null,
};

// Weather Code Mapping (WMO standard) to Greek description, icon type, and theme class
const WEATHER_CODES = {
  0: { desc: 'Αίθριος Ουρανός', icon: 'clear-day', iconNight: 'clear-night', theme: 'weather-clear' },
  1: { desc: 'Κυρίως Αίθριος', icon: 'clear-day', iconNight: 'clear-night', theme: 'weather-clear' },
  2: { desc: 'Μερικώς Συννεφιασμένος', icon: 'partly-cloudy-day', iconNight: 'partly-cloudy-night', theme: 'weather-clouds' },
  3: { desc: 'Συννεφιασμένος', icon: 'cloudy', iconNight: 'cloudy', theme: 'weather-clouds' },
  45: { desc: 'Ομίχλη', icon: 'fog', iconNight: 'fog', theme: 'weather-clouds' },
  48: { desc: 'Πυκνή Ομίχλη', icon: 'fog', iconNight: 'fog', theme: 'weather-clouds' },
  51: { desc: 'Ελαφρύ Ψιχάλισμα', icon: 'drizzle', iconNight: 'drizzle', theme: 'weather-rain' },
  53: { desc: 'Μέτριο Ψιχάλισμα', icon: 'drizzle', iconNight: 'drizzle', theme: 'weather-rain' },
  55: { desc: 'Έντονο Ψιχάλισμα', icon: 'drizzle', iconNight: 'drizzle', theme: 'weather-rain' },
  61: { desc: 'Ελαφριά Βροχή', icon: 'rain', iconNight: 'rain', theme: 'weather-rain' },
  63: { desc: 'Μέτρια Βροχή', icon: 'rain', iconNight: 'rain', theme: 'weather-rain' },
  65: { desc: 'Ισχυρή Βροχή', icon: 'heavy-rain', iconNight: 'heavy-rain', theme: 'weather-rain' },
  71: { desc: 'Ελαφριά Χιονόπτωση', icon: 'snow', iconNight: 'snow', theme: 'weather-snow' },
  73: { desc: 'Μέτρια Χιονόπτωση', icon: 'snow', iconNight: 'snow', theme: 'weather-snow' },
  75: { desc: 'Πυκνή Χιονόπτωση', icon: 'snow', iconNight: 'snow', theme: 'weather-snow' },
  77: { desc: 'Χιονονιφάδες', icon: 'snow', iconNight: 'snow', theme: 'weather-snow' },
  80: { desc: 'Παροδικές Μπόρες', icon: 'rain', iconNight: 'rain', theme: 'weather-rain' },
  81: { desc: 'Μέτριες Μπόρες', icon: 'rain', iconNight: 'rain', theme: 'weather-rain' },
  82: { desc: 'Βίαιες Μπόρες', icon: 'heavy-rain', iconNight: 'heavy-rain', theme: 'weather-rain' },
  85: { desc: 'Παροδική Χιονόπτωση', icon: 'snow', iconNight: 'snow', theme: 'weather-snow' },
  86: { desc: 'Ισχυρή Χιονόπτωση', icon: 'snow', iconNight: 'snow', theme: 'weather-snow' },
  95: { desc: 'Καταιγίδα', icon: 'thunderstorm', iconNight: 'thunderstorm', theme: 'weather-thunderstorm' },
  96: { desc: 'Καταιγίδα με Χαλάζι', icon: 'thunderstorm', iconNight: 'thunderstorm', theme: 'weather-thunderstorm' },
  99: { desc: 'Ισχυρή Χαλαζόπτωση', icon: 'thunderstorm', iconNight: 'thunderstorm', theme: 'weather-thunderstorm' },
};

// SVG Weather Icons Generator
function getSvgIcon(iconName) {
  switch (iconName) {
    case 'clear-day':
      return `<svg class="weather-svg-icon" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="14" fill="#FBBF24"/>
        <g stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round">
          <line x1="32" y1="6" x2="32" y2="12"/>
          <line x1="32" y1="52" x2="32" y2="58"/>
          <line x1="6" y1="32" x2="12" y2="32"/>
          <line x1="52" y1="32" x2="58" y2="32"/>
          <line x1="13.6" y1="13.6" x2="17.8" y2="17.8"/>
          <line x1="46.2" y1="46.2" x2="50.4" y2="50.4"/>
          <line x1="13.6" y1="50.4" x2="17.8" y2="46.2"/>
          <line x1="46.2" y1="17.8" x2="50.4" y2="13.6"/>
        </g>
      </svg>`;
    
    case 'clear-night':
      return `<svg class="weather-svg-icon" viewBox="0 0 64 64" fill="none">
        <path d="M42 46C29.85 46 20 36.15 20 24C20 18.23 22.23 12.98 25.86 9C16.88 10.96 10 18.9 10 28.5C10 40.93 20.07 51 32.5 51C40.09 51 46.77 47.23 50.8 41.44C48.06 44.3 45.2 46 42 46Z" fill="#FDE047"/>
      </svg>`;

    case 'partly-cloudy-day':
      return `<svg class="weather-svg-icon" viewBox="0 0 64 64" fill="none">
        <circle cx="25" cy="24" r="11" fill="#FBBF24"/>
        <path d="M48 48H22a10 10 0 0 1-1.6-19.87A13 13 0 0 1 45.3 26 8.5 8.5 0 0 1 48 48Z" fill="#CBD5E1"/>
      </svg>`;

    case 'partly-cloudy-night':
      return `<svg class="weather-svg-icon" viewBox="0 0 64 64" fill="none">
        <path d="M30 14a12 12 0 0 0 10 18 12 12 0 0 1-10-18Z" fill="#FDE047"/>
        <path d="M48 48H22a10 10 0 0 1-1.6-19.87A13 13 0 0 1 45.3 26 8.5 8.5 0 0 1 48 48Z" fill="#94A3B8"/>
      </svg>`;

    case 'cloudy':
      return `<svg class="weather-svg-icon" viewBox="0 0 64 64" fill="none">
        <path d="M48 46H18a10 10 0 0 1-1-19.95A13 13 0 0 1 41.5 22 10 10 0 0 1 48 46Z" fill="#94A3B8"/>
        <path d="M52 50H26a8 8 0 0 1-1-15.93A11 11 0 0 1 46.5 30 8 8 0 0 1 52 50Z" fill="#CBD5E1" opacity="0.9"/>
      </svg>`;

    case 'rain':
    case 'drizzle':
      return `<svg class="weather-svg-icon" viewBox="0 0 64 64" fill="none">
        <path d="M48 38H20a9 9 0 0 1-1.2-17.92A12 12 0 0 1 42.5 17 8 8 0 0 1 48 38Z" fill="#94A3B8"/>
        <g stroke="#38BDF8" stroke-width="3" stroke-linecap="round">
          <line x1="22" y1="44" x2="19" y2="52"/>
          <line x1="32" y1="44" x2="29" y2="52"/>
          <line x1="42" y1="44" x2="39" y2="52"/>
        </g>
      </svg>`;

    case 'heavy-rain':
      return `<svg class="weather-svg-icon" viewBox="0 0 64 64" fill="none">
        <path d="M48 36H18a9 9 0 0 1-1-17.94A12 12 0 0 1 41.5 15 8 8 0 0 1 48 36Z" fill="#64748B"/>
        <g stroke="#0284C7" stroke-width="3.5" stroke-linecap="round">
          <line x1="20" y1="42" x2="16" y2="53"/>
          <line x1="30" y1="42" x2="26" y2="53"/>
          <line x1="40" y1="42" x2="36" y2="53"/>
          <line x1="25" y1="50" x2="21" y2="60"/>
          <line x1="35" y1="50" x2="31" y2="60"/>
        </g>
      </svg>`;

    case 'thunderstorm':
      return `<svg class="weather-svg-icon" viewBox="0 0 64 64" fill="none">
        <path d="M48 36H18a9 9 0 0 1-1-17.94A12 12 0 0 1 41.5 15 8 8 0 0 1 48 36Z" fill="#475569"/>
        <polygon points="32,36 24,48 31,48 27,60 40,45 33,45" fill="#FBBF24"/>
      </svg>`;

    case 'snow':
      return `<svg class="weather-svg-icon" viewBox="0 0 64 64" fill="none">
        <path d="M48 38H20a9 9 0 0 1-1.2-17.92A12 12 0 0 1 42.5 17 8 8 0 0 1 48 38Z" fill="#94A3B8"/>
        <circle cx="22" cy="46" r="2.5" fill="#E2E8F0"/>
        <circle cx="32" cy="48" r="2.5" fill="#E2E8F0"/>
        <circle cx="42" cy="46" r="2.5" fill="#E2E8F0"/>
        <circle cx="27" cy="54" r="2" fill="#BAE6FD"/>
        <circle cx="37" cy="54" r="2" fill="#BAE6FD"/>
      </svg>`;

    case 'fog':
    default:
      return `<svg class="weather-svg-icon" viewBox="0 0 64 64" fill="none">
        <path d="M46 32H18a8 8 0 0 1 0-16 11 11 0 0 1 21.5-2A7 7 0 0 1 46 32Z" fill="#94A3B8" opacity="0.7"/>
        <line x1="14" y1="40" x2="50" y2="40" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
        <line x1="18" y1="47" x2="46" y2="47" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
        <line x1="22" y1="54" x2="42" y2="54" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
      </svg>`;
  }
}

// Convert Celsius to Fahrenheit
function formatTemp(celsius, unit = state.unit) {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
  if (unit === 'f') {
    return Math.round((celsius * 9/5) + 32);
  }
  return Math.round(celsius);
}

// UI Elements
const el = {
  liveClock: document.getElementById('liveClock'),
  unitC: document.getElementById('unitC'),
  unitF: document.getElementById('unitF'),
  refreshBtn: document.getElementById('refreshBtn'),
  searchForm: document.getElementById('searchForm'),
  cityInput: document.getElementById('cityInput'),
  quickCities: document.getElementById('quickCities'),
  statusMessage: document.getElementById('statusMessage'),
  
  cityName: document.getElementById('cityName'),
  countryCode: document.getElementById('countryCode'),
  lastUpdated: document.getElementById('lastUpdated'),
  weatherIconWrapper: document.getElementById('weatherIconWrapper'),
  currentTemp: document.getElementById('currentTemp'),
  conditionText: document.getElementById('conditionText'),
  feelsLike: document.getElementById('feelsLike'),
  
  humidityVal: document.getElementById('humidityVal'),
  windVal: document.getElementById('windVal'),
  precipVal: document.getElementById('precipVal'),
  pressureVal: document.getElementById('pressureVal'),
  
  hourlyForecast: document.getElementById('hourlyForecast'),
  dailyForecast: document.getElementById('dailyForecast'),
};

// Update live clock
function startClock() {
  function update() {
    const now = new Date();
    el.liveClock.textContent = now.toLocaleTimeString('el-GR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }
  update();
  setInterval(update, 1000);
}

// Status Banner Notifications
function showStatus(message, type = 'loading') {
  el.statusMessage.className = `status-banner ${type}`;
  el.statusMessage.innerHTML = `<span>${message}</span>`;
  el.statusMessage.classList.remove('hidden');
}

function hideStatus() {
  el.statusMessage.classList.add('hidden');
}

// Fetch Coordinates via Geocoding
async function geocodeCity(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=el&format=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Σφάλμα αναζήτησης πόλης.');
  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`Η πόλη "${cityName}" δεν βρέθηκε. Ελέγξτε την ορθογραφία.`);
  }
  return data.results[0];
}

// Fetch Full Weather Data from Open-Meteo
async function fetchWeatherData(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure&hourly=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Σφάλμα ανάκτησης μετεωρολογικών δεδομένων.');
  return await response.json();
}

// Render Weather UI
function renderWeather() {
  if (!state.weatherData) return;
  const data = state.weatherData;
  const current = data.current;
  const isDay = current.is_day === 1;
  const codeInfo = WEATHER_CODES[current.weather_code] || {
    desc: 'Άγνωστο',
    icon: 'partly-cloudy-day',
    iconNight: 'partly-cloudy-night',
    theme: 'weather-clear'
  };

  // Update Body Theme
  document.body.className = `${codeInfo.theme} ${isDay ? 'is-day' : 'is-night'}`;

  // Update Hero Card
  el.cityName.textContent = state.city;
  el.countryCode.textContent = state.country || 'GR';
  
  const now = new Date();
  el.lastUpdated.textContent = `Ενημέρωση: ${now.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })}`;
  
  const iconKey = isDay ? codeInfo.icon : (codeInfo.iconNight || codeInfo.icon);
  el.weatherIconWrapper.innerHTML = getSvgIcon(iconKey);
  
  el.currentTemp.textContent = formatTemp(current.temperature_2m);
  el.conditionText.textContent = codeInfo.desc;
  
  const apparentTempFormatted = formatTemp(current.apparent_temperature);
  el.feelsLike.textContent = `Αίσθηση σαν ${apparentTempFormatted}°${state.unit.toUpperCase()}`;

  // Metrics
  el.humidityVal.textContent = `${Math.round(current.relative_humidity_2m)}%`;
  el.windVal.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  el.precipVal.textContent = `${current.precipitation.toFixed(1)} mm`;
  el.pressureVal.textContent = `${Math.round(current.surface_pressure)} hPa`;

  // Hourly Forecast (Next 24 hours)
  renderHourlyForecast(data.hourly);

  // Daily Forecast (7 days)
  renderDailyForecast(data.daily);
}

// Render Hourly Forecast
function renderHourlyForecast(hourly) {
  if (!hourly || !hourly.time) return;
  
  const now = new Date();
  const currentIsoHour = now.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"
  
  let startIndex = hourly.time.findIndex(t => t.startsWith(currentIsoHour));
  if (startIndex === -1) startIndex = 0;

  const next24 = hourly.time.slice(startIndex, startIndex + 24);
  
  let html = '';
  next24.forEach((timeStr, idx) => {
    const actualIdx = startIndex + idx;
    const timeObj = new Date(timeStr);
    const hourLabel = idx === 0 ? 'Τώρα' : `${timeObj.getHours().toString().padStart(2, '0')}:00`;
    const temp = formatTemp(hourly.temperature_2m[actualIdx]);
    const code = hourly.weather_code[actualIdx];
    const itemIsDay = hourly.is_day ? hourly.is_day[actualIdx] === 1 : true;
    
    const codeInfo = WEATHER_CODES[code] || { icon: 'clear-day', iconNight: 'clear-night' };
    const iconName = itemIsDay ? codeInfo.icon : (codeInfo.iconNight || codeInfo.icon);

    html += `
      <div class="hourly-item ${idx === 0 ? 'now' : ''}">
        <span class="hourly-time">${hourLabel}</span>
        <div class="hourly-icon">${getSvgIcon(iconName)}</div>
        <span class="hourly-temp">${temp}°</span>
      </div>
    `;
  });

  el.hourlyForecast.innerHTML = html;
}

// Render Daily Forecast
function renderDailyForecast(daily) {
  if (!daily || !daily.time) return;

  const daysOfWeek = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];
  
  let html = '';
  daily.time.forEach((dateStr, idx) => {
    const dateObj = new Date(dateStr);
    const dayName = idx === 0 ? 'Σήμερα' : daysOfWeek[dateObj.getDay()];
    const maxTemp = formatTemp(daily.temperature_2m_max[idx]);
    const minTemp = formatTemp(daily.temperature_2m_min[idx]);
    const code = daily.weather_code[idx];
    const codeInfo = WEATHER_CODES[code] || { desc: 'Αίθριος', icon: 'clear-day' };

    html += `
      <div class="daily-item">
        <span class="daily-day ${idx === 0 ? 'today' : ''}">${dayName}</span>
        <div class="daily-condition">
          <div class="daily-icon">${getSvgIcon(codeInfo.icon)}</div>
          <span class="daily-desc">${codeInfo.desc}</span>
        </div>
        <div class="daily-temps">
          <span class="daily-max">${maxTemp}°</span>
          <span class="daily-min">${minTemp}°</span>
        </div>
      </div>
    `;
  });

  el.dailyForecast.innerHTML = html;
}

// Main load function
async function loadCityWeather(cityName) {
  try {
    el.refreshBtn.classList.add('spinning');
    showStatus(`Αναζήτηση δεδομένων για "${cityName}"...`, 'loading');

    const geoResult = await geocodeCity(cityName);
    state.city = geoResult.name;
    state.country = geoResult.country_code || '';
    state.lat = geoResult.latitude;
    state.lon = geoResult.longitude;

    const weatherData = await fetchWeatherData(state.lat, state.lon);
    state.weatherData = weatherData;

    renderWeather();
    hideStatus();
  } catch (err) {
    console.error('Weather load error:', err);
    showStatus(err.message || 'Παρουσιάστηκε σφάλμα κατά τη φόρτωση του καιρού.', 'error');
  } finally {
    el.refreshBtn.classList.remove('spinning');
  }
}

// Quick refresh of current city
async function refreshCurrentWeather() {
  try {
    el.refreshBtn.classList.add('spinning');
    showStatus(`Ενημέρωση καιρού για ${state.city}...`, 'loading');
    
    const weatherData = await fetchWeatherData(state.lat, state.lon);
    state.weatherData = weatherData;
    
    renderWeather();
    hideStatus();
  } catch (err) {
    console.error('Refresh error:', err);
    showStatus('Αποτυχία ανανέωσης καιρού.', 'error');
  } finally {
    el.refreshBtn.classList.remove('spinning');
  }
}

// Setup Event Listeners
function setupEvents() {
  // Search Form Submit
  el.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = el.cityInput.value.trim();
    if (city) {
      loadCityWeather(city);
      el.cityInput.blur();
    }
  });

  // Quick City Chips
  el.quickCities.addEventListener('click', (e) => {
    const chip = e.target.closest('.city-chip');
    if (chip && chip.dataset.city) {
      el.cityInput.value = chip.dataset.city;
      loadCityWeather(chip.dataset.city);
    }
  });

  // Refresh Button
  el.refreshBtn.addEventListener('click', () => {
    refreshCurrentWeather();
  });

  // Temperature Unit Toggles
  el.unitC.addEventListener('click', () => {
    if (state.unit !== 'c') {
      state.unit = 'c';
      el.unitC.classList.add('active');
      el.unitF.classList.remove('active');
      renderWeather();
    }
  });

  el.unitF.addEventListener('click', () => {
    if (state.unit !== 'f') {
      state.unit = 'f';
      el.unitF.classList.add('active');
      el.unitC.classList.remove('active');
      renderWeather();
    }
  });

  // Auto-refresh every 5 minutes (300,000 ms)
  state.autoRefreshInterval = setInterval(() => {
    refreshCurrentWeather();
  }, 5 * 60 * 1000);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  startClock();
  setupEvents();
  loadCityWeather('Αθήνα');
});
