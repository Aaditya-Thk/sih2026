import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  ChevronRight,
  CloudSun,
  Droplets,
  LayoutDashboard,
  Map as MapIcon,
  Menu,
  MessageSquare,
  ShieldAlert,
  Thermometer,
  TreePine,
  Users,
  Wind,
  X,
  Zap,
  Smartphone,
  Building2,
  CircleAlert,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./App.css";

type Page =
  | "Overview"
  | "Heat Map"
  | "Forecast"
  | "Risk Analysis"
  | "AI Cooling Plan"
  | "Digital Twin"
  | "Alerts";

type Risk = "Extreme" | "Very High" | "High" | "Moderate";

type Ward = {
  ward: number;
  lat: number;
  lng: number;
  temperature: number;
  humidity: number;
  wind: number;
  radiation: number;
  wbgt: number;
  utci: number;
  population: number;
  risk: Risk;
};

/*
=========================================================
WARD DATA
=========================================================
This is still used by Heat Map and Risk Analysis.
Later we can move this completely to the backend.
*/

const wards: Ward[] = [
  {
    ward: 12,
    lat: 20.2961,
    lng: 85.8245,
    temperature: 44,
    humidity: 72,
    wind: 7,
    radiation: 8.5,
    wbgt: 32.8,
    utci: 42.4,
    population: 18400,
    risk: "Extreme",
  },
  {
    ward: 19,
    lat: 20.302,
    lng: 85.835,
    temperature: 43,
    humidity: 69,
    wind: 8,
    radiation: 8.1,
    wbgt: 31.6,
    utci: 40.8,
    population: 21200,
    risk: "Very High",
  },
  {
    ward: 25,
    lat: 20.288,
    lng: 85.81,
    temperature: 42,
    humidity: 65,
    wind: 10,
    radiation: 7.8,
    wbgt: 30.4,
    utci: 38.9,
    population: 15800,
    risk: "High",
  },
  {
    ward: 35,
    lat: 20.31,
    lng: 85.805,
    temperature: 41,
    humidity: 61,
    wind: 12,
    radiation: 7.2,
    wbgt: 29.7,
    utci: 36.9,
    population: 17300,
    risk: "High",
  },
  {
    ward: 31,
    lat: 20.278,
    lng: 85.83,
    temperature: 40,
    humidity: 58,
    wind: 14,
    radiation: 6.9,
    wbgt: 28.3,
    utci: 34.8,
    population: 12600,
    risk: "Moderate",
  },
];

/*
=========================================================
FALLBACK FORECAST DATA
=========================================================
Used only as a fallback if the backend is unavailable.
*/

const fallbackForecast = [
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
    risk: "High" as Risk,
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
    risk: "High" as Risk,
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
    risk: "Very High" as Risk,
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
    risk: "Extreme" as Risk,
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
    risk: "Very High" as Risk,
  },
];

