const express = require("express");
const cors = require("cors");
const db = require("./database");

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
    try {
        const wards = db.prepare(`
            SELECT
                temperature,
                population,
                risk
            FROM wards
        `).all();

        if (wards.length === 0) {
            return res.status(404).json({
                error: "No ward data found"
            });
        }

        // Average city temperature
        const averageTemperature =
            wards.reduce((sum, ward) => sum + ward.temperature, 0) /
            wards.length;

        // Population living in High / Very High / Extreme wards
        const populationAtRisk = wards
            .filter(
                (ward) =>
                    ward.risk === "High" ||
                    ward.risk === "Very High" ||
                    ward.risk === "Extreme"
            )
            .reduce((sum, ward) => sum + ward.population, 0);

        // Temporary risk score until ML model is connected
        const riskScores = {
            Moderate: 40,
            High: 65,
            "Very High": 80,
            Extreme: 95
        };

        const thermalRisk = Math.round(
            wards.reduce(
                (sum, ward) =>
                    sum + (riskScores[ward.risk] || 0),
                0
            ) / wards.length
        );

        // Temporary: number of Extreme + Very High wards
        const activeAlerts = wards.filter(
            (ward) =>
                ward.risk === "Extreme" ||
                ward.risk === "Very High"
        ).length;

        res.json({
            city: "Bhubaneswar",
            temperature: Math.round(averageTemperature),
            thermalRisk,
            populationAtRisk,
            activeAlerts
        });

    } catch (error) {
        console.error("Error fetching dashboard:", error);

        res.status(500).json({
            error: "Failed to fetch dashboard data"
        });
    }
});
app.get("/api/forecast", (req, res) => {
    try {
        const forecasts = db.prepare(`
            SELECT
                day,
                date,
                temp,
                feels,
                humidity,
                wind,
                radiation,
                wbgt,
                utci,
                risk
            FROM forecasts
            ORDER BY id
        `).all();

        res.json(forecasts);
    } catch (error) {
        console.error("Error fetching forecast:", error);

        res.status(500).json({
            error: "Failed to fetch forecast data"
        });
    }
});
app.get("/api/wards", (req, res) => {
    try {
        const wards = db.prepare(`
            SELECT
                ward,
                lat,
                lng,
                temperature,
                humidity,
                wind,
                radiation,
                wbgt,
                utci,
                population,
                risk
            FROM wards
            ORDER BY ward
        `).all();

        res.json(wards);
    } catch (error) {
        console.error("Error fetching wards:", error);

        res.status(500).json({
            error: "Failed to fetch ward data"
        });
    }
});
// GET ONLY HIGH-RISK WARDS
app.get("/api/wards/high-risk", (req, res) => {
    try {
        const wards = db.prepare(`
            SELECT
                ward,
                lat,
                lng,
                temperature,
                humidity,
                wind,
                radiation,
                wbgt,
                utci,
                population,
                risk
            FROM wards
            WHERE risk IN ('Extreme', 'Very High', 'High')
            ORDER BY
                CASE risk
                    WHEN 'Extreme' THEN 3
                    WHEN 'Very High' THEN 2
                    WHEN 'High' THEN 1
                    ELSE 0
                END DESC,
                temperature DESC
        `).all();

        res.json(wards);

    } catch (error) {
        console.error(
            "Error fetching high-risk wards:",
            error
        );

        res.status(500).json({
            error: "Failed to fetch high-risk wards"
        });
    }
});
// GET SINGLE WARD
app.get("/api/wards/:ward", (req, res) => {
    try {
        const wardNumber = Number(req.params.ward);

        const ward = db.prepare(`
            SELECT
                ward,
                lat,
                lng,
                temperature,
                humidity,
                wind,
                radiation,
                wbgt,
                utci,
                population,
                risk
            FROM wards
            WHERE ward = ?
        `).get(wardNumber);

        if (!ward) {
            return res.status(404).json({
                error: "Ward not found"
            });
        }

        res.json(ward);

    } catch (error) {
        console.error("Error fetching ward:", error);

        res.status(500).json({
            error: "Failed to fetch ward data"
        });
    }
});
// UPDATE A WARD
app.put("/api/wards/:ward", (req, res) => {
    try {
        const wardNumber = Number(req.params.ward);

        const {
            temperature,
            humidity,
            wind,
            radiation,
            wbgt,
            utci,
            population,
            risk
        } = req.body;

        const result = db.prepare(`
            UPDATE wards
            SET
                temperature = ?,
                humidity = ?,
                wind = ?,
                radiation = ?,
                wbgt = ?,
                utci = ?,
                population = ?,
                risk = ?
            WHERE ward = ?
        `).run(
            temperature,
            humidity,
            wind,
            radiation,
            wbgt,
            utci,
            population,
            risk,
            wardNumber
        );

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Ward not found"
            });
        }

        const updatedWard = db.prepare(`
            SELECT
                ward,
                lat,
                lng,
                temperature,
                humidity,
                wind,
                radiation,
                wbgt,
                utci,
                population,
                risk
            FROM wards
            WHERE ward = ?
        `).get(wardNumber);

        res.json(updatedWard);

    } catch (error) {
        console.error("Error updating ward:", error);

        res.status(500).json({
            error: "Failed to update ward"
        });
    }
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