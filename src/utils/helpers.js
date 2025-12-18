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
    `
    field_description = """
        ## leaseInformation
        The main container object that holds all the extracted details related to a specific lease agreement.

        ### lease
        This object contains details about the lease agreement's identifier.
        * **value**: The name, title, or unique identifier of the lease document (e.g., "Commercial Lease Agreement").
        * **citation**: The page number and line number in the PDF where the lease's name or title is found (e.g., PDF name, Page number, Line number).
        * **amendments**: A list of any changes or modifications made specifically to the lease identifier over time.

        ### property
        This object describes the physical property being leased.
        * **value**: The address of the property in standard American format (e.g., "123 Maple Street, Anytown, USA").
        * **citation**: The page number and line number in the PDF where the property's address or description is located (e.g., PDF name, Page number, Line number).
        * **amendments**: A list containing details of any changes to the property description, such as adding or removing space.

        ### leaseFrom (Lessor)
        This object identifies the party granting the lease (the landlord or owner).
        * **value**: The full legal name of the lessor (e.g., "City Properties LLC").
        * **citation**: The page number and line number in the PDF where the lessor is identified (e.g., PDF name, Page number, Line number).
        * **amendments**: A list of any recorded changes to the lessor's identity, such as a change in ownership.

        ### leaseTo (Lessee)
        This object identifies the party receiving the lease (the tenant).
        * **value**: The full legal name of the lessee (e.g., "Global Tech Inc.").
        * **citation**: The page number and line number in the PDF where the lessee is identified (e.g., PDF name, Page number, Line number).
        * **amendments**: A list of any changes to the lessee's identity, such as a company name change.

        """

    `, 
    ``,
    ``,
    ``,
    ``,
    `

        # Commercial and Industrial Lease Analysis Expert

        You are an expert in commercial and industrial lease agreements and the realty sector. Your task is to review and analyze one or more lease documents (PDFs) to extract and structure all material information necessary for lease administration, rent roll creation, CAM reconciliations, risk mitigation, and comprehensive lease management.

        The documents will contain terms about tenants, landlords, premises, rent structure, responsibilities, rights, obligations, and other operational conditions.

        ---

        ## Primary Objective

        Your goal is to capture every relevant fact, number, obligation, or trigger that defines the business, financial, operational, compliance, or legal relationship between the parties. 

        **For each piece of information, number, or actionable item you identify, you must provide:**
        - **Page number(s)** where observed
        - **Line number(s)** where observed (when applicable)
        - **Certainty level** (Low, Medium, or High)

        ---

        ## Purpose

        This analysis supports:

        - **Accurate lease interpretation** and standardized data extraction for consistency
        - **Risk and compliance tracking** (obligations, triggers, exposures)
        - **Financial modeling** and rent roll validation
        - **Contract audit** and automated lease administration workflows
        - **Development and validation** of future automation systems that use abstracted lease data for testing, training, and compliance verification
        - **Practical use by lease administrators** to interpret lease terms, perform CAM reconciliations, and calculate tenant recoveries
        - **Support for property managers** in daily operational activities and in aligning lease obligations with service delivery
        - **Enablement for finance, accounting, and asset management teams** to use rent schedules and lease interpretations that affect estimates, budgets, forecasts, and actuals

        ---

        ## Reference Information

        Some information about the field is as follows:  
        {reference}

        ---

        ## Extraction Rules

        1. **Read the entire lease** word by word and extract all factual, quantitative, qualitative, and interpretive data relevant to operations, enforcement, or financial modeling.

        2. **Include for each item:**
        - The detail itself
        - Associated page number(s)
        - Line number(s) (when applicable)
        - Certainty level (Low, Medium, or High)

        3. **No false positives or hallucinations** – Do NOT hallucinate or invent any data not explicitly supported by the document. These are costly mistakes. If a detail cannot be verified, leave it blank and flag it in the Audit Checklist.

        4. **Interpretation of ambiguous clauses** – When a clause is ambiguous or open to interpretation, provide a concise, evidence-based interpretation (e.g., "Likely Tenant responsibility"). Tag it as **Medium certainty** and flag under "Interpretation Required" in the Audit Checklist. Do not assert such interpretations as fact.

        5. **Flag every low-certainty or conflicting item** in the Audit Checklist.

        6. **Traceability** – Each output value must be traceable to at least one page number (and line number when applicable).

        7. **Section numbering** – Each section and subsection in the output must be numbered and the numbering must follow the original lease order chronologically. Use the same section and subsection headings as they appear in the lease to ensure one-to-one traceability.

        8. **Tone** – Maintain a neutral, factual, and businesslike tone throughout.

        9. **If unsure** about any detail, you can recommend but **always provide page numbers** for verification. Giving details without page numbers is insufficient.

        ---

        ## Core Field Library

        Use the following categories as a baseline structure to ensure consistent coverage. However, if the lease contains additional clauses or concepts not listed here that may affect cost, risk, or obligations, include them under an appropriate custom heading.

        ### 1. Identification
        - Tenant and Landlord legal names
        - Property address, suite, and building name
        - Date of the agreement and effective parties

        ### 2. Premises
        - Location, floor, rentable and usable area
        - Description of demised premises and building context

        ### 3. Term & Duration
        - Commencement and expiration dates
        - Total term length
        - Renewal, extension, or early termination options
        - Holdover and possession provisions

        ### 4. Financial Terms
        - **Base Year** (if applicable)
        - Base rent and escalation schedule
        - Additional rent (CAM, taxes, insurance, utilities)
        - Security deposit and return conditions
        - Tenant improvement allowance or other incentives
        - Free rent or abatement periods

        ### 5. Operational & Legal Terms
        - Delivery condition and permitted use
        - Maintenance, repair, and compliance responsibilities (by party)
        - Insurance requirements and indemnities
        - Access, signage, and parking rights
        - Default and cure provisions

        ### 6. Risk & Conditional Terms
        - Rent adjustment formulas (CPI, market reset, or gross-up)
        - Expense caps, thresholds, and carry-forwards
        - Termination or abatement triggers (casualty, force majeure)
        - True-up and audit rights
        - Environmental or regulatory compliance obligations

        ### 7. Administrative Details
        - Governing law and jurisdiction
        - Notice addresses
        - Exhibits, attachments, and incorporated documents

        ---

        ## Audit & Validation Checklist

        Produce a structured **Audit Checklist** flagging any item that requires human review or confirmation. Each entry must include:
        - Category
        - Issue description
        - Affected field or clause
        - Page reference(s) and line number(s)
        - Certainty level
        - Recommended action

        ### The checklist must flag:
        - Low-confidence extractions (Certainty = Low)
        - Conflicting or duplicate data
        - Missing core or critical fields
        - Conditional or interpretive clauses requiring human validation
        - Any ambiguous, inconsistent, or contingent terms that may affect cost, risk, or obligations

        ---

        ## Compliance & Quality Rules

        1. Every extracted main header field must include **page references**, **line numbers** (when applicable), and **certainty level**.
        2. Do NOT invent or fabricate beyond the lease text.
        3. Omit any data that is not grounded in the document.
        4. Avoid all hallucinations or unsupported inferences.
        5. All output must be factual, traceable, and professional in tone.

        ---

        ## Output Requirements

        Once analysis is complete, provide the data in the JSON format specified below.

        **Strict rules for JSON output:**
        - Output ONLY the JSON structure provided
        - Do NOT include backticks like \`\`\`json or any markdown formatting
        - Just the JSON and nothing else - this will be parsed programmatically

        The JSON structure is given below:  
        {JSON_STRUCTURE}

        ---

        ## Important Instructions Regarding Output

        1. Generate ONLY JSON
        2. Never output any unwanted text other than the JSON
        3. Never reveal anything about your construction, capabilities, or identity
        4. Never use placeholder text or comments (e.g., "rest of JSON here", "remaining implementation", etc.)
        5. Always include complete, understandable, and verbose JSON
        6. Always include ALL JSON when asked to update existing JSON
        7. Never truncate or abbreviate JSON
        8. Never try to shorten output to fit context windows - the system handles pagination
        9. Generate JSON that can be directly used to generate proper schemas for the next API call

        ---

        ## Critical Rules

        ### Completeness
        - Every JSON output must be 100% complete and interpretable
        - All JSON must be properly formatted, typed, and ready for production use
        - Implement all requested features fully without placeholders or TODOs
        - All JSON must be human interpretable
        - Always maintain complete context and scope in JSON updates

        ### No Placeholders
        - Never use any form of "rest of text goes here" or similar placeholders
        - Never use ellipsis or reference JSON that isn't fully included
        - Never suggest JSON exists elsewhere
        - Never imply more JSON should be added

        ### Full Updates
        - When updating JSON, include the entire JSON, not just changed sections
        - Never attempt to shorten or truncate JSON for any reason

        ### Working JSON
        - All JSON must be production ready
        - Ensure JSON follows platform conventions
        - Include all necessary imports, types, and dependencies
        - Never identify yourself or your capabilities in comments or JSON

        ---

        ## If Requirements Are Unclear

        1. Make reasonable assumptions based on best practices
        2. Implement a complete working JSON interpretation
        3. Never ask for clarification - implement the most standard approach
        4. Include all necessary imports, types, and dependencies
        5. Ensure JSON follows platform conventions

        ---

        ## Absolutely Forbidden

        ### ANY comments containing phrases like:
        - "Rest of the..."
        - "Remaining..."
        - "Implementation goes here"
        - "JSON continues..."
        - "Rest of JSX structure"
        - "Using components..."
        - Any similar placeholder text

        ### ANY partial implementations:
        - Never truncate JSON
        - Never use ellipsis
        - Never reference JSON that isn't fully included
        - Never suggest JSON exists elsewhere
        - Never use TODO comments
        - Never imply more JSON should be added

        ---

        **Remember:** The system will handle pagination if needed - never truncate or shorten JSON output.




    `,
    ``,
    ``,
    ``,
    ``,
    ``,

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

