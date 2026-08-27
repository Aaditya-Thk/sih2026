import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  CloudSun,
  Droplets,
  Home,
  LayoutDashboard,
  Leaf,
  Loader2,
  Map as MapIcon,
  Menu,
  MessageSquare,
  RotateCcw,
  ShieldAlert,
  Smartphone,
  Thermometer,
  TreePine,
  TriangleAlert,
  Users,
  Wind,
  X,
  Zap,
} from "lucide-react";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
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

            <button
  className="notification"
  onClick={() => navigate("Alerts")}
  title="View alerts"
>
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
            onAction={() => navigate("Forecast")}
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
          onAction={() => navigate("Risk Analysis")}
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
              progress={Math.min(selected.wbgt * 2.7, 100)}
            />

            <IndexCard
              name="UTCI"
              value={`${selected.utci}°C`}
              desc="Universal Thermal Climate Index"
              progress={Math.min(selected.utci * 2.1, 100)}
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
    wards.find((w) => w.ward === selectedWard) ?? wards[0];

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
                selectedWard === w.ward ? "selected" : ""
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
            progress={Math.max(5, 100 - ward.wind * 5)}
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
            <small>Wet Bulb Globe Temperature</small>
          </div>

          <div className="analysis-metric">
            <span>UTCI</span>
            <strong>{ward.utci}°C</strong>
            <small>Universal Thermal Climate Index</small>
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

            <small>Temperature + humidity effect</small>
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
  const [selectedWard, setSelectedWard] = useState(12);
  const [optimizing, setOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(true);

  const ward =
    wards.find((w) => w.ward === selectedWard) ?? wards[0];

  const interventionTemplates = [
    {
      name: "Cool Roofs",
      icon: "▣",
      percentage: 34,
      description: "Reflective roofing for heat-exposed buildings",
      target: "Dense residential areas",
      cooling: 1.1,
    },
    {
      name: "Urban Tree Plantation",
      icon: "♧",
      percentage: 26,
      description: "Increase shade and vegetation coverage",
      target: "Low vegetation wards",
      cooling: 0.9,
    },
    {
      name: "Reflective Surfaces",
      icon: "◫",
      percentage: 18,
      description: "High-albedo roads and public surfaces",
      target: "High surface-temperature corridors",
      cooling: 0.7,
    },
    {
      name: "Cooling Centres",
      icon: "◇",
      percentage: 14,
      description: "Accessible cooling spaces for vulnerable residents",
      target: "High population exposure zones",
      cooling: 0.3,
    },
    {
      name: "Green Corridors",
      icon: "⌁",
      percentage: 8,
      description: "Connected green spaces to reduce heat buildup",
      target: "Thermal hotspot corridors",
      cooling: 0.6,
    },
  ];

  const interventions = interventionTemplates.map((item) => ({
    ...item,
    amount: Math.round((budget * item.percentage) / 100),
  }));

  const estimatedCooling =
    interventions.reduce(
      (sum, item) => sum + item.cooling * (budget / 50),
      0
    );

  const temperatureReduction = Math.min(
    5.4,
    estimatedCooling
  );

  const populationBenefited = Math.min(
    220,
    Math.round(
      42 +
        budget * 1.55 +
        (ward.population / 1000) * 0.8
    )
  );

  const riskReduction = Math.min(
    48,
    Math.round(
      10 +
        budget * 0.43 +
        riskRank[ward.risk] * 1.5
    )
  );

  const wardsCovered = Math.min(
    18,
    Math.max(3, Math.round(budget / 3.8))
  );

  const runOptimization = () => {
    setOptimizing(true);
    setOptimized(false);

    setTimeout(() => {
      setOptimizing(false);
      setOptimized(true);
    }, 1400);
  };

  return (
    <div className="cooling-page">

      <ModuleHeader
        eyebrow="AI DECISION SUPPORT"
        title="AI Cooling Plan"
        text="Give ThermoShield the available budget. The system prioritizes high-risk areas and automatically creates an urban cooling strategy."
        right="Optimization ready"
      />

      {/* =====================================================
          BUDGET INPUT
      ===================================================== */}

      <section className="panel cooling-budget">

        <div className="cooling-budget-heading">

          <div className="budget-symbol">
            ₹
          </div>

          <div>
            <span>AVAILABLE MUNICIPAL BUDGET</span>

            <h2>
              ₹{budget} Cr
            </h2>

            <p>
              The AI engine will optimize this budget across
              heat-reduction interventions.
            </p>
          </div>

        </div>

        <div className="budget-control">

          <div className="budget-control-top">
            <span>Investment range</span>

            <strong>
              ₹{budget} Cr
            </strong>
          </div>

          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={budget}
            onChange={(e) => {
              setBudget(Number(e.target.value));
              setOptimized(false);
            }}
          />

          <div className="budget-range">
            <span>₹5 Cr</span>
            <span>₹100 Cr</span>
          </div>

        </div>

        <button
          className="optimize-button"
          onClick={runOptimization}
          disabled={optimizing}
        >
          {optimizing ? (
            <>
              <Loader2
                size={16}
                className="spin"
              />

              Optimizing...
            </>
          ) : (
            <>
              <Zap size={16} />

              {optimized
                ? "Recalculate Plan"
                : "Optimize Budget"}
            </>
          )}
        </button>

      </section>


      {/* =====================================================
          WARD PRIORITY
      ===================================================== */}

      <section className="panel cooling-priority">

        <div className="cooling-section-heading">

          <div>
            <span>PRIORITY LOCATION</span>

            <h2>
              Where should we intervene?
            </h2>

            <p>
              The AI prioritizes wards according to thermal
              stress, population exposure and vulnerability.
            </p>
          </div>

          <div className="priority-risk">
            <span>SELECTED WARD</span>

            <strong>
              Ward {ward.ward}
            </strong>

            <RiskBadge risk={ward.risk} />
          </div>

        </div>

        <div className="cooling-ward-selector">

          {wards.map((item) => (
            <button
              key={item.ward}
              className={
                selectedWard === item.ward
                  ? "cooling-ward active"
                  : "cooling-ward"
              }
              onClick={() =>
                setSelectedWard(item.ward)
              }
            >
              <span>WARD</span>

              <strong>{item.ward}</strong>

              <small>
                {item.temperature}°C
              </small>
            </button>
          ))}

        </div>

      </section>


      {/* =====================================================
          AI OUTPUT
      ===================================================== */}

      <div className="cooling-plan-grid">

        {/* LEFT */}

        <section className="panel intervention-panel">

          <div className="cooling-section-heading">

            <div>
              <span>AI GENERATED STRATEGY</span>

              <h2>
                Recommended interventions
              </h2>

              <p>
                Automatically allocated for maximum
                heat-reduction impact.
              </p>
            </div>

            <div className="ai-status">
              <span />
              AI optimized
            </div>

          </div>


          <div className="intervention-list">

            {interventions.map((item) => (

              <div
                className="intervention-row"
                key={item.name}
              >

                <div className="intervention-icon">
                  {item.icon}
                </div>

                <div className="intervention-info">

                  <div className="intervention-title">
                    <strong>
                      {item.name}
                    </strong>

                    <b>
                      ₹{item.amount} Cr
                    </b>
                  </div>

                  <p>
                    {item.description}
                  </p>

                  <span>
                    Target: {item.target}
                  </span>

                  <div className="intervention-bar">
                    <i
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>

                </div>

                <div className="intervention-share">
                  {item.percentage}%
                </div>

              </div>

            ))}

          </div>

        </section>


        {/* RIGHT */}

        <section className="panel cooling-impact">

          <div className="cooling-impact-header">

            <span>PROJECTED IMPACT</span>

            <CircleAlert size={17} />

          </div>


          <div className="main-impact">

            <small>
              ESTIMATED TEMPERATURE REDUCTION
            </small>

            <strong>
              −{temperatureReduction.toFixed(1)}°C
            </strong>

            <p>
              Estimated local cooling if the recommended
              interventions are implemented.
            </p>

          </div>


          <div className="impact-grid">

            <div>
              <Users size={17} />

              <strong>
                {populationBenefited}K
              </strong>

              <span>
                people benefited
              </span>
            </div>

            <div>
              <ShieldAlert size={17} />

              <strong>
                {riskReduction}%
              </strong>

              <span>
                thermal risk reduction
              </span>
            </div>

            <div>
              <MapIcon size={17} />

              <strong>
                {wardsCovered}
              </strong>

              <span>
                wards covered
              </span>
            </div>

            <div>
              <TreePine size={17} />

              <strong>
                {Math.round(budget * 1200)}
              </strong>

              <span>
                trees / green assets
              </span>
            </div>

          </div>


          <div className="impact-note">

            <Zap size={15} />

            <p>
              Highest-impact interventions are automatically
              given more budget priority.
            </p>

          </div>


          <button
            className="simulation-button"
            onClick={() => navigate("Digital Twin")}
          >
            <Activity size={16} />

            Simulate in Digital Twin

            <ChevronRight size={15} />
          </button>

        </section>

      </div>


      {/* =====================================================
          BEFORE / AFTER
      ===================================================== */}

      <section className="panel cooling-preview">

        <div className="cooling-section-heading">

          <div>
            <span>EXPECTED OUTCOME</span>

            <h2>
              Before vs AI Cooling Plan
            </h2>

            <p>
              A simplified prototype estimate of the
              intervention impact.
            </p>
          </div>

        </div>


        <div className="before-after">

          <div className="scenario current">

            <span>CURRENT CONDITION</span>

            <strong>
              {ward.temperature}°C
            </strong>

            <small>
              WBGT {ward.wbgt}°C
            </small>

            <RiskBadge risk={ward.risk} />

          </div>


          <div className="scenario-arrow">
            <ChevronRight size={22} />
          </div>


          <div className="scenario projected">

            <span>PROJECTED CONDITION</span>

            <strong>
              {(
                ward.temperature -
                temperatureReduction
              ).toFixed(1)}
              °C
            </strong>

            <small>
              WBGT{" "}
              {Math.max(
                24,
                ward.wbgt -
                  temperatureReduction * 0.72
              ).toFixed(1)}
              °C
            </small>

            <span className="projected-label">
              AFTER AI INTERVENTION
            </span>

          </div>

        </div>

      </section>

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
  const [temperature, setTemperature] = useState(44);
  const [trees, setTrees] = useState(60);
  const [coolRoofs, setCoolRoofs] = useState(45);
  const [greenCover, setGreenCover] = useState(30);

  /*
   * Calculate the effect of interventions.
   * This is a prototype simulation, so the numbers are illustrative.
   */

  const treeEffect = trees * 0.018;
  const roofEffect = coolRoofs * 0.022;
  const greenEffect = greenCover * 0.014;

  const totalCooling = Math.min(
    6.5,
    treeEffect + roofEffect + greenEffect
  );

  const projectedTemperature = Math.max(
    34,
    temperature - totalCooling
  );

  const currentWBGT = Math.min(
    36,
    temperature * 0.74
  );

  const projectedWBGT = Math.max(
    25,
    currentWBGT - totalCooling * 0.68
  );

  const currentRisk =
    temperature >= 45
      ? "Extreme"
      : temperature >= 42
      ? "Very High"
      : temperature >= 39
      ? "High"
      : "Moderate";

  const projectedRisk =
    projectedTemperature >= 45
      ? "Extreme"
      : projectedTemperature >= 42
      ? "Very High"
      : projectedTemperature >= 39
      ? "High"
      : "Moderate";

  const riskReduction = Math.min(
    55,
    Math.round(totalCooling * 8)
  );

  const peopleProtected = Math.round(
    25 +
      trees * 0.45 +
      coolRoofs * 0.35 +
      greenCover * 0.25
  );

  const resetSimulation = () => {
    setTemperature(44);
    setTrees(60);
    setCoolRoofs(45);
    setGreenCover(30);
  };

  return (
    <div className="twin-page">

      <ModuleHeader
        eyebrow="URBAN HEAT SIMULATION"
        title="Digital Twin"
        text="Model how different cooling interventions could change thermal conditions across the city."
        right="Simulation active"
      />

      {/* =====================================================
          SIMULATION CONTROLS
      ===================================================== */}

      <section className="panel twin-control-panel">

        <div className="twin-heading">

          <div className="twin-icon">
            <Activity size={20} />
          </div>

          <div>
            <span>LIVE SCENARIO</span>

            <h2>
              Heat Intervention Simulator
            </h2>

            <p>
              Adjust the city conditions and interventions
              to see their projected impact.
            </p>
          </div>

        </div>

        <button
          className="twin-reset"
          onClick={resetSimulation}
        >
          <RotateCcw size={14} />
          Reset
        </button>

      </section>


      {/* =====================================================
          CONTROL GRID
      ===================================================== */}

      <div className="twin-main-grid">

        <section className="panel twin-controls">

          <div className="twin-panel-title">
            <div>
              <span>SCENARIO PARAMETERS</span>
              <h2>Adjust interventions</h2>
            </div>

            <span className="simulation-live">
              <i />
              Live
            </span>
          </div>


          {/* Temperature */}

          <div className="twin-slider">

            <div className="twin-slider-head">

              <div>
                <span>BASE TEMPERATURE</span>
                <strong>
                  {temperature}°C
                </strong>
              </div>

              <Thermometer size={18} />

            </div>

            <input
              type="range"
              min="35"
              max="48"
              step="1"
              value={temperature}
              onChange={(e) =>
                setTemperature(Number(e.target.value))
              }
            />

            <div className="twin-range">
              <span>35°C</span>
              <span>48°C</span>
            </div>

          </div>


          {/* Trees */}

          <div className="twin-slider">

            <div className="twin-slider-head">

              <div>
                <span>URBAN TREES</span>
                <strong>
                  {trees}%
                </strong>
              </div>

              <TreePine size={18} />

            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={trees}
              onChange={(e) =>
                setTrees(Number(e.target.value))
              }
            />

            <div className="twin-range">
              <span>0%</span>
              <span>100%</span>
            </div>

          </div>


          {/* Cool roofs */}

          <div className="twin-slider">

            <div className="twin-slider-head">

              <div>
                <span>COOL ROOF COVERAGE</span>
                <strong>
                  {coolRoofs}%
                </strong>
              </div>

              <Home size={18} />

            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={coolRoofs}
              onChange={(e) =>
                setCoolRoofs(Number(e.target.value))
              }
            />

            <div className="twin-range">
              <span>0%</span>
              <span>100%</span>
            </div>

          </div>


          {/* Green cover */}

          <div className="twin-slider">

            <div className="twin-slider-head">

              <div>
                <span>GREEN COVERAGE</span>
                <strong>
                  {greenCover}%
                </strong>
              </div>

              <Leaf size={18} />

            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={greenCover}
              onChange={(e) =>
                setGreenCover(Number(e.target.value))
              }
            />

            <div className="twin-range">
              <span>0%</span>
              <span>100%</span>
            </div>

          </div>

        </section>


        {/* =================================================
            IMPACT
        ================================================= */}

        <section className="panel twin-impact-panel">

          <div className="twin-panel-title">

            <div>
              <span>PROJECTED IMPACT</span>
              <h2>Simulation result</h2>
            </div>

            <div className="twin-status">
              Active
            </div>

          </div>


          <div className="twin-main-result">

            <span>ESTIMATED COOLING</span>

            <strong>
              −{totalCooling.toFixed(1)}°C
            </strong>

            <p>
              Projected reduction from the selected
              intervention mix.
            </p>

          </div>


          <div className="twin-metrics">

            <div className="twin-metric">

              <Thermometer size={17} />

              <span>Temperature</span>

              <strong>
                {projectedTemperature.toFixed(1)}°C
              </strong>

            </div>


            <div className="twin-metric">

              <Wind size={17} />

              <span>WBGT</span>

              <strong>
                {projectedWBGT.toFixed(1)}°C
              </strong>

            </div>


            <div className="twin-metric">

              <ShieldAlert size={17} />

              <span>Risk reduction</span>

              <strong>
                {riskReduction}%
              </strong>

            </div>


            <div className="twin-metric">

              <Users size={17} />

              <span>People protected</span>

              <strong>
                {peopleProtected}K
              </strong>

            </div>

          </div>

        </section>

      </div>


      {/* =====================================================
          BEFORE / AFTER
      ===================================================== */}

      <section className="panel twin-comparison">

        <div className="twin-panel-title">

          <div>
            <span>SCENARIO COMPARISON</span>

            <h2>
              Current city vs simulated city
            </h2>

            <p>
              See how the selected interventions change
              the thermal environment.
            </p>
          </div>

        </div>


        <div className="twin-before-after">

          {/* CURRENT */}

          <div className="twin-scenario current">

            <div className="scenario-label">
              CURRENT CONDITION
            </div>

            <div className="scenario-temperature">
              {temperature}°C
            </div>

            <div className="scenario-wbgt">
              WBGT {currentWBGT.toFixed(1)}°C
            </div>

            <div
              className={`scenario-risk ${currentRisk
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {currentRisk} Risk
            </div>

          </div>


          {/* ARROW */}

          <div className="twin-arrow">
            <ChevronRight size={22} />
          </div>


          {/* PROJECTED */}

          <div className="twin-scenario projected">

            <div className="scenario-label">
              SIMULATED CONDITION
            </div>

            <div className="scenario-temperature">
              {projectedTemperature.toFixed(1)}°C
            </div>

            <div className="scenario-wbgt">
              WBGT {projectedWBGT.toFixed(1)}°C
            </div>

            <div
              className={`scenario-risk ${projectedRisk
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {projectedRisk} Risk
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          INTERVENTION SUMMARY
      ===================================================== */}

      <section className="panel twin-summary">

        <div className="twin-panel-title">

          <div>
            <span>INTERVENTION MIX</span>

            <h2>
              What is driving the cooling?
            </h2>
          </div>

        </div>


        <div className="twin-interventions">

          <div className="twin-intervention tree">
            <TreePine size={19} />

            <div>
              <strong>
                Urban Trees
              </strong>

              <span>
                {trees}% coverage
              </span>
            </div>

            <b>
              −{treeEffect.toFixed(1)}°C
            </b>
          </div>


          <div className="twin-intervention roof">
            <Home size={19} />

            <div>
              <strong>
                Cool Roofs
              </strong>

              <span>
                {coolRoofs}% coverage
              </span>
            </div>

            <b>
              −{roofEffect.toFixed(1)}°C
            </b>
          </div>


          <div className="twin-intervention green">
            <Leaf size={19} />

            <div>
              <strong>
                Green Coverage
              </strong>

              <span>
                {greenCover}% coverage
              </span>
            </div>

            <b>
              −{greenEffect.toFixed(1)}°C
            </b>
          </div>

        </div>

      </section>


      {/* =====================================================
          ACTION
      ===================================================== */}

      <div className="twin-action">

        <div>
          <strong>
            Ready to test another scenario?
          </strong>

          <span>
            Change the intervention levels above and
            the simulation will update automatically.
          </span>
        </div>

        <button
          onClick={() => navigate("AI Cooling Plan")}
        >
          <Zap size={15} />
          Open AI Cooling Plan
          <ChevronRight size={15} />
        </button>

      </div>

    </div>
  );
}

/* =========================================================
   AUTOMATIC ALERTS
========================================================= */

function AlertsPage() {
  const [alertStatus, setAlertStatus] = useState<
    "monitoring" | "generating" | "sent"
  >("monitoring");

  const [selectedAlert, setSelectedAlert] =
    useState<Ward | null>(null);

  /*
    In the real system these values will come from the
    backend thermal-risk engine.

    For the SIH prototype, Ward 12 is already at
    EXTREME risk, so the automatic alert workflow
    is demonstrated without a manual Send button.
  */

  const extremeAlerts = wards.filter(
    (ward) => ward.risk === "Extreme"
  );

  useEffect(() => {
    const extremeWard = extremeAlerts[0];

    if (!extremeWard) {
      return;
    }

    const timer = setTimeout(() => {
      setSelectedAlert(extremeWard);
      setAlertStatus("generating");

      setTimeout(() => {
        setAlertStatus("sent");
      }, 1800);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const generateMessage = (ward: Ward) => {
    if (ward.risk === "Extreme") {
      return `Extreme heat conditions detected in Ward ${ward.ward}. Temperature ${ward.temperature}°C and WBGT ${ward.wbgt}°C. Avoid outdoor activity between 12 PM and 4 PM. Stay hydrated and use nearby cooling centres.`;
    }

    if (ward.risk === "Very High") {
      return `Very high heat stress detected in Ward ${ward.ward}. Reduce prolonged outdoor exposure, stay hydrated and follow local heat-safety advisories.`;
    }

    if (ward.risk === "High") {
      return `High heat risk detected in Ward ${ward.ward}. Residents are advised to remain hydrated and avoid unnecessary outdoor activity.`;
    }

    return `Heat conditions are being monitored in Ward ${ward.ward}.`;
  };

  return (
    <div className="alerts-page">
      <ModuleHeader
        eyebrow="AUTOMATED PUBLIC HEALTH ALERTING"
        title="Heat Alerts"
        text="ThermoShield automatically generates and distributes location-specific heat warnings when risk thresholds are crossed."
        right="Automatic engine active"
      />

      {/* AUTOMATION STATUS */}

      <div className="alert-system-card">
        <div className="alert-system-icon">
          <Zap size={21} />
        </div>

        <div className="alert-system-content">
          <span>SYSTEM STATUS</span>

          <h2>
            {alertStatus === "monitoring" &&
              "Monitoring thermal risk continuously"}

            {alertStatus === "generating" &&
              "Extreme heat risk detected"}

            {alertStatus === "sent" &&
              "Public health alerts distributed"}
          </h2>

          <p>
            The system monitors ward-level thermal conditions
            and automatically generates targeted alerts when
            predefined risk thresholds are crossed.
          </p>
        </div>

        <div className="alert-system-badge">
          {alertStatus === "monitoring" && (
            <>
              <span className="status-dot monitoring" />
              Monitoring
            </>
          )}

          {alertStatus === "generating" && (
            <>
              <span className="status-dot generating" />
              Generating
            </>
          )}

          {alertStatus === "sent" && (
            <>
              <span className="status-dot sent" />
              Sent
            </>
          )}
        </div>
      </div>

      {/* ALERT QUEUE + DISTRIBUTION */}

      <div className="alerts-layout">
        <div className="panel alert-queue">
          <PanelHeader
            title="Active Alert Queue"
            subtitle="Automatically generated from current thermal-risk levels"
          />

          <div className="alert-list">
            {wards
              .filter((w) => w.risk !== "Moderate")
              .map((ward) => (
                <div
                  className={`alert-item ${
                    ward.risk === "Extreme"
                      ? "alert-extreme"
                      : ward.risk === "Very High"
                      ? "alert-very-high"
                      : "alert-high"
                  }`}
                  key={ward.ward}
                >
                  <div className="alert-item-icon">
                    <TriangleAlert size={18} />
                  </div>

                  <div className="alert-item-main">
                    <div className="alert-item-top">
                      <div>
                        <strong>
                          {ward.risk === "Extreme"
                            ? "Extreme heat warning"
                            : `${ward.risk} heat warning`}
                        </strong>

                        <span>
                          Ward {ward.ward} ·{" "}
                          {ward.temperature}°C · WBGT{" "}
                          {ward.wbgt}
                        </span>
                      </div>

                      <RiskBadge risk={ward.risk} />
                    </div>

                    <div className="alert-values">
                      <span>
                        <Thermometer size={12} />
                        {ward.temperature}°C
                      </span>

                      <span>
                        WBGT {ward.wbgt}°C
                      </span>

                      <span>
                        <Users size={12} />
                        {formatK(ward.population)}
                      </span>
                    </div>

                    <p>{generateMessage(ward)}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* DISTRIBUTION */}

        <div className="panel distribution-panel">
          <PanelHeader
            title="Automatic Distribution"
            subtitle="Communication channels"
          />

          {selectedAlert ? (
            <div className="selected-alert">
              <div className="selected-alert-header">
                <div>
                  <span>TRIGGERED ALERT</span>

                  <strong>
                    Ward {selectedAlert.ward}
                  </strong>
                </div>

                <RiskBadge risk={selectedAlert.risk} />
              </div>

              <div className="selected-alert-data">
                <div>
                  <span>Temperature</span>
                  <strong>
                    {selectedAlert.temperature}°C
                  </strong>
                </div>

                <div>
                  <span>WBGT</span>
                  <strong>
                    {selectedAlert.wbgt}°C
                  </strong>
                </div>
              </div>

              <div className="distribution-status">
                <div className="distribution-channel">
                  <Smartphone size={17} />

                  <div>
                    <strong>SMS</strong>

                    <span>
                      {alertStatus === "sent"
                        ? "Automatically sent to residents"
                        : "Preparing alert"}
                    </span>
                  </div>

                  {alertStatus === "sent" && (
                    <CheckCircle2 size={16} />
                  )}
                </div>

                <div className="distribution-channel">
                  <MessageSquare size={17} />

                  <div>
                    <strong>WhatsApp</strong>

                    <span>
                      {alertStatus === "sent"
                        ? "Automatically distributed"
                        : "Preparing alert"}
                    </span>
                  </div>

                  {alertStatus === "sent" && (
                    <CheckCircle2 size={16} />
                  )}
                </div>

                <div className="distribution-channel">
                  <Building2 size={17} />

                  <div>
                    <strong>Authorities</strong>

                    <span>
                      {alertStatus === "sent"
                        ? "Municipal dashboard notified"
                        : "Preparing notification"}
                    </span>
                  </div>

                  {alertStatus === "sent" && (
                    <CheckCircle2 size={16} />
                  )}
                </div>
              </div>

              {alertStatus === "generating" && (
                <div className="alert-processing">
                  <Loader2 size={15} className="spin" />

                  AI is generating a localized advisory...
                </div>
              )}

              {alertStatus === "sent" && (
                <div className="alert-success">
                  <CheckCircle2 size={16} />

                  <div>
                    <strong>
                      Alert distributed successfully
                    </strong>

                    <span>
                      SMS, WhatsApp and authority notification
                      triggered automatically.
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="waiting-alert">
              <Zap size={24} />

              <strong>
                Monitoring for threshold breach
              </strong>

              <p>
                When a ward reaches Extreme risk,
                ThermoShield automatically generates and
                distributes an alert.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* WORKFLOW */}

      <div className="panel alert-workflow">
        <PanelHeader
          title="Automatic Alert Workflow"
          subtitle="How ThermoShield converts heat risk into action"
        />

        <div className="workflow">
          <div className="workflow-step">
            <div>
              <Thermometer size={18} />
            </div>

            <strong>Risk Detected</strong>

            <span>
              Thermal conditions cross threshold
            </span>
          </div>

          <div className="workflow-line" />

          <div className="workflow-step">
            <div>
              <Zap size={18} />
            </div>

            <strong>AI Advisory</strong>

            <span>
              Localized message generated
            </span>
          </div>

          <div className="workflow-line" />

          <div className="workflow-step">
            <div>
              <Smartphone size={18} />
            </div>

            <strong>SMS / WhatsApp</strong>

            <span>
              Residents automatically notified
            </span>
          </div>

          <div className="workflow-line" />

          <div className="workflow-step">
            <div>
              <Building2 size={18} />
            </div>

            <strong>Authorities</strong>

            <span>
              Heat action response triggered
            </span>
          </div>
        </div>
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
  onAction,
}: {
  title: string;
  subtitle: string;
  action?: string;
  onAction?: () => void;
}) {
  const handleAction = () => {
    if (onAction) {
      onAction();
    }
  };

  return (
    <div className="panel-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {action && (
        <button
          type="button"
          className="panel-action"
          onClick={handleAction}
          aria-label={action}
        >
          <span>{action}</span>
          <ChevronRight size={15} />
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

function formatK(value: number) {
  return `${(value / 1000).toFixed(1)}K`;
}

export default App;