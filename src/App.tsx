import { useEffect, useState } from 'react';

import {
  Activity,
  Bell,
  ChevronRight,
  CloudSun,
  Droplets,
  LayoutDashboard,
  Map,
  Menu,
  MessageSquare,
  ShieldAlert,
  Thermometer,
  TreePine,
  Users,
  Wind,
  X,
  Zap,
} from 'lucide-react';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import './App.css';

type Page =
  | 'Overview'
  | 'Heat Map'
  | 'Forecast'
  | 'Risk Analysis'
  | 'AI Cooling Plan'
  | 'Digital Twin'
  | 'Alerts';

/* =========================================================
   MOCK DATA
========================================================= */

const forecast = [
  {
    day: "Today",
    date: "23 Aug",
    temp: 39,
    feels: 43,
    humidity: 61,
    wind: 12,
    radiation: 7.2,
    wbgt: 28.4,
    utci: 34.8,
    risk: "High",
  },
  {
    day: "Mon",
    date: "24 Aug",
    temp: 41,
    feels: 46,
    humidity: 65,
    wind: 10,
    radiation: 7.8,
    wbgt: 30.1,
    utci: 37.2,
    risk: "High",
  },
  {
    day: "Tue",
    date: "25 Aug",
    temp: 43,
    feels: 49,
    humidity: 69,
    wind: 8,
    radiation: 8.1,
    wbgt: 32.0,
    utci: 40.1,
    risk: "Very High",
  },
  {
    day: "Wed",
    date: "26 Aug",
    temp: 44,
    feels: 51,
    humidity: 72,
    wind: 7,
    radiation: 8.5,
    wbgt: 33.2,
    utci: 42.4,
    risk: "Extreme",
  },
  {
    day: "Thu",
    date: "27 Aug",
    temp: 42,
    feels: 48,
    humidity: 68,
    wind: 9,
    radiation: 7.9,
    wbgt: 31.4,
    utci: 39.0,
    risk: "Very High",
  },
];

const wards = [
  {
    ward: 12,
    temperature: 44,
    population: '18.4K',
    risk: 'Extreme',
  },
  {
    ward: 19,
    temperature: 43,
    population: '21.2K',
    risk: 'Very High',
  },
  {
    ward: 25,
    temperature: 42,
    population: '15.8K',
    risk: 'High',
  },
  {
    ward: 35,
    temperature: 41,
    population: '17.3K',
    risk: 'High',
  },
  {
    ward: 31,
    temperature: 40,
    population: '12.6K',
    risk: 'Moderate',
  },
];

