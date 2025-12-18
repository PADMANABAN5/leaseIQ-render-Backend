const fs = require("fs");
const path = require("path");
const { getLLMAdapter } = require("../adapters/llms");
const { PDFChunker } = require("./parsers/pdf");
const { loadChunks, saveChunks } = require("./cache");
const { ANALYSIS_CONFIG, AnalysisType } = require("./constants");
const audit = require("./references/audit");

// Initialize LLM adapter (singleton pattern)
let llmAdapterInstance = null;

/**
 * Get LLM adapter instance (singleton)
 * @returns {BaseLLMAdapter} LLM adapter instance
 */
function getLLMAdapterInstance() {
  if (!llmAdapterInstance) {
    const { getLLMAdapter: createLLMAdapter } = require("../adapters/llms");
    llmAdapterInstance = createLLMAdapter();
  }
  return llmAdapterInstance;
}

/**
 * Build chunk data string from PDF chunks
 * @param {Array} chunks - Array of PDFChunk objects
 * @returns {string} Formatted string with chunk data
 */
function buildChunkData(chunks) {
  let data = "Given below is the data of a Lease PDF\n";
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    data += `
        
            Details about Page number ${i}
            "chunk_id": ${chunk.chunk_id},
            "page_number": ${chunk.page_number},
            "text": ${chunk.original_page_text},
            "previous_overlap": ${chunk.previous_overlap || null},
            "next_overlap": ${chunk.next_overlap || null},
            "overlap_info": ${JSON.stringify(chunk.overlap_info || {})}
        
        `;
  }
  return data;
}

/**
 * Parse LLM response with fallback handling
 * @param {string} content - LLM response content
 * @returns {Object} Parsed JSON object
 */
function parseLLMResponse(content) {
  try {
    return JSON.parse(content);
  } catch (jsonError) {
    try {
      // Try to handle single-quoted Python-style dicts
      // Replace single quotes with double quotes for JSON parsing
      const cleaned = content
        .replace(/'/g, '"')
        .replace(/(\w+):/g, '"$1":')
        .replace(/:\s*"([^"]*)"/g, ': "$1"');
      return JSON.parse(cleaned);
    } catch (evalError) {
      // Fallback - wrap raw content
      return { content: content };
    }
  }
}

/**
 * Load cached PDF chunks or process new PDF
 * @param {string} filename - Original filename
 * @param {Buffer} fileContent - PDF file content as Buffer
 * @returns {Promise<Array>} Array of PDFChunk objects
 */
async function loadOrProcessPDF(filename, fileContent) {
  const cachedChunks = loadChunks(filename);
  
  if (cachedChunks) {
    console.log(`Found cached PDF analysis for ${filename}`);
    return cachedChunks;
  }

  console.log(`Processing new PDF: ${filename}`);
  const chunker = new PDFChunker(0.2); // 20% overlap
  const chunks = await chunker.process_pdf(fileContent, true); // extract_tables = true

  // Cache the chunks
  saveChunks(filename, chunks);

  return chunks;
}

/**
 * Mock Google Docs API - returns placeholder content
 * @param {Array<number>} infoList - List of document indices to retrieve
 * @returns {Promise<Array<string>>} Array of document content strings
 */
async function contentFromDoc(infoList) {
  // Mock implementation - returns placeholder content with proper template placeholders
  // In production, this would call Google Docs API
  const mockContent = [
    "Field definitions placeholder - This would contain field definitions from Google Docs",
    "System prompt template with {reference} and {JSON_STRUCTURE} placeholders. Replace {reference} with field definitions and {JSON_STRUCTURE} with the JSON structure.",
    "Additional content placeholder",
    "More content placeholder",
    "Even more content placeholder",
    "CAM field definitions placeholder",
    "CAM system prompt template with {CURRENT_PAGE_NUMBER}, {PREVIOUS_PAGE_NUMBER}, {NEXT_PAGE_NUMBER}, {PREVIOUS_PAGE_CONTENT}, {CURRENT_PAGE_CONTENT}, {PREVIOUSLY_EXTRACTED_CAM_RULES} placeholders.",
  ];

  const results = [];
  for (const index of infoList) {
    if (index < mockContent.length) {
      results.push(mockContent[index]);
    } else {
      results.push(`Placeholder content for index ${index}`);
    }
  }

  return results;
}

