import { GoogleGenAI, Type } from "@google/genai";
import type {
  AIItineraryInput,
  AIItineraryOutput,
  ActivityCategory,
  DaySegment,
  RecommendationReasonCode,
  Activity,
  Itinerary,
  Weather,
} from "@/types/trip";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const itinerarySchema = {
  type: Type.OBJECT,
  properties: {
    itinerary: {
      type: Type.OBJECT,
      properties: {
        days: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dayNumber: {
                type: Type.INTEGER,
              },
              date: {
                type: Type.STRING,
              },
              segments: {
                type: Type.OBJECT,
                properties: {
                  morning: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: {
                          type: Type.STRING,
                        },
                        name: {
                          type: Type.STRING,
                        },
                        category: {
                          type: Type.STRING,
                        },
                        locationName: {
                          type: Type.STRING,
                        },
                        startTime: {
                          type: Type.STRING,
                        },
                        durationMinutes: {
                          type: Type.NUMBER,
                        },
                        estimatedCost: {
                          type: Type.NUMBER,
                        },
                        costIsEstimate: {
                          type: Type.BOOLEAN,
                        },
                        reasons: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              code: {
                                type: Type.STRING,
                              },
                              label: {
                                type: Type.STRING,
                              },
                              detail: {
                                type: Type.STRING,
                              },
                            },
                            required: [
                              "code",
                              "label",
                              "detail",
                            ],
                          },
                        },
                      },
                      required: [
                        "id",
                        "name",
                        "category",
                        "locationName",
                        "startTime",
                        "durationMinutes",
                        "estimatedCost",
                        "costIsEstimate",
                        "reasons",
                      ],
                    },
                  },

                  afternoon: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: {
                          type: Type.STRING,
                        },
                        name: {
                          type: Type.STRING,
                        },
                        category: {
                          type: Type.STRING,
                        },
                        locationName: {
                          type: Type.STRING,
                        },
                        startTime: {
                          type: Type.STRING,
                        },
                        durationMinutes: {
                          type: Type.NUMBER,
                        },
                        estimatedCost: {
                          type: Type.NUMBER,
                        },
                        costIsEstimate: {
                          type: Type.BOOLEAN,
                        },
                        reasons: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              code: {
                                type: Type.STRING,
                              },
                              label: {
                                type: Type.STRING,
                              },
                              detail: {
                                type: Type.STRING,
                              },
                            },
                            required: [
                              "code",
                              "label",
                              "detail",
                            ],
                          },
                        },
                      },
                      required: [
                        "id",
                        "name",
                        "category",
                        "locationName",
                        "startTime",
                        "durationMinutes",
                        "estimatedCost",
                        "costIsEstimate",
                        "reasons",
                      ],
                    },
                  },

                  evening: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: {
                          type: Type.STRING,
                        },
                        name: {
                          type: Type.STRING,
                        },
                        category: {
                          type: Type.STRING,
                        },
                        locationName: {
                          type: Type.STRING,
                        },
                        startTime: {
                          type: Type.STRING,
                        },
                        durationMinutes: {
                          type: Type.NUMBER,
                        },
                        estimatedCost: {
                          type: Type.NUMBER,
                        },
                        costIsEstimate: {
                          type: Type.BOOLEAN,
                        },
                        reasons: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              code: {
                                type: Type.STRING,
                              },
                              label: {
                                type: Type.STRING,
                              },
                              detail: {
                                type: Type.STRING,
                              },
                            },
                            required: [
                              "code",
                              "label",
                              "detail",
                            ],
                          },
                        },
                      },
                      required: [
                        "id",
                        "name",
                        "category",
                        "locationName",
                        "startTime",
                        "durationMinutes",
                        "estimatedCost",
                        "costIsEstimate",
                        "reasons",
                      ],
                    },
                  },
                },
                required: [
                  "morning",
                  "afternoon",
                  "evening",
                ],
              },
            },
            required: [
              "dayNumber",
              "date",
              "segments",
            ],
          },
        },
      },
      required: ["days"],
    },

    budgetBreakdown: {
      type: Type.OBJECT,
      properties: {
        currency: {
          type: Type.STRING,
        },
        totalBudget: {
          type: Type.NUMBER,
        },
        estimatedTotal: {
          type: Type.NUMBER,
        },
        bookedTotal: {
          type: Type.NUMBER,
        },
        lines: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
              },
              estimated: {
                type: Type.NUMBER,
              },
              booked: {
                type: Type.NUMBER,
              },
            },
            required: [
              "category",
              "estimated",
              "booked",
            ],
          },
        },
      },
      required: [
        "currency",
        "totalBudget",
        "estimatedTotal",
        "bookedTotal",
        "lines",
      ],
    },
  },

  required: [
    "itinerary",
    "budgetBreakdown",
  ],
};

export async function generateItinerary(
  input: AIItineraryInput
): Promise<AIItineraryOutput> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const prompt = buildItineraryPrompt(input);

  const response = await generateWithRetry(prompt);

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  try {
    const parsed =
      JSON.parse(response.text) as AIItineraryOutput;

    const enrichedItinerary =
      enrichItineraryWithRealData(
        parsed.itinerary,
        input
      );

    return {
      ...parsed,
      itinerary: enrichedItinerary,
    };
  } catch {
    throw new Error(
      "Gemini returned invalid itinerary JSON"
    );
  }
}

async function generateWithRetry(prompt: string) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: itinerarySchema,
        },
      });
    } catch (error) {
      if (attempt === 3) {
        throw error;
      }

      console.log(
        `Gemini request failed. Retrying attempt ${
          attempt + 1
        }/3...`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, attempt * 2000)
      );
    }
  }

  throw new Error(
    "Gemini request failed after 3 attempts"
  );
}