const heatZones = [
  {
    ward: 12,
    lat: 20.2961,
    lng: 85.8245,
    temperature: 44,
    risk: 'Extreme',
    wbgt: 32.8,
    population: '18.4K',
  },
  {
    ward: 19,
    lat: 20.302,
    lng: 85.835,
    temperature: 43,
    risk: 'Very High',
    wbgt: 31.6,
    population: '21.2K',
  },
  {
    ward: 25,
    lat: 20.288,
    lng: 85.81,
    temperature: 42,
    risk: 'High',
    wbgt: 30.4,
    population: '15.8K',
  },
  {
    ward: 35,
    lat: 20.31,
    lng: 85.805,
    temperature: 41,
    risk: 'High',
    wbgt: 29.7,
    population: '17.3K',
  },
  {
    ward: 31,
    lat: 20.278,
    lng: 85.83,
    temperature: 40,
    risk: 'Moderate',
    wbgt: 28.3,
    population: '12.6K',
  },
];

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState<Page>('Overview');

  const navigate = (page: Page) => {
    setActivePage(page);

    // Mobile par page select karne ke baad sidebar close
    if (window.innerWidth <= 850) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app-shell">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-logo">
            <Thermometer size={21} />
          </div>

          <div>
            <h1>ThermoShield</h1>
            <span>Urban Heat Intelligence</span>
          </div>

          <button
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="menu-title">MONITORING</div>

        <nav>
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Overview"
            active={activePage === 'Overview'}
            onClick={() => navigate('Overview')}
          />

          <NavItem
            icon={<Map size={18} />}
            label="Heat Map"
            active={activePage === 'Heat Map'}
            onClick={() => navigate('Heat Map')}
          />

          <NavItem
            icon={<CloudSun size={18} />}
            label="Forecast"
            active={activePage === 'Forecast'}
            onClick={() => navigate('Forecast')}
          />

          <NavItem
            icon={<ShieldAlert size={18} />}
            label="Risk Analysis"
            active={activePage === 'Risk Analysis'}
            onClick={() => navigate('Risk Analysis')}
          />
        </nav>

        <div className="menu-title">ACTION CENTER</div>

        <nav>
          <NavItem
            icon={<Zap size={18} />}
            label="AI Cooling Plan"
            active={activePage === 'AI Cooling Plan'}
            onClick={() => navigate('AI Cooling Plan')}
          />

          <NavItem
            icon={<Activity size={18} />}
            label="Digital Twin"
            active={activePage === 'Digital Twin'}
            onClick={() => navigate('Digital Twin')}
          />

          <NavItem
            icon={<Bell size={18} />}
            label="Alerts"
            active={activePage === 'Alerts'}
            onClick={() => navigate('Alerts')}
            badge="7"
          />
        </nav>

        <div className="sidebar-bottom">
          <div className="city-box">
            <small>MONITORED CITY</small>

            <strong>Bhubaneswar</strong>

            <span>Odisha, India</span>
          </div>

          <div className="system-status">
            <i />
            System operational
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className={sidebarOpen ? 'main shifted' : 'main'}>
        {/* TOP BAR */}

        <header className="topbar">
          <div className="top-left">
            {!sidebarOpen && (
              <button
                className="menu-button"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
            )}

            <div>
              <small>Bhubaneswar / ThermoShield</small>

              <h2>{activePage}</h2>
            </div>
          </div>

          <div className="top-right">
            <div className="heat-status">
              <span />
              Extreme heat risk
            </div>

            <button className="notification">
              <Bell size={19} />

              <i />
            </button>

            <div className="user">
              <div>AT</div>

              <section>
                <strong>Admin</strong>

                <span>Municipality</span>
              </section>
            </div>
          </div>
        </header>

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <div className="content">
          {activePage === "Overview" ? (
            <Dashboard />
          ) : activePage === "Heat Map" ? (
            <HeatMapPage />
          ) : activePage === "Forecast" ? (
            <ForecastPage />
          ) : (
            <Placeholder page={activePage} />
          )}
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   OVERVIEW DASHBOARD
========================================================= */

function Dashboard() {
  return (
    <div className="dashboard">
      {/* HERO */}

      <section className="hero">
        <div>
          <div className="eyebrow">
            <span />
            AI-POWERED URBAN HEAT INTELLIGENCE
          </div>

          <h1>
            Understand the heat.
            <br />
            <em>Protect the city.</em>
          </h1>

          <p>
            ThermoShield combines weather, satellite and demographic data to
            predict human thermal risk and help authorities take action before
            extreme heat impacts communities.
          </p>
        </div>

        <button className="primary-button">
          <Zap size={17} />
          Generate AI Cooling Plan
          <ChevronRight size={17} />
        </button>
      </section>

      {/* STATS */}

      <section className="stats">
        <Stat
          icon={<Thermometer />}
          title="Current Temperature"
          value="42°C"
          description="Bhubaneswar average"
          label="HIGH"
        />

        <Stat
          icon={<ShieldAlert />}
          title="Human Thermal Stress"
          value="84 / 100"
          description="WBGT / UTCI based risk"
          label="VERY HIGH"
          danger
        />

        <Stat
          icon={<Users />}
          title="Population at Risk"
          value="72.4K"
          description="Across 8 high-risk wards"
          label="EXPOSED"
        />

        <Stat
          icon={<Bell />}
          title="Active Alerts"
          value="07"
          description="3 extreme · 4 high"
          label="ACTIVE"
          danger
        />
      </section>

      {/* TWO COLUMN */}

      <section className="two-column">
        {/* FORECAST */}

        <div className="panel">
          <PanelHeader
            title="5-Day Heat Forecast"
            subtitle="Temperature and humidity outlook"
            action="View forecast"
          />

          <div className="forecast">
            {forecast.map((item, index) => (
              <div
                className={`forecast-card ${index === 3 ? 'forecast-highlight' : ''
                  }`}
                key={item.day}
              >
                <span>{item.day}</span>

                <CloudSun size={25} />

                <strong>{item.temp}°</strong>

                <small>
                  <Droplets size={12} />
                  {item.humidity}%
                </small>

                <b>{item.risk}</b>
              </div>
            ))}
          </div>

          <div className="forecast-message">
            <CloudSun size={18} />

            <div>
              <strong>Peak heat expected Wednesday</strong>

              <p>
                Temperature may reach 44°C with high humidity, increasing human
                thermal stress.
              </p>
            </div>
          </div>
        </div>

        {/* RISK */}

        <div className="panel">
          <PanelHeader
            title="Human Thermal Risk"
            subtitle="Current city-wide assessment"
          />

          <div className="risk-section">
            <div className="risk-circle">
              <strong>84</strong>

              <span>/100</span>
            </div>

            <div className="risk-text">
              <label>VERY HIGH RISK</label>

              <h3>Extreme thermal stress</h3>

              <p>
                Temperature, humidity, wind speed and solar radiation are
                creating dangerous thermal conditions.
              </p>
            </div>
          </div>

          <div className="risk-factors">
            <RiskFactor
              icon={<Thermometer size={15} />}
              name="Temperature"
              value="42°C"
              progress={88}
            />

            <RiskFactor
              icon={<Droplets size={15} />}
              name="Humidity"
              value="71%"
              progress={71}
            />

            <RiskFactor
              icon={<Wind size={15} />}
              name="Wind Speed"
              value="Low"
              progress={76}
            />
          </div>
        </div>
      </section>

      {/* WARDS */}

      <section className="panel ward-panel">
        <PanelHeader
          title="Highest-Risk Wards"
          subtitle="Locations requiring immediate attention"
          action="Open heat map"
        />

        <div className="ward-header">
          <span>WARD</span>

          <span>TEMPERATURE</span>

          <span>POPULATION AT RISK</span>

          <span>RISK LEVEL</span>

          <span />
        </div>

        {wards.map((ward) => (
          <div className="ward-row" key={ward.ward}>
            <strong>Ward {ward.ward}</strong>

            <b>{ward.temperature}°C</b>

            <span>{ward.population}</span>

            <RiskBadge risk={ward.risk} />

            <button>
              Analyze
              <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </section>

      {/* AI COOLING */}

      <section className="cooling">
        <div className="cooling-left">
          <div className="ai-logo">
            <Zap size={22} />
          </div>

          <div>
            <small>THERMOSHIELD AI COOLING ENGINE</small>

            <h2>
              Give us the budget.
              <br />
              AI plans the cooling.
            </h2>

            <p>
              Enter the available budget and ThermoShield automatically
              determines where to intervene, what intervention to use and how
              much to spend for maximum heat reduction.
            </p>
          </div>
        </div>

        <div className="cooling-right">
          <small>EXAMPLE AVAILABLE BUDGET</small>

          <strong>₹50 Cr</strong>

          <button>
            Open AI Planner
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* INSIGHTS */}

      <section className="insights">
        <Insight
          icon={<TreePine />}
          title="Low Vegetation"
          description="12 wards have critically low vegetation coverage."
          action="View areas"
        />

        <Insight
          icon={<MessageSquare />}
          title="Automated Alerts"
          description="SMS and WhatsApp heat advisories are active."
          action="View alerts"
        />

        <Insight
          icon={<Activity />}
          title="Digital Twin"
          description="Simulate cooling interventions before deployment."
          action="Run simulation"
        />
      </section>
    </div>
  );
}

/* =========================================================
   HEAT MAP PAGE
========================================================= */

function HeatMapPage() {
  const getRiskColor = (risk: string) => {
    if (risk === 'Extreme') {
      return '#d94d4d';
    }

    if (risk === 'Very High') {
      return '#dc7c3d';
    }

    if (risk === 'High') {
      return '#c5a33e';
    }

    return '#5d8aa0';
  };

  return (
    <div className="heat-map-page">
      {/* HEADER */}

      <div className="module-header">
        <div>
          <div className="eyebrow">
            <span />
            HYPERLOCAL HEAT INTELLIGENCE
          </div>

          <h1>Urban Heat Map</h1>

          <p>
            Explore temperature and human thermal stress across Bhubaneswar at
            ward level.
          </p>
        </div>

        <div className="map-date">
          <span>DATA UPDATED</span>

          <strong>23 Aug 2026 · 18:30</strong>
        </div>
      </div>

      {/* TOOLBAR */}

      <div className="map-toolbar">
        <div className="layer-buttons">
          <button className="layer-active">Thermal Risk</button>

          <button>Temperature</button>

          <button>WBGT</button>

          <button>Population</button>
        </div>

        <div className="map-info">
          <span className="live-dot-map" />
          Live monitoring
        </div>
      </div>

      {/* MAP */}

      <div className="map-layout">
        <div className="map-container">
          <MapContainer
            center={[20.2961, 85.8245]}
            zoom={12}
            scrollWheelZoom={true}
            className="leaflet-map"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {heatZones.map((zone) => (
              <CircleMarker
                key={zone.ward}
                center={[zone.lat, zone.lng]}
                radius={28}
                pathOptions={{
                  color: getRiskColor(zone.risk),
                  fillColor: getRiskColor(zone.risk),
                  fillOpacity: 0.35,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="map-popup">
                    <strong>Ward {zone.ward}</strong>

                    <div className="popup-risk">{zone.risk} Risk</div>

                    <div className="popup-row">
                      <span>Temperature</span>

                      <b>{zone.temperature}°C</b>
                    </div>

                    <div className="popup-row">
                      <span>WBGT</span>

                      <b>{zone.wbgt}</b>
                    </div>

                    <div className="popup-row">
                      <span>Population at risk</span>

                      <b>{zone.population}</b>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          {/* LEGEND */}

          <div className="map-legend">
            <strong>THERMAL RISK</strong>

            <div>
              <i className="legend-extreme" />
              Extreme
            </div>

            <div>
              <i className="legend-very-high" />
              Very High
            </div>

            <div>
              <i className="legend-high" />
              High
            </div>

            <div>
              <i className="legend-moderate" />
              Moderate
            </div>
          </div>
        </div>

        {/* SIDE PANEL */}

        <div className="map-side-panel">
          <div className="side-title">
            <div>
              <h2>Risk Hotspots</h2>

              <p>Highest thermal stress zones</p>
            </div>

            <span>5 zones</span>
          </div>

          <div className="hotspot-list">
            {heatZones.map((zone, index) => (
              <div className="hotspot" key={zone.ward}>
                <div className="hotspot-rank">0{index + 1}</div>

                <div className="hotspot-main">
                  <strong>Ward {zone.ward}</strong>

                  <div>
                    <span>{zone.temperature}°C</span>

                    <small>WBGT {zone.wbgt}</small>
                  </div>
                </div>

                <RiskBadge risk={zone.risk} />
              </div>
            ))}
          </div>

          {/* SUMMARY */}

          <div className="map-summary">
            <div>
              <span>HIGHEST TEMP</span>

              <strong>44°C</strong>
            </div>

            <div>
              <span>AVG WBGT</span>

              <strong>30.6</strong>
            </div>

            <div>
              <span>AT RISK</span>

              <strong>85.3K</strong>
            </div>
          </div>

          <button className="cooling-map-button">
            <Zap size={16} />
            Generate Cooling Plan
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ANALYSIS */}

      <div className="map-analysis">
        <div className="analysis-card">
          <div className="analysis-icon">
            <Thermometer size={18} />
          </div>

          <div>
            <span>THERMAL HOTSPOT</span>

            <strong>Ward 12</strong>

            <p>44°C · Extreme thermal stress</p>
          </div>
        </div>

        <div className="analysis-card">
          <div className="analysis-icon">
            <Users size={18} />
          </div>

          <div>
            <span>VULNERABLE POPULATION</span>

            <strong>85.3K people</strong>

            <p>Located across identified high-risk wards</p>
          </div>
        </div>

        <div className="analysis-card">
          <div className="analysis-icon">
            <TreePine size={18} />
          </div>

          <div>
            <span>COOLING OPPORTUNITY</span>

            <strong>12 wards</strong>

            <p>Potential areas for intervention</p>
          </div>
        </div>
      </div>
    </div>
  );
}
function ForecastPage() {
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState(3);

  useEffect(() => {
    fetch("http://localhost:5000/api/forecast")
      .then((response) => response.json())
      .then((data) => {
        setForecastData(data);
      })
      .catch((error) => {
        console.error("Error fetching forecast:", error);
      });
  }, []);

  const selected = forecastData[selectedDay];
  return (
    <div className="forecast-page">

      {/* HEADER */}

      <div className="module-header">

        <div>

          <div className="eyebrow">
            <span />
            AI HEAT FORECAST
          </div>

          <h1>
            5-Day Heat Forecast
          </h1>

          <p>
            Predicting what the heat will do to people,
            not just what the temperature will be.
          </p>

        </div>

        <div className="forecast-confidence">

          <span>
            FORECAST CONFIDENCE
          </span>

          <strong>
            91%
          </strong>

          <small>
            Updated 18:30
          </small>

        </div>

      </div>

      {/* FORECAST CARDS */}

      <div className="forecast-days">

        {forecast.map((item, index) => (

          <button
            key={item.day}
            className={
              selectedDay === index
                ? "forecast-day active"
                : "forecast-day"
            }
            onClick={() => setSelectedDay(index)}
          >

            <span>
              {item.day}
            </span>

            <small>
              {item.date}
            </small>

            <CloudSun size={26} />

            <strong>
              {item.temp}°C
            </strong>

            <em>
              Feels {item.feels}°
            </em>

            <RiskBadge risk={item.risk} />

          </button>

        ))}

      </div>

      {/* MAIN FORECAST */}

      <div className="forecast-main-grid">

        {/* LEFT */}

        <div className="panel forecast-detail">

          <PanelHeader
            title={`${selected.day}, ${selected.date}`}
            subtitle="Environmental conditions"
          />

          <div className="weather-metrics">

            <div className="weather-metric">

              <Thermometer size={19} />

              <span>
                TEMPERATURE
              </span>

              <strong>
                {selected.temp}°C
              </strong>

              <small>
                Feels like {selected.feels}°C
              </small>

            </div>

            <div className="weather-metric">

              <Droplets size={19} />

              <span>
                HUMIDITY
              </span>

              <strong>
                {selected.humidity}%
              </strong>

              <small>
                Relative humidity
              </small>

            </div>

            <div className="weather-metric">

              <Wind size={19} />

              <span>
                WIND SPEED
              </span>

              <strong>
                {selected.wind} km/h
              </strong>

              <small>
                Average wind
              </small>

            </div>

            <div className="weather-metric">

              <Zap size={19} />

              <span>
                SOLAR RADIATION
              </span>

              <strong>
                {selected.radiation} kWh/m²
              </strong>

              <small>
                Estimated daily exposure
              </small>

            </div>

          </div>

          {/* THERMAL INDICES */}

          <div className="thermal-index-title">

            <div>

              <h3>
                Human Thermal Stress
              </h3>

              <p>
                Advanced heat indices used by ThermoShield
              </p>

            </div>

            <RiskBadge risk={selected.risk} />

          </div>

          <div className="thermal-index-grid">

            <div className="index-card">

              <span>
                WBGT
              </span>

              <strong>
                {selected.wbgt}°C
              </strong>

              <small>
                Wet Bulb Globe Temperature
              </small>

              <div className="index-bar">
                <i
                  style={{
                    width: `${Math.min(
                      selected.wbgt * 2.7,
                      100
                    )}%`,
                  }}
                />
              </div>

            </div>

            <div className="index-card">

              <span>
                UTCI
              </span>

              <strong>
                {selected.utci}°C
              </strong>

              <small>
                Universal Thermal Climate Index
              </small>

              <div className="index-bar">
                <i
                  style={{
                    width: `${Math.min(
                      selected.utci * 2.1,
                      100
                    )}%`,
                  }}
                />
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="panel peak-panel">

          <div className="peak-label">
            PEAK HEAT DAY
          </div>

          <div className="peak-icon">
            <Thermometer size={25} />
          </div>

          <h2>
            Wednesday
          </h2>

          <strong className="peak-temperature">
            44°C
          </strong>

          <p>
            Expected to be the most dangerous heat
            period during the next 5 days.
          </p>

          <div className="peak-risk">

            <span>
              HUMAN THERMAL RISK
            </span>

            <b>
              EXTREME
            </b>

          </div>

          <div className="peak-recommendation">

            <Zap size={16} />

            <span>
              Cooling interventions should be
              prioritized before Wednesday.
            </span>

          </div>

        </div>

      </div>

      {/* AI INTERPRETATION */}

      <div className="forecast-ai">

        <div className="forecast-ai-icon">
          <Activity size={21} />
        </div>

        <div>

          <span>
            THERMOSHIELD AI INTERPRETATION
          </span>

          <h2>
            Heat risk is expected to increase
            sharply by Wednesday.
          </h2>

          <p>
            High temperature combined with increasing
            humidity and low wind speed may create
            dangerous thermal stress. Vulnerable
            populations and outdoor workers should be
            prioritized for preventive action.
          </p>

        </div>

        <button>
          View Risk Analysis
          <ChevronRight size={15} />
        </button>

      </div>

      {/* 5 DAY TABLE */}

      <div className="panel forecast-table-panel">

        <PanelHeader
          title="Forecast Summary"
          subtitle="Environmental and human thermal indicators"
        />

        <div className="forecast-table">

          <div className="forecast-table-head">

            <span>DAY</span>
            <span>TEMP</span>
            <span>HUMIDITY</span>
            <span>WIND</span>
            <span>WBGT</span>
            <span>UTCI</span>
            <span>RISK</span>

          </div>

          {forecast.map((item) => (

            <div
              className="forecast-table-row"
              key={item.day}
            >

              <strong>
                {item.day}
              </strong>

              <span>
                {item.temp}°C
              </span>

              <span>
                {item.humidity}%
              </span>

              <span>
                {item.wind} km/h
              </span>

              <span>
                {item.wbgt}°C
              </span>

              <span>
                {item.utci}°C
              </span>

              <RiskBadge risk={item.risk} />

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}
/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function NavItem({
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      {icon}

      <span>{label}</span>

      {badge && <b>{badge}</b>}
    </button>
  );
}

function Stat({
  icon,
  title,
  value,
  description,
  label,
  danger,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  label: string;
  danger?: boolean;
}) {
  return (
    <div className="stat">
      <div className="stat-top">
        <div className={danger ? 'stat-icon danger' : 'stat-icon'}>{icon}</div>

        <span className={danger ? 'danger-label' : ''}>{label}</span>
      </div>

      <p>{title}</p>

      <strong>{value}</strong>

      <small>{description}</small>
    </div>
  );
}

function PanelHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: string;
}) {
  return (
    <div className="panel-header">
      <div>
        <h2>{title}</h2>

        <p>{subtitle}</p>
      </div>

      {action && (
        <button className="panel-action">
          {action}

          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

function RiskFactor({
  icon,
  name,
  value,
  progress,
}: {
  icon: React.ReactNode;
  name: string;
  value: string;
  progress: number;
}) {
  return (
    <div className="factor">
      <div>
        <span>
          {icon}

          {name}
        </span>

        <strong>{value}</strong>
      </div>

      <div className="progress">
        <i
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const className = risk.toLowerCase().replace(' ', '-');

  return <span className={`risk-badge ${className}`}>{risk}</span>;
}

function Insight({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
}) {
  return (
    <div className="insight">
      <div className="insight-icon">{icon}</div>

      <div>
        <h3>{title}</h3>

        <p>{description}</p>

        <button>
          {action}

          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   OTHER MODULE PLACEHOLDER
========================================================= */

function Placeholder({ page }: { page: Page }) {
  return (
    <div className="placeholder">
      <div>
        <Zap size={28} />
      </div>

      <small>THERMOSHIELD MODULE</small>

      <h1>{page}</h1>

      <p>
        This module will be connected to the ThermoShield AI backend and live
        data pipeline.
      </p>
    </div>
  );
}

export default App;
