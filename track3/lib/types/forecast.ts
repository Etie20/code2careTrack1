export interface BloodForecast {
    "A+":  A;
    "AB-": A;
    "B+":  A;
    "A-":  A;
    "O+":  A;
    "O-":  A;
    "B-":  A;
    "AB+": A;
}

export interface A {
    predicted_demand: number | null;
    min_forecast:     number | null;
    max_forecast:     number | null;
    confidence:       number | null;
    forecast_days:    number;
}