/**
 * Compile iterative CAM outputs from numbered text files
 * @returns {Promise<Object>} Compiled CAM analysis result
 */
async function compileIterativeOutputs() {
  const compiledResult = {
    pageAnalysis: {
      currentPage: 0,
      previousPage: "N/A",
      nextPage: "N/A",
      analysisTimestamp: "",
    },
    newCamRules: [],
    continuedRules: [],
    crossPageContext: [],
    flagsAndObservations: {
      ambiguities: [],
      conflicts: [],
      missingProvisions: [],
      tenantConcerns: [],
      provisionsSpanningToNextPage: [],
    },
    cumulativeCamRulesSummary: {
      totalRulesExtracted: 0,
      rulesByCategory: {
        proportionateShare: 0,
        camExpenseCategories: 0,
        exclusions: 0,
        paymentTerms: 0,
        capsLimitations: 0,
        reconciliationProcedures: 0,
        baseYearProvisions: 0,
        grossUpProvisions: 0,
        administrativeFees: 0,
        auditRights: 0,
        noticeRequirements: 0,
        controllableVsNonControllable: 0,
        definitions: 0,
        calculationMethods: 0,
      },
      overallTenantRiskAssessment: "Low",
      keyTenantProtections: [],
      keyTenantExposures: [],
    },
    allExtractedRules: [],
  };

  const folderPath = "./cam_result";
  if (!fs.existsSync(folderPath)) {
    return compiledResult;
  }

  // Find all numbered text files
  const numberedFiles = [];
  for (let i = 0; i < 100; i++) {
    const filename = path.join(folderPath, `${i}.txt`);
    if (fs.existsSync(filename)) {
      numberedFiles.push(filename);
    }
  }

  console.log(`Found ${numberedFiles.length} numbered text files to compile`);

  // Process each file in numeric order
  numberedFiles.sort((a, b) => {
    const numA = parseInt(path.basename(a, ".txt"));
    const numB = parseInt(path.basename(b, ".txt"));
    return numA - numB;
  });

  for (const filename of numberedFiles) {
    try {
      const content = fs.readFileSync(filename, "utf8").trim();

      if (!content) {
        console.log(`Skipping empty file: ${filename}`);
        continue;
      }

      // Clean the content (remove markdown code blocks if present)
      let cleanedContent = content;
      if (cleanedContent.startsWith("```json")) {
        cleanedContent = cleanedContent.slice(7);
      }
      if (cleanedContent.startsWith("```")) {
        cleanedContent = cleanedContent.slice(3);
      }
      if (cleanedContent.endsWith("```")) {
        cleanedContent = cleanedContent.slice(0, -3);
      }
      cleanedContent = cleanedContent.trim();

      if (!cleanedContent) {
        console.log(`Skipping file with no content after cleaning: ${filename}`);
        continue;
      }

      // Parse JSON content
      let data;
      try {
        data = JSON.parse(cleanedContent);
      } catch (e) {
        console.log(`Skipping ${filename} due to invalid JSON: ${e.message}`);
        continue;
      }

      // Merge data into compiled result
      if (data.pageAnalysis) {
        Object.assign(compiledResult.pageAnalysis, data.pageAnalysis);
      }

      if (data.extractedCamRules) {
        compiledResult.newCamRules.push(...data.extractedCamRules);
      } else if (data.newCamRules) {
        compiledResult.newCamRules.push(...data.newCamRules);
      }

      if (data.continuedRules) {
        compiledResult.continuedRules.push(...data.continuedRules);
      }

      if (data.crossPageContext) {
        compiledResult.crossPageContext.push(...data.crossPageContext);
      }

      if (data.flagsAndObservations) {
        const flags = data.flagsAndObservations;
        if (flags.ambiguities) {
          compiledResult.flagsAndObservations.ambiguities.push(...flags.ambiguities);
        }
        if (flags.conflicts) {
          compiledResult.flagsAndObservations.conflicts.push(...flags.conflicts);
        }
        if (flags.missingProvisions) {
          compiledResult.flagsAndObservations.missingProvisions.push(...flags.missingProvisions);
        }
        if (flags.tenantConcerns) {
          compiledResult.flagsAndObservations.tenantConcerns.push(...flags.tenantConcerns);
        }
        if (flags.provisionsSpanningToNextPage) {
          compiledResult.flagsAndObservations.provisionsSpanningToNextPage = flags.provisionsSpanningToNextPage;
        }
      }

      if (data.allExtractedRules) {
        compiledResult.allExtractedRules.push(...data.allExtractedRules);
      }

      if (data.cumulativeCamRulesSummary) {
        const summary = data.cumulativeCamRulesSummary;
        if (summary.totalRulesExtracted !== undefined) {
          compiledResult.cumulativeCamRulesSummary.totalRulesExtracted = summary.totalRulesExtracted;
        }
        if (summary.rulesByCategory) {
          Object.keys(summary.rulesByCategory).forEach((category) => {
            if (compiledResult.cumulativeCamRulesSummary.rulesByCategory[category] !== undefined) {
              compiledResult.cumulativeCamRulesSummary.rulesByCategory[category] +=
                summary.rulesByCategory[category] || 0;
            }
          });
        }
        if (summary.overallTenantRiskAssessment) {
          compiledResult.cumulativeCamRulesSummary.overallTenantRiskAssessment =
            summary.overallTenantRiskAssessment;
        }
        if (summary.keyTenantProtections) {
          compiledResult.cumulativeCamRulesSummary.keyTenantProtections.push(
            ...summary.keyTenantProtections
          );
        }
        if (summary.keyTenantExposures) {
          compiledResult.cumulativeCamRulesSummary.keyTenantExposures.push(
            ...summary.keyTenantExposures
          );
        }
      }

      console.log(`Successfully processed ${filename}`);
    } catch (error) {
      console.error(`Error processing ${filename}: ${error.message}`);
      continue;
    }
  }

  // Update total rules count
  compiledResult.cumulativeCamRulesSummary.totalRulesExtracted =
    compiledResult.newCamRules.length;

  // Count rules by category
  compiledResult.newCamRules.forEach((rule) => {
    if (rule.ruleCategory && compiledResult.cumulativeCamRulesSummary.rulesByCategory[rule.ruleCategory] !== undefined) {
      compiledResult.cumulativeCamRulesSummary.rulesByCategory[rule.ruleCategory]++;
    }
  });

  // Remove duplicates
  const seenRuleIds = new Set();
  compiledResult.newCamRules = compiledResult.newCamRules.filter((rule) => {
    if (rule.ruleId && seenRuleIds.has(rule.ruleId)) {
      return false;
    }
    if (rule.ruleId) {
      seenRuleIds.add(rule.ruleId);
    }
    return true;
  });

  console.log(
    `Compilation complete. Total rules extracted: ${compiledResult.cumulativeCamRulesSummary.totalRulesExtracted}`
  );

  // Clean up cam_result folder
  try {
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      if (files.length > 0) {
        files.forEach((file) => {
          fs.unlinkSync(path.join(folderPath, file));
        });
      }
      fs.rmdirSync(folderPath);
      console.log("Successfully deleted cam_result folder");
    }
  } catch (error) {
    console.warn(`Could not delete cam_result folder: ${error.message}`);
  }

  return compiledResult;
}

