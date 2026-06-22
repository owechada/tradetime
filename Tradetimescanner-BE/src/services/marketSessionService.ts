// Standard Forex Market Hours (UTC)
// Note: These are approximate and don't account for DST changes, which is acceptable for this feature
const SESSION_TIMES = {
  Sydney: { start: 21, end: 6 }, // 21:00 - 06:00 UTC
  Tokyo: { start: 0, end: 9 },   // 00:00 - 09:00 UTC
  London: { start: 7, end: 16 },  // 07:00 - 16:00 UTC
  "New York": { start: 12, end: 21 } // 12:00 - 21:00 UTC
};

type SessionName = keyof typeof SESSION_TIMES;

/**
 * Get current active sessions based on UTC time
 */
export const getActiveSessions = (): SessionName[] => {
  const now = new Date();
  const currentHour = now.getUTCHours();
  const activeSessions: SessionName[] = [];

  Object.entries(SESSION_TIMES).forEach(([name, time]) => {
    const sessionName = name as SessionName;
    // Handle sessions that cross midnight (e.g., Sydney 21:00 - 06:00)
    if (time.start > time.end) {
      if (currentHour >= time.start || currentHour < time.end) {
        activeSessions.push(sessionName);
      }
    } else {
      // Standard sessions (e.g., London 07:00 - 16:00)
      if (currentHour >= time.start && currentHour < time.end) {
        activeSessions.push(sessionName);
      }
    }
  });

  return activeSessions;
};

/**
 * Determine liquidity level based on active sessions
 */
export const getLiquidityLevel = (sessions: SessionName[]): string => {
  if (sessions.includes("London") && sessions.includes("New York")) {
    return "Very High"; // The "Power Hour" overlap
  }
  if (sessions.includes("London")) {
    return "High";
  }
  if (sessions.includes("New York")) {
    return "High";
  }
  if (sessions.includes("Tokyo") && sessions.includes("London")) {
    return "Medium"; // Minor overlap
  }
  if (sessions.includes("Tokyo")) {
    return "Medium";
  }
  if (sessions.includes("Sydney")) {
    return "Low"; // Generally lower liquidity
  }
  return "Low";
};

/**
 * Get detailed market status and explanation
 */
export const getMarketStatus = () => {
  const activeSessions = getActiveSessions();
  const liquidity = getLiquidityLevel(activeSessions);
  const now = new Date();

  let status = "Active";
  if (activeSessions.length === 0 || (activeSessions.length === 1 && activeSessions.includes("Sydney"))) {
    // Consider late NY (21:00-22:00) or just Sydney as less active/dead for major pairs
    if (activeSessions.length === 0) status = "Dead";
    // Sydney is active but low liquidity for majors
  }

  let explanation = "";
  if (activeSessions.length === 0) {
    explanation = "The major markets are currently closed or in low activity. Liquidity is very low, leading to wider spreads and unpredictable volatility. It is NOT recommended to trade now.";
  } else if (activeSessions.includes("London") && activeSessions.includes("New York")) {
    explanation = "The market is currently in the London-New York overlap, which offers the highest liquidity and volatility. This is the BEST time to trade major pairs like EURUSD and GBPUSD.";
  } else if (activeSessions.includes("London")) {
    explanation = "The London session is active. This is a great time to trade European pairs (EUR, GBP, CHF) as volatility and liquidity are high.";
  } else if (activeSessions.includes("New York")) {
    explanation = "The New York session is active. USD and CAD pairs are seeing good movement. Good time for trading, especially during news releases.";
  } else if (activeSessions.includes("Tokyo")) {
    explanation = "The Tokyo (Asian) session is active. Volatility is generally lower than London/NY. Focus on JPY and AUD pairs.";
  } else if (activeSessions.includes("Sydney")) {
    explanation = "The Sydney session is active. Liquidity is relatively low. Focus on AUD and NZD pairs, but be cautious of lower volatility.";
  }

  return {
    activeSessions,
    liquidity,
    status,
    explanation,
    currentUtcTime: now.toISOString()
  };
};

/**
 * Get recommended pairs based on active sessions
 */
export const getRecommendedPairs = () => {
  const activeSessions = getActiveSessions();
  const recommendations: Array<{ pair: string; status: string; reason: string }> = [];

  // Define all major pairs to evaluate
  const allPairs = [
    "EURUSD", "GBPUSD", "USDJPY", "USDCAD", "AUDUSD", "NZDUSD", "USDCHF",
    "EURJPY", "GBPJPY", "EURGBP", "AUDJPY", "CADJPY"
  ];

  allPairs.forEach(pair => {
    let status = "Not Recommended";
    let reason = "Low liquidity for this pair in current session.";

    // Logic for recommendations
    if (activeSessions.includes("London") && activeSessions.includes("New York")) {
      // Overlap: Majors are best
      if (["EURUSD", "GBPUSD", "USDJPY", "USDCAD", "USDCHF"].includes(pair)) {
        status = "Recommended";
        reason = "High liquidity during London-NY overlap.";
      }
    } else if (activeSessions.includes("London")) {
      // London: EUR, GBP pairs
      if (pair.includes("EUR") || pair.includes("GBP")) {
        status = "Recommended";
        reason = "Active during London session.";
      }
    } else if (activeSessions.includes("New York")) {
      // NY: USD, CAD pairs
      if (pair.includes("USD") || pair.includes("CAD")) {
        status = "Recommended";
        reason = "Active during New York session.";
      }
    } else if (activeSessions.includes("Tokyo")) {
      // Tokyo: JPY pairs
      if (pair.includes("JPY")) {
        status = "Recommended";
        reason = "Active during Tokyo session.";
      }
    } else if (activeSessions.includes("Sydney")) {
      // Sydney: AUD, NZD pairs
      if (pair.includes("AUD") || pair.includes("NZD")) {
        status = "Recommended";
        reason = "Active during Sydney session.";
      }
    }
    recommendations.push({ pair, status, reason });
  });

  return recommendations;
};
