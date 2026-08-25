const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend is running successfully!"
    });
});

const PORT = 5000;
app.get("/api/dashboard", (req, res) => {
    res.json({
        city: "Bhubaneswar",
        temperature: 42,
        thermalRisk: 84,
        populationAtRisk: 72400,
        activeAlerts: 7
    });
});
app.get("/api/forecast", (req, res) => {
    res.json([
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
            risk: "High"
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
            risk: "High"
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
            risk: "Very High"
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
            risk: "Extreme"
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
            risk: "Very High"
        }
    ]);
}); 
app.get("/api/wards", (req, res) => {
    res.json([
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
            risk: "Extreme"
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
            risk: "Very High"
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
            risk: "High"
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
            risk: "High"
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
            risk: "Moderate"
        }
    ]);
});
app.get("/api/heatmap", (req, res) => {
    res.json([
        {
            id: 1,
            lat: 20.2961,
            lng: 85.8245,
            intensity: 0.9,
            risk: "Extreme"
        },
        {
            id: 2,
            lat: 20.2990,
            lng: 85.8270,
            intensity: 0.75,
            risk: "High"
        },
        {
            id: 3,
            lat: 20.2935,
            lng: 85.8215,
            intensity: 0.6,
            risk: "Moderate"
        },
        {
            id: 4,
            lat: 20.3015,
            lng: 85.8300,
            intensity: 0.85,
            risk: "Extreme"
        },
        {
            id: 5,
            lat: 20.2900,
            lng: 85.8260,
            intensity: 0.45,
            risk: "Low"
        }
    ]);
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});