export interface StandardAnalysisResult {
  marketSummary: {
    asset: string;
    marketType: string;
    timeframe: string;
    currentPrice: string;
    marketBias: string; // Now longer strings (e.g., "Bullish - Price found support at 1.0800")
    marketPhase: string;
    volatilityState: string;
    analysisTime?: string;
    setupQuality: "High" | "Medium" | "Low" | string; // Strict: High | Medium | Low
    riskRating: string;
    disclaimer: string;
  };
  tradeSetup: {
    tradeDirection: string;
    setupType: string;
    tradeStyle: string;
    setupStatus: string; // Check for "NO HIGH-PROBABILITY SETUP DETECTED"
  };
  chartReasoning: {
    narrative: string;
    visualEvidence: string;
  };
  candleConfirmation: {
    logic: string;
    requirement: string;
  };
  advancedMetrics: {
    setupQualityScore: string;
    tradeExpectancyType: "Positive" | "Moderate opportunity — confirmation needed" | "Caution — weak or risky setup" | string;
    confidenceBreakdown: {
      structure: string; // Emojis: ✅ | ⚠️
      trendAlignment: string; // Emojis: ✅ | ⚠️
      volumeVolatility: string; // Emojis: ✅ | ⚠️
      sessionTiming: string; // Emojis: ✅ | ⚠️
    };
  };
  tradeLevels: {
    suggestedEntryZone: string;
    invalidationLevel: string; // Price + Reasoning (e.g., "1.0720 - Below recent swing low")
    targetZones: {
      targetZone1: string;
      targetZone2: string;
      targetZone3: string;
    };
    riskPercentage: string;
    partialCloseRecommendation: string;
    managementGuidance: string;
  };
  marketStructure: {
    overallStructure: string;
    structureStrength: string;
  };
  keyPriceLevels: {
    support: { s1: string; s2: string; s3: string };
    resistance: { r1: string; r2: string; r3: string };
  };
  liquidityInsight?: {
    observation: string;
    logic: string;
  };
  alternativeScenario: {
    scenario: string;
    triggerLevel: string;
  };
  // Supporting old fields just in case they are still used in some parts
  invalidationLogic?: {
    condition: string;
    reason: string;
  };
  timeExpectation?: {
    expectedDuration: string;
    candleCount: string;
  };
}

export interface OptionsAnalysisResult {
  marketSnapshot: {
    asset: string;
    timeframe: string;
    tradeDuration: string;
    currentBias: string;
    marketCondition: string;
    volatilityState: string;
    confidenceScore: string;
  };
  tradeDecision: {
    direction: string;
    setupStrength: string;
    tradeValidity: string;
  };
  timeframeConsistencyCheck: {
    selectedTimeframe: string;
    selectedTradeDuration: string;
    alignmentStatus: string;
    reason: string;
    adjustmentSuggestion: string;
  };
  entryTiming: {
    optimalEntryZone: string;
    entryType: string;
    exactCandleConfirmationRequired: string;
  };
  expiryAlignmentAnalysis: {
    durationSuitability: string;
    timingAlignmentWithPriceBehavior: string;
    expectedMoveWindow: string;
    reasonForDuration: string;
  };
  microMarketStructure: {
    currentMicroTrend: string;
    structureFormation: string;
    breakOfStructure: string;
    keyReactionLevel: string;
    structureStrength: string;
  };
  keyReactionZones: {
    immediateSupport: string;
    immediateResistance: string;
    entryReactionZone: string;
    liquidityArea: string;
  };
  candleBehaviorAnalysis: {
    currentCandleStrength: string;
    previousCandleSignal: string;
    patternDetected: string;
    rejectionOrContinuationSignal: string;
    candleMomentumStrength: string;
  };
  momentumFlow: {
    momentumDirection: string;
    momentumStrength: string;
    accelerationOrWeakening: string;
    exhaustionRisk: string;
    fakeMoveRisk: string;
  };
  riskAndTradeQuality: {
    riskLevel: string;
    setupQualityScore: string;
    executionDifficulty: string;
  };
  explanation: {
    marketActivityNow: string;
    directionReasoning: string;
    durationExpectationReasoning: string;
  };
  noTradeCondition: {
    exists: boolean;
    reason: string;
    missingElements: string;
    whatToWaitFor: string;
  };
}

export type ProChartAnalysisResponse = StandardAnalysisResult | OptionsAnalysisResult;