/**
 * Update result JSON iteratively with new chunk data
 * @param {Object} messageDict - The cumulative result dictionary
 * @param {string} messageContent - The JSON string response from LLM for current chunk
 * @returns {Object} Updated message_dict with merged content
 */
function updateResultJSON(messageDict, messageContent) {
  // Initialize empty structure if message_dict is empty
  if (!messageDict || Object.keys(messageDict).length === 0) {
    messageDict = {
      pageAnalysis: {
        currentPage: 0,
        previousPage: "N/A",
        nextPage: "N/A",
        analysisTimestamp: "",
      },
      newCamRules: [],
      continuedRules: [],
      crossPageContext: [],
      flagsAndObservations: {
        ambiguities: [],
        conflicts: [],
        missingProvisions: [],
        tenantConcerns: [],
        provisionsSpanningToNextPage: [],
      },
      cumulativeCamRulesSummary: {
        totalRulesExtracted: 0,
        rulesByCategory: {
          proportionateShare: 0,
          camExpenseCategories: 0,
          exclusions: 0,
          paymentTerms: 0,
          capsLimitations: 0,
          reconciliationProcedures: 0,
          baseYearProvisions: 0,
          grossUpProvisions: 0,
          administrativeFees: 0,
          auditRights: 0,
          noticeRequirements: 0,
          controllableVsNonControllable: 0,
          definitions: 0,
          calculationMethods: 0,
        },
        overallTenantRiskAssessment: "Low",
        keyTenantProtections: [],
        keyTenantExposures: [],
      },
      allExtractedRules: [],
    };
  }

  // Parse the new chunk data
  let newData;
  try {
    // Clean the message content (remove markdown code blocks if present)
    let cleanedContent = messageContent.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent.slice(7);
    }
    if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith("```")) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    newData = JSON.parse(cleanedContent);
  } catch (error) {
    console.error(`JSON decode error: ${error.message}`);
    console.error(`Problematic content: ${messageContent.substring(0, 200)}...`);
    throw new Error(`Invalid JSON response from LLM: ${error.message}`);
  }

  // Merge new data into messageDict
  if (newData.pageAnalysis) {
    Object.assign(messageDict.pageAnalysis, newData.pageAnalysis);
  }

  if (newData.extractedCamRules) {
    messageDict.newCamRules.push(...newData.extractedCamRules);
  } else if (newData.newCamRules) {
    messageDict.newCamRules.push(...newData.newCamRules);
  }

  if (newData.continuedRules) {
    messageDict.continuedRules.push(...newData.continuedRules);
  }

  if (newData.crossPageContext) {
    messageDict.crossPageContext.push(...newData.crossPageContext);
  }

  if (newData.allExtractedRules) {
    messageDict.allExtractedRules.push(...newData.allExtractedRules);
  }

  if (newData.flagsAndObservations) {
    const flags = newData.flagsAndObservations;
    if (flags.ambiguities) {
      messageDict.flagsAndObservations.ambiguities.push(...flags.ambiguities);
    }
    if (flags.conflicts) {
      messageDict.flagsAndObservations.conflicts.push(...flags.conflicts);
    }
    if (flags.missingProvisions) {
      messageDict.flagsAndObservations.missingProvisions.push(...flags.missingProvisions);
    }
    if (flags.tenantConcerns) {
      messageDict.flagsAndObservations.tenantConcerns.push(...flags.tenantConcerns);
    }
    if (flags.provisionsSpanningToNextPage) {
      messageDict.flagsAndObservations.provisionsSpanningToNextPage =
        flags.provisionsSpanningToNextPage;
    }
  }

  if (newData.cumulativeCamRulesSummary) {
    const summary = newData.cumulativeCamRulesSummary;
    if (summary.totalRulesExtracted !== undefined) {
      messageDict.cumulativeCamRulesSummary.totalRulesExtracted = messageDict.newCamRules.length;
    }
    if (summary.rulesByCategory) {
      Object.keys(summary.rulesByCategory).forEach((category) => {
        if (messageDict.cumulativeCamRulesSummary.rulesByCategory[category] !== undefined) {
          messageDict.cumulativeCamRulesSummary.rulesByCategory[category] +=
            summary.rulesByCategory[category] || 0;
        }
      });
    }
    if (summary.overallTenantRiskAssessment) {
      const riskHierarchy = { Low: 0, Medium: 1, High: 2, Critical: 3 };
      const currentRisk = riskHierarchy[messageDict.cumulativeCamRulesSummary.overallTenantRiskAssessment] || 0;
      const newRisk = riskHierarchy[summary.overallTenantRiskAssessment] || 0;
      if (newRisk > currentRisk) {
        messageDict.cumulativeCamRulesSummary.overallTenantRiskAssessment =
          summary.overallTenantRiskAssessment;
      }
    }
    if (summary.keyTenantProtections) {
      summary.keyTenantProtections.forEach((protection) => {
        if (!messageDict.cumulativeCamRulesSummary.keyTenantProtections.includes(protection)) {
          messageDict.cumulativeCamRulesSummary.keyTenantProtections.push(protection);
        }
      });
    }
    if (summary.keyTenantExposures) {
      summary.keyTenantExposures.forEach((exposure) => {
        if (!messageDict.cumulativeCamRulesSummary.keyTenantExposures.includes(exposure)) {
          messageDict.cumulativeCamRulesSummary.keyTenantExposures.push(exposure);
        }
      });
    }
  }

  return messageDict;
}

module.exports = {
  getLLMAdapter: getLLMAdapterInstance,
  buildChunkData,
  parseLLMResponse,
  loadOrProcessPDF,
  contentFromDoc,
  compileIterativeOutputs,
  updateResultJSON,
};

