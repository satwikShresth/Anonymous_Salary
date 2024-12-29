import express from "express";
//import { handler } from "../build/handler.js";

const app = express();
const port = 3000;

app.get("/api/options/company", (_req, res) => {
  const query = req.query.q || "";
  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Japan",
    "Australia",
    "Brazil",
    "India",
    "China",
  ];

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(query.toLowerCase())
  );

  res.json(filteredCountries);
});

app.get("/api/options/positions", (_req, res) => {
  const query = req.query.q || "";
  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Japan",
    "Australia",
    "Brazil",
    "India",
    "China",
  ];

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(query.toLowerCase())
  );

  res.json(filteredCountries);
});

app.get("/api/options/location", (req, res) => {
  const query = req.query.q || "";
  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Japan",
    "Australia",
    "Brazil",
    "India",
    "China",
  ];

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(query.toLowerCase())
  );

  res.json(filteredCountries);
});

app.get("/api/options/source", (_req, res) => {
  res.json(
    [
      { value: "scdc", label: "SCDC" },
      {
        value: "external",
        label: "External",
      },
    ],
  );
});

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.get("/healthcheck", (_req, res) => {
  res.send("Hello World!");
});

//app.use(handler);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