function buildItineraryPrompt(
  input: AIItineraryInput
): string {
  const {
    request,
    weather,
    eligiblePlaces,
  } = input;

  return `
You are the itinerary planning engine for Stayora, an AI travel planning application.

Your job is to create a realistic day-by-day travel itinerary using ONLY the travel data supplied below.

TRIP REQUIREMENTS

Destination:
${request.destination.name ?? request.destination.query}

Start date:
${request.startDate}

End date:
${request.endDate}

Travelers:
${request.travelers}

Budget:
${request.currency} ${request.budget}

Interests:
${request.interests.join(", ")}

Travel style:
${request.travelStyle}

Daily pace:
${request.dailyPace}

Maximum travel time:
${request.maxTravelTimeMinutes} minutes

Additional preferences:
${request.additionalPreferences || "None"}

WEATHER DATA

${JSON.stringify(weather, null, 2)}

ELIGIBLE PLACES

${JSON.stringify(eligiblePlaces, null, 2)}

PLANNING RULES

1. Create one itinerary day for every date from the start date through the end date.

2. Use the supplied eligible places as the main activity candidates.

3. Do not invent attractions, places, restaurants, coordinates, distances, or travel times that are not present in the supplied data.

4. Respect the user's interests, travel style, and daily pace.

5. Respect the maximum travel-time constraint.

6. Avoid scheduling too many activities in one day.

7. Group activities logically by time of day.

8. Consider the supplied weather data when deciding which activities are suitable.

9. Keep the estimated trip cost within the user's total budget whenever possible.

10. Every selected activity must contain a clear reason for why it was selected.

11. Use only these recommendation reason codes:
   - matches_interests
   - fits_budget
   - fits_available_time
   - close_to_previous
   - suitable_for_weather
   - matches_travel_style

12. Costs are estimates unless actual booking prices are provided.

13. Do not claim that anything has been booked.

14. Return ONLY the JSON structure requested by the response schema.

15. Every activity must have a unique id within the entire itinerary.

16. Every activity must include a reasons array containing at least one reason object.

17. Each reason must contain:
   - code
   - label
   - detail

18. Activity names must match the supplied eligible place names exactly.

19. Do not create new place names.

Create a practical itinerary rather than simply listing every available place.
`;
}

function enrichItineraryWithRealData(
  itinerary: Itinerary,
  input: AIItineraryInput
): Itinerary {
  const weatherByDate = new Map(
    input.weather.daily.map((day) => [
      day.date,
      day,
    ])
  );

  const days = itinerary.days.map((day) => {
    const forecast = weatherByDate.get(day.date);

    const weather = forecast
      ? createWeatherFromForecast(forecast)
      : undefined;

    return {
      ...day,
      weather,
      segments: {
        morning: enrichActivities(
          day.segments.morning,
          input
        ),
        afternoon: enrichActivities(
          day.segments.afternoon,
          input
        ),
        evening: enrichActivities(
          day.segments.evening,
          input
        ),
      },
    };
  });

  return {
    ...itinerary,
    days,
  };
}

function enrichActivities(
  activities: Activity[],
  input: AIItineraryInput
): Activity[] {
  return activities.map((activity) => {
    const matchingPlace =
      findMatchingPlace(
        activity.name,
        input.eligiblePlaces
      );

    if (!matchingPlace) {
      return activity;
    }

    return {
      ...activity,
      coordinates: matchingPlace.coordinates,
      distanceFromPreviousKm:
        matchingPlace.distanceFromDestinationKm,
      travelTimeFromPreviousMinutes:
        matchingPlace.travelTimeFromDestinationMinutes,
    };
  });
}

function findMatchingPlace(
  activityName: string,
  places: AIItineraryInput["eligiblePlaces"]
) {
  const normalizedActivity =
    normalizeName(activityName);

  return places.find(
    (place) =>
      normalizeName(place.name) ===
      normalizedActivity
  );
}

function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function createWeatherFromForecast(
  forecast: AIItineraryInput["weather"]["daily"][number]
): Weather {
  return {
    date: forecast.date,
    condition: weatherCodeToCondition(
      forecast.weatherCode
    ),
    summary: weatherCodeToSummary(
      forecast.weatherCode,
      forecast.precipitationChance
    ),
    highC: forecast.highC,
    lowC: forecast.lowC,
    precipitationChance:
      forecast.precipitationChance,
  };
}

function weatherCodeToCondition(
  code: number
): string {
  if (code === 0) {
    return "Clear sky";
  }

  if (code === 1 || code === 2) {
    return "Partly cloudy";
  }

  if (code === 3) {
    return "Overcast";
  }

  if (
    code === 45 ||
    code === 48
  ) {
    return "Fog";
  }

  if (
    code >= 51 &&
    code <= 57
  ) {
    return "Drizzle";
  }

  if (
    code >= 61 &&
    code <= 67
  ) {
    return "Rain";
  }

  if (
    code >= 71 &&
    code <= 77
  ) {
    return "Snow";
  }

  if (
    code >= 80 &&
    code <= 82
  ) {
    return "Rain showers";
  }

  if (
    code >= 85 &&
    code <= 86
  ) {
    return "Snow showers";
  }

  if (
    code >= 95 &&
    code <= 99
  ) {
    return "Thunderstorm";
  }

  return "Unknown";
}

function weatherCodeToSummary(
  code: number,
  precipitationChance: number
): string {
  const condition =
    weatherCodeToCondition(code);

  return `${condition}. ${precipitationChance}% chance of precipitation.`;
}