const riskRank: Record<Risk, number> = {
  Extreme: 4,
  "Very High": 3,
  High: 2,
  Moderate: 1,
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState<Page>("Overview");

  const navigate = (page: Page) => {
    setActivePage(page);

    if (window.innerWidth <= 850) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app-shell">
      {/* SIDEBAR */}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
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
            active={activePage === "Overview"}
            onClick={() => navigate("Overview")}
          />

          <NavItem
            icon={<MapIcon size={18} />}
            label="Heat Map"
            active={activePage === "Heat Map"}
            onClick={() => navigate("Heat Map")}
          />

          <NavItem
            icon={<CloudSun size={18} />}
            label="Forecast"
            active={activePage === "Forecast"}
            onClick={() => navigate("Forecast")}
          />

          <NavItem
            icon={<ShieldAlert size={18} />}
            label="Risk Analysis"
            active={activePage === "Risk Analysis"}
            onClick={() => navigate("Risk Analysis")}
          />
        </nav>

        <div className="menu-title">ACTION CENTER</div>

        <nav>
          <NavItem
            icon={<Zap size={18} />}
            label="AI Cooling Plan"
            active={activePage === "AI Cooling Plan"}
            onClick={() => navigate("AI Cooling Plan")}
          />

          <NavItem
            icon={<Activity size={18} />}
            label="Digital Twin"
            active={activePage === "Digital Twin"}
            onClick={() => navigate("Digital Twin")}
          />

          <NavItem
            icon={<Bell size={18} />}
            label="Alerts"
            active={activePage === "Alerts"}
            onClick={() => navigate("Alerts")}
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

      {/* MAIN */}

      <main className={sidebarOpen ? "main shifted" : "main"}>
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

        <div className="content">
          {activePage === "Overview" && (
            <Dashboard navigate={navigate} />
          )}

          {activePage === "Heat Map" && (
            <HeatMapPage navigate={navigate} />
          )}

          {activePage === "Forecast" && (
            <ForecastPage navigate={navigate} />
          )}

          {activePage === "Risk Analysis" && (
            <RiskAnalysisPage navigate={navigate} />
          )}

          {activePage === "AI Cooling Plan" && (
            <CoolingPlanPage navigate={navigate} />
          )}

          {activePage === "Digital Twin" && (
            <DigitalTwinPage navigate={navigate} />
          )}

          {activePage === "Alerts" && <AlertsPage />}
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  navigate,
}: {
  navigate: (page: Page) => void;
}) {
  const [wardsData, setWardsData] = useState<Ward[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/wards")
      .then((response) => response.json())
      .then((data) => {
        setWardsData(data);
      })
      .catch((error) => {
        console.error("Error fetching wards:", error);

        // fallback so the page still works
        setWardsData(wards);
      });
  }, []);

  const displayWards =
    wardsData.length > 0 ? wardsData : wards;

  return (
    <div className="dashboard">
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
            ThermoShield combines weather, satellite and demographic
            data to predict human thermal risk and help authorities
            act before extreme heat impacts communities.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("AI Cooling Plan")}
        >
          <Zap size={17} />
          Generate AI Cooling Plan
          <ChevronRight size={17} />
        </button>
      </section>

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
          description="Across high-risk wards"
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

      <section className="two-column">
        <div className="panel">
          <PanelHeader
            title="5-Day Heat Forecast"
            subtitle="Temperature and humidity outlook"
            action="View forecast"
          />

          <div className="forecast">
            {fallbackForecast.map((item, i) => (
              <div
                className={`forecast-card ${i === 3 ? "forecast-highlight" : ""
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
                Temperature may reach 44°C with high humidity,
                increasing human thermal stress.
              </p>
            </div>
          </div>
        </div>

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
                Temperature, humidity, wind speed and solar
                radiation are creating dangerous thermal conditions.
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

      <section className="panel ward-panel">
        <PanelHeader
          title="Highest-Risk Wards"
          subtitle="Locations requiring immediate attention"
          action="Open risk analysis"
        />

        <div className="ward-header">
          <span>WARD</span>
          <span>TEMPERATURE</span>
          <span>POPULATION AT RISK</span>
          <span>RISK LEVEL</span>
          <span />
        </div>

        {displayWards.map((w) => (
          <div className="ward-row" key={w.ward}>
            <strong>Ward {w.ward}</strong>

            <b>{w.temperature}°C</b>

            <span>{formatK(w.population)}</span>

            <RiskBadge risk={w.risk} />

            <button onClick={() => navigate("Risk Analysis")}>
              Analyze
              <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </section>

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
              Enter the available budget and the system determines
              where to intervene, which intervention to use and
              how much to spend for maximum heat reduction.
            </p>
          </div>
        </div>

        <div className="cooling-right">
          <small>EXAMPLE AVAILABLE BUDGET</small>

          <strong>₹50 Cr</strong>

          <button onClick={() => navigate("AI Cooling Plan")}>
            Open AI Planner
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      <section className="insights">
        <Insight
          icon={<TreePine />}
          title="Low Vegetation"
          description="12 wards have critically low vegetation coverage."
          action="View areas"
          onClick={() => navigate("AI Cooling Plan")}
        />

        <Insight
          icon={<MessageSquare />}
          title="Automated Alerts"
          description="SMS and WhatsApp heat advisories are active."
          action="View alerts"
          onClick={() => navigate("Alerts")}
        />

        <Insight
          icon={<Activity />}
          title="Digital Twin"
          description="Simulate cooling interventions before deployment."
          action="Run simulation"
          onClick={() => navigate("Digital Twin")}
        />
      </section>
    </div>
  );
}

/* =========================================================
   HEAT MAP
========================================================= */

function HeatMapPage({
  navigate,
}: {
  navigate: (page: Page) => void;
}) {
  type Layer =
    | "risk"
    | "temperature"
    | "wbgt"
    | "population";

  const [layer, setLayer] = useState<Layer>("risk");

  const [wardsData, setWardsData] = useState<Ward[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/wards")
      .then((response) => response.json())
      .then((data) => {
        setWardsData(data);
      })
      .catch((error) => {
        console.error("Error fetching wards:", error);
      });
  }, []);
  const sorted = useMemo(() => {
    return [...wardsData].sort((a, b) => {
      if (layer === "temperature") {
        return b.temperature - a.temperature;
      }

      if (layer === "wbgt") {
        return b.wbgt - a.wbgt;
      }

      if (layer === "population") {
        return b.population - a.population;
      }

      return riskRank[b.risk] - riskRank[a.risk];
    });
  }, [layer, wardsData]);

  const color = (w: Ward) => {
    if (layer === "temperature") {
      if (w.temperature >= 44) return "#c94141";
      if (w.temperature >= 43) return "#dc6545";
      if (w.temperature >= 42) return "#e09b3f";
      return "#668fa3";
    }

    if (layer === "wbgt") {
      if (w.wbgt >= 32) return "#a94f76";
      if (w.wbgt >= 31) return "#c96061";
      if (w.wbgt >= 30) return "#dc9145";
      return "#5f8ea4";
    }

    if (layer === "population") {
      if (w.population >= 20000) return "#326f82";
      if (w.population >= 18000) return "#47879a";
      if (w.population >= 16000) return "#5b99a7";
      return "#78aeb5";
    }

    if (w.risk === "Extreme") return "#d94d4d";
    if (w.risk === "Very High") return "#e07845";
    if (w.risk === "High") return "#d4a33d";

    return "#6d94a5";
  };

  const value = (w: Ward) => {
    if (layer === "risk") return w.risk;

    if (layer === "temperature") {
      return `${w.temperature}°C`;
    }

    if (layer === "wbgt") {
      return `${w.wbgt}°C`;
    }

    return formatK(w.population);
  };

  return (
    <div className="heat-map-page">
      <ModuleHeader
        eyebrow="HYPERLOCAL HEAT INTELLIGENCE"
        title="Urban Heat Map"
        text="Explore temperature and human thermal stress across Bhubaneswar at ward level."
        right="Updated 18:30"
      />

      <div className="map-toolbar">
        <div className="layer-buttons">
          {(
            [
              ["risk", "Thermal Risk"],
              ["temperature", "Temperature"],
              ["wbgt", "WBGT"],
              ["population", "Population"],
            ] as [Layer, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              className={layer === id ? "layer-active" : ""}
              onClick={() => setLayer(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="map-info">
          <span className="live-dot-map" />
          Live monitoring
        </div>
      </div>

      <div className="map-layout">
        <div className="map-container">
          <MapContainer
            center={[20.2961, 85.8245]}
            zoom={12}
            scrollWheelZoom
            className="leaflet-map"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {wardsData.map((w) => (
              <CircleMarker
                key={`${layer}-${w.ward}`}
                center={[w.lat, w.lng]}
                radius={
                  layer === "population"
                    ? Math.max(24, w.population / 700)
                    : 30
                }
                pathOptions={{
                  color: color(w),
                  fillColor: color(w),
                  fillOpacity: 0.42,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="map-popup">
                    <strong>Ward {w.ward}</strong>

                    <div
                      className="popup-risk"
                      style={{ color: color(w) }}
                    >
                      {value(w)}
                    </div>

                    <div className="popup-row">
                      <span>Temperature</span>
                      <b>{w.temperature}°C</b>
                    </div>

                    <div className="popup-row">
                      <span>WBGT</span>
                      <b>{w.wbgt}°C</b>
                    </div>

                    <div className="popup-row">
                      <span>Population</span>
                      <b>{formatK(w.population)}</b>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div className="map-side-panel">
          <div className="side-title">
            <div>
              <h2>
                {layer === "risk"
                  ? "Risk Hotspots"
                  : layer === "temperature"
                    ? "Hottest Wards"
                    : layer === "wbgt"
                      ? "Highest WBGT Zones"
                      : "Population Exposure"}
              </h2>

              <p>
                Ranked by current{" "}
                {layer === "risk" ? "thermal risk" : layer}
              </p>
            </div>

            <span>5 zones</span>
          </div>

          <div className="hotspot-list">
            {sorted.map((w, i) => (
              <div className="hotspot" key={w.ward}>
                <div className="hotspot-rank">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="hotspot-main">
                  <strong>Ward {w.ward}</strong>

                  <div>
                    <span style={{ color: color(w) }}>
                      {value(w)}
                    </span>

                    <small>WBGT {w.wbgt}</small>
                  </div>
                </div>

                {layer === "risk" && (
                  <RiskBadge risk={w.risk} />
                )}
              </div>
            ))}
          </div>

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

          <button
            className="cooling-map-button"
            onClick={() => navigate("AI Cooling Plan")}
          >
            <Zap size={16} />
            Generate Cooling Plan
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FORECAST
========================================================= */

function ForecastPage({
  navigate,
}: {
  navigate: (page: Page) => void;
}) {
  const [forecastData, setForecastData] = useState<any[]>(
    []
  );

  const [selectedDay, setSelectedDay] = useState(3);

  useEffect(() => {
    fetch("http://localhost:5000/api/forecast")
      .then((response) => response.json())
      .then((data) => {
        setForecastData(data);
      })
      .catch((error) => {
        console.error("Error fetching forecast:", error);

        setForecastData(fallbackForecast);
      });
  }, []);

  const selected = forecastData[selectedDay];

  if (!selected) {
    return <div>Loading forecast...</div>;
  }

  return (
    <div className="forecast-page">
      <ModuleHeader
        eyebrow="AI HEAT FORECAST"
        title="5-Day Heat Forecast"
        text="Predicting what the heat will do to people, not just what the temperature will be."
        right="91% confidence"
      />

      <div className="forecast-days">
        {forecastData.map((item, index) => (
          <button
            key={item.day}
            className={
              selectedDay === index
                ? "forecast-day active"
                : "forecast-day"
            }
            onClick={() => setSelectedDay(index)}
          >
            <span>{item.day}</span>

            <small>{item.date}</small>

            <CloudSun size={26} />

            <strong>{item.temp}°C</strong>

            <em>Feels {item.feels}°</em>

            <RiskBadge risk={item.risk} />
          </button>
        ))}
      </div>

      <div className="forecast-main-grid">
        <div className="panel forecast-detail">
          <PanelHeader
            title={`${selected.day}, ${selected.date}`}
            subtitle="Environmental conditions"
          />

          <div className="weather-metrics">
            <WeatherMetric
              icon={<Thermometer size={19} />}
              name="Temperature"
              value={`${selected.temp}°C`}
              sub={`Feels like ${selected.feels}°C`}
            />

            <WeatherMetric
              icon={<Droplets size={19} />}
              name="Humidity"
              value={`${selected.humidity}%`}
              sub="Relative humidity"
            />

            <WeatherMetric
              icon={<Wind size={19} />}
              name="Wind Speed"
              value={`${selected.wind} km/h`}
              sub="Average wind"
            />

            <WeatherMetric
              icon={<Zap size={19} />}
              name="Solar Radiation"
              value={`${selected.radiation}`}
              sub="kWh/m² daily exposure"
            />
          </div>

          <div className="thermal-index-title">
            <div>
              <h3>Human Thermal Stress</h3>
              <p>
                Advanced heat indices used by ThermoShield
              </p>
            </div>

            <RiskBadge risk={selected.risk} />
          </div>

          <div className="thermal-index-grid">
            <IndexCard
              name="WBGT"
              value={`${selected.wbgt}°C`}
              desc="Wet Bulb Globe Temperature"
              progress={Math.min(
                selected.wbgt * 2.7,
                100
              )}
            />

            <IndexCard
              name="UTCI"
              value={`${selected.utci}°C`}
              desc="Universal Thermal Climate Index"
              progress={Math.min(
                selected.utci * 2.1,
                100
              )}
            />
          </div>
        </div>

        <div className="panel peak-panel">
          <div className="peak-label">PEAK HEAT DAY</div>

          <div className="peak-icon">
            <Thermometer size={25} />
          </div>

          <h2>Wednesday</h2>

          <strong className="peak-temperature">
            44°C
          </strong>

          <p>
            Expected to be the most dangerous heat period
            during the next 5 days.
          </p>

          <div className="peak-risk">
            <span>HUMAN THERMAL RISK</span>
            <b>EXTREME</b>
          </div>

          <div className="peak-recommendation">
            <Zap size={16} />

            <span>
              Cooling interventions should be prioritized
              before Wednesday.
            </span>
          </div>
        </div>
      </div>

      <div className="forecast-ai">
        <div className="forecast-ai-icon">
          <Activity size={21} />
        </div>

        <div>
          <span>THERMOSHIELD AI INTERPRETATION</span>

          <h2>
            Heat risk is expected to increase sharply by
            Wednesday.
          </h2>

          <p>
            High temperature combined with increasing humidity
            and low wind speed may create dangerous thermal
            stress. Vulnerable populations and outdoor workers
            should be prioritized.
          </p>
        </div>

        <button onClick={() => navigate("Risk Analysis")}>
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

          {forecastData.map((item) => (
            <div
              className="forecast-table-row"
              key={item.day}
            >
              <strong>{item.day}</strong>

              <span>{item.temp}°C</span>

              <span>{item.humidity}%</span>

              <span>{item.wind} km/h</span>

              <span>{item.wbgt}°C</span>

              <span>{item.utci}°C</span>

              <RiskBadge risk={item.risk} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   RISK ANALYSIS
========================================================= */

function RiskAnalysisPage({
  navigate,
}: {
  navigate: (page: Page) => void;
}) {
  const [selectedWard, setSelectedWard] = useState(12);
  const [wardsData, setWardsData] = useState<Ward[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/wards")
      .then((response) => response.json())
      .then((data) => {
        setWardsData(data);
      })
      .catch((error) => {
        console.error("Error fetching wards:", error);
      });
  }, []);

  const ward =
    wardsData.find((w) => w.ward === selectedWard) ??
    wardsData[0];

  if (!ward) {
    return <div>Loading risk analysis...</div>;
  }

  const stress = Math.min(
    100,
    Math.round(
      ward.temperature * 1.25 +
      ward.humidity * 0.28 +
      (20 - Math.min(20, ward.wind)) * 0.8 +
      ward.radiation * 1.8
    )
  );

  const mortalityRisk = Math.min(
    100,
    Math.round(
      stress * 0.72 +
      (ward.population / 1000) * 0.25
    )
  );

  return (
    <div className="risk-analysis-page">
      <ModuleHeader
        eyebrow="HUMAN IMPACT ANALYSIS"
        title="Risk Analysis"
        text="Understand why a ward is dangerous and which population groups need priority protection."
        right="Prototype model"
      />

      <div className="risk-selector panel">
        <div>
          <span>SELECT WARD</span>

          <strong>Ward {ward.ward}</strong>

          <small>
            Click a ward to inspect its risk profile.
          </small>
        </div>

        <div className="ward-selector">
          {wardsData.map((w) => (
            <button
              key={w.ward}
              className={
                selectedWard === w.ward
                  ? "selected"
                  : ""
              }
              onClick={() => setSelectedWard(w.ward)}
            >
              Ward {w.ward}
            </button>
          ))}
        </div>
      </div>

      <div className="risk-overview-grid">
        <div className="panel risk-score-card">
          <span>HUMAN THERMAL STRESS</span>

          <strong>{stress}</strong>

          <small>/ 100</small>

          <RiskBadge risk={ward.risk} />

          <p>
            Combined effect of temperature, humidity, wind
            and solar exposure.
          </p>
        </div>

        <div className="panel risk-score-card">
          <span>PROJECTED MORTALITY RISK</span>

          <strong>{mortalityRisk}%</strong>

          <small>relative risk score</small>

          <RiskBadge
            risk={
              mortalityRisk >= 75
                ? "Extreme"
                : mortalityRisk >= 60
                  ? "Very High"
                  : mortalityRisk >= 40
                    ? "High"
                    : "Moderate"
            }
          />

          <p>
            Prototype indicator for prioritising preventive
            action.
          </p>
        </div>

        <div className="panel risk-score-card">
          <span>POPULATION EXPOSED</span>

          <strong>{formatK(ward.population)}</strong>

          <small>people</small>

          <Users size={22} />

          <p>
            Residents within the selected high-risk ward.
          </p>
        </div>
      </div>

      <div className="two-column">
        <div className="panel">
          <PanelHeader
            title="Risk Factors"
            subtitle={`Ward ${ward.ward} environmental profile`}
          />

          <RiskFactor
            icon={<Thermometer size={15} />}
            name="Temperature"
            value={`${ward.temperature}°C`}
            progress={(ward.temperature / 45) * 100}
          />

          <RiskFactor
            icon={<Droplets size={15} />}
            name="Humidity"
            value={`${ward.humidity}%`}
            progress={ward.humidity}
          />

          <RiskFactor
            icon={<Wind size={15} />}
            name="Wind Speed"
            value={`${ward.wind} km/h`}
            progress={Math.max(
              5,
              100 - ward.wind * 5
            )}
          />

          <RiskFactor
            icon={<Zap size={15} />}
            name="Solar Radiation"
            value={`${ward.radiation} kWh/m²`}
            progress={(ward.radiation / 10) * 100}
          />
        </div>

        <div className="panel">
          <PanelHeader
            title="Human Thermal Indices"
            subtitle="Indicators used for heat-health assessment"
          />

          <div className="analysis-metric">
            <span>WBGT</span>
            <strong>{ward.wbgt}°C</strong>
            <small>
              Wet Bulb Globe Temperature
            </small>
          </div>

          <div className="analysis-metric">
            <span>UTCI</span>
            <strong>{ward.utci}°C</strong>
            <small>
              Universal Thermal Climate Index
            </small>
          </div>

          <div className="analysis-metric">
            <span>Heat Index</span>

            <strong>
              {Math.round(
                ward.temperature +
                (ward.humidity - 40) * 0.12
              )}
              °C
            </strong>

            <small>
              Temperature + humidity effect
            </small>
          </div>
        </div>
      </div>

      <div className="panel action-panel">
        <div>
          <span>RECOMMENDED RESPONSE</span>

          <h2>
            Protect Ward {ward.ward} before peak heat.
          </h2>

          <p>
            Prioritise cooling centres, outdoor-worker
            timing changes, hydration messaging and targeted
            SMS/WhatsApp alerts for vulnerable populations.
          </p>
        </div>

        <button
          onClick={() => navigate("AI Cooling Plan")}
        >
          Generate Cooling Plan
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   AI COOLING PLAN
========================================================= */

function CoolingPlanPage({
  navigate,
}: {
  navigate: (page: Page) => void;
}) {
  const [budget, setBudget] = useState(50);

  const total = budget;

  const plan = [
    [
      "Cool roofs",
      Math.round(total * 0.34),
      "High-risk dense residential zones",
    ],
    [
      "Urban trees",
      Math.round(total * 0.26),
      "Low vegetation wards",
    ],
    [
      "Reflective roads",
      Math.round(total * 0.18),
      "High surface-temperature corridors",
    ],
    [
      "Cooling centres",
      Math.round(total * 0.14),
      "High population exposure areas",
    ],
    [
      "Green corridors",
      Math.round(total * 0.08),
      "Heat connectivity zones",
    ],
  ];

  return (
    <div className="cooling-page">
      <ModuleHeader
        eyebrow="AI DECISION SUPPORT"
        title="AI Cooling Plan"
        text="Enter the available budget. The prototype automatically distributes investment toward the highest cooling impact."
        right="Optimization ready"
      />

      <div className="budget-panel panel">
        <div>
          <span>AVAILABLE BUDGET</span>

          <strong>₹{budget} Cr</strong>

          <p>
            Change the budget to see the recommended
            allocation update.
          </p>
        </div>

        <input
          type="range"
          min="5"
          max="100"
          value={budget}
          onChange={(e) =>
            setBudget(Number(e.target.value))
          }
        />

        <div className="budget-labels">
          <span>₹5 Cr</span>
          <span>₹100 Cr</span>
        </div>
      </div>

      <div className="two-column">
        <div className="panel">
          <PanelHeader
            title="Recommended Allocation"
            subtitle="Prototype optimization output"
          />

          {plan.map(([name, cost, area]) => (
            <div className="plan-row" key={name}>
              <div>
                <strong>{name}</strong>
                <small>{area}</small>
              </div>

              <b>₹{cost} Cr</b>
            </div>
          ))}
        </div>

        <div className="panel impact-panel">
          <span>ESTIMATED IMPACT</span>

          <strong>3.8°C</strong>

          <small>potential local cooling</small>

          <div className="impact-stat">
            <Users size={18} />
            <b>118K</b>
            <span>people potentially benefited</span>
          </div>

          <div className="impact-stat">
            <TreePine size={18} />
            <b>12</b>
            <span>priority wards</span>
          </div>

          <button
            onClick={() => navigate("Digital Twin")}
          >
            Test in Digital Twin
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DIGITAL TWIN
========================================================= */

function DigitalTwinPage({
  navigate,
}: {
  navigate: (page: Page) => void;
}) {
  const [cooling, setCooling] = useState(0);

  return (
    <div className="twin-page">
      <ModuleHeader
        eyebrow="SCENARIO SIMULATION"
        title="Digital Twin"
        text="Simulate urban cooling interventions before authorities deploy them."
        right="Simulation mode"
      />

      <div className="panel twin-control">
        <div>
          <span>SIMULATED COOLING INTERVENTION</span>

          <h2>Increase green coverage</h2>

          <p>
            Move the slider to simulate additional vegetation
            in high-risk areas.
          </p>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={cooling}
          onChange={(e) =>
            setCooling(Number(e.target.value))
          }
        />

        <strong>{cooling}%</strong>
      </div>

      <div className="risk-overview-grid">
        <div className="panel impact-box">
          <span>TEMPERATURE CHANGE</span>

          <strong>
            -{(cooling * 0.025).toFixed(1)}°C
          </strong>

          <small>estimated</small>
        </div>

        <div className="panel impact-box">
          <span>WBGT CHANGE</span>

          <strong>
            -{(cooling * 0.018).toFixed(1)}°C
          </strong>

          <small>estimated</small>
        </div>

        <div className="panel impact-box">
          <span>PEOPLE BENEFITED</span>

          <strong>
            {Math.round(cooling * 1.25)}K
          </strong>

          <small>estimated</small>
        </div>
      </div>

      <div className="action-panel panel">
        <div>
          <span>READY TO APPLY?</span>

          <h2>
            Use this scenario in the AI Cooling Plan.
          </h2>

          <p>
            The actual backend can later replace these
            prototype estimates with model-based simulation.
          </p>
        </div>

        <button
          onClick={() => navigate("AI Cooling Plan")}
        >
          Open Cooling Plan
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   ALERTS
========================================================= */

function AlertsPage() {
  const alerts = [
    [
      "Extreme heat warning",
      "Ward 12 · 44°C · WBGT 32.8",
      "SMS + WhatsApp",
      "Extreme",
    ],
    [
      "High thermal stress",
      "Ward 19 · 43°C · WBGT 31.6",
      "Municipality dashboard",
      "Very High",
    ],
    [
      "Outdoor worker advisory",
      "Bhubaneswar · 12:00–16:00",
      "SMS",
      "High",
    ],
    [
      "Cooling centre trigger",
      "5 wards crossed threshold",
      "Municipality",
      "High",
    ],
  ];

  return (
    <div className="alerts-page">
      <ModuleHeader
        eyebrow="PUBLIC HEALTH ALERTING"
        title="Alerts"
        text="Targeted heat advisories for residents, outdoor workers and city authorities."
        right="7 active"
      />

      <div className="alert-summary">
        <div className="panel">
          <Smartphone size={20} />
          <strong>SMS</strong>
          <span>Regional alerts ready</span>
        </div>

        <div className="panel">
          <MessageSquare size={20} />
          <strong>WhatsApp</strong>
          <span>Automated advisory channel</span>
        </div>

        <div className="panel">
          <Building2 size={20} />
          <strong>Authorities</strong>
          <span>Heat action triggers</span>
        </div>
      </div>

      <div className="panel">
        <PanelHeader
          title="Active Alert Queue"
          subtitle="Prototype notification events"
        />

        {alerts.map((a) => (
          <div className="alert-row" key={a[0]}>
            <CircleAlert size={20} />

            <div>
              <strong>{a[0]}</strong>
              <p>{a[1]}</p>
            </div>

            <span>{a[2]}</span>

            <RiskBadge risk={a[3] as Risk} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function ModuleHeader({
  eyebrow,
  title,
  text,
  right,
}: {
  eyebrow: string;
  title: string;
  text: string;
  right: string;
}) {
  return (
    <div className="module-header">
      <div>
        <div className="eyebrow">
          <span />
          {eyebrow}
        </div>

        <h1>{title}</h1>

        <p>{text}</p>
      </div>

      <div className="forecast-confidence">
        <span>STATUS</span>
        <strong>{right}</strong>
      </div>
    </div>
  );
}

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
    <button
      className={`nav-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
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
        <div
          className={`stat-icon ${danger ? "danger" : ""
            }`}
        >
          {icon}
        </div>

        <span
          className={danger ? "danger-label" : ""}
        >
          {label}
        </span>
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
        <span className="panel-action">
          {action}
          <ChevronRight size={14} />
        </span>
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
            width: `${Math.max(
              0,
              Math.min(100, progress)
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

function RiskBadge({ risk }: { risk: Risk }) {
  return (
    <span
      className={`risk-badge ${risk
        .toLowerCase()
        .replace(" ", "-")}`}
    >
      {risk}
    </span>
  );
}

function Insight({
  icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="insight">
      <div className="insight-icon">{icon}</div>

      <div>
        <h3>{title}</h3>

        <p>{description}</p>

        <button onClick={onClick}>
          {action}
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

function WeatherMetric({
  icon,
  name,
  value,
  sub,
}: {
  icon: React.ReactNode;
  name: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="weather-metric">
      {icon}

      <span>{name}</span>

      <strong>{value}</strong>

      <small>{sub}</small>
    </div>
  );
}

function IndexCard({
  name,
  value,
  desc,
  progress,
}: {
  name: string;
  value: string;
  desc: string;
  progress: number;
}) {
  return (
    <div className="index-card">
      <span>{name}</span>

      <strong>{value}</strong>

      <small>{desc}</small>

      <div className="index-bar">
        <i
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}

function formatK(value: number) {
  return `${(value / 1000).toFixed(1)}K`;
}

export default App;