const {
  chargeSchedules,
  executive_summary,
  leaseInformation,
  misc,
  space,
} = require("./references");

const CORS_CONFIG = {
  allow_origins: ["*"],
  allow_credentials: false,
  allow_methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allow_headers: ["*"],
};

const AnalysisType = {
  INFO: "info",
  SPACE: "space",
  CHARGE_SCHEDULES: "charge-schedules",
  MISC: "misc",
  EXECUTIVE_SUMMARY: "executive-summary",
  AUDIT: "audit",
  ALL: "all",
};

const ANALYSIS_CONFIG = {
  [AnalysisType.INFO]: {
    doc_indices: [0, 5],
    structure: leaseInformation.structure,
  },
  [AnalysisType.SPACE]: {
    doc_indices: [1, 5],
    structure: space.structure,
  },
  [AnalysisType.CHARGE_SCHEDULES]: {
    doc_indices: [2, 5],
    structure: chargeSchedules.structure,
  },
  [AnalysisType.MISC]: {
    doc_indices: [3, 5],
    structure: misc.structure,
  },
  [AnalysisType.EXECUTIVE_SUMMARY]: {
    doc_indices: [4, 5],
    structure: executive_summary.structure,
  },
};

const MOCK_LEASE_RESPONSE = {
  "_id": "69524f8d1c3375833bf12221",
  "user_id": "694eb22f4f40987a9a1f8da7",
  "tenant_id": "6950954469be09d9a6e80351",
  "unit_id": "69524f8d1c3375833bf12220",
  "start_date": null,
  "end_date": null,
  "created_at": "2025-12-29T09:53:17.261Z",
  "tenant": {
      "_id": "6950954469be09d9a6e80351",
      "user_id": "694eb22f4f40987a9a1f8da7",
      "tenant_name": " Wallmart",
      "created_at": "2025-12-28T02:26:12.570Z"
  },
  "unit": {
      "_id": "69524f8d1c3375833bf12220",
      "user_id": "694eb22f4f40987a9a1f8da7",
      "property_id": "6951d9f2e50b3906de2a1158",
      "unit_number": "unit 201",
      "square_ft": "200",
      "monthly_rent": "40",
      "created_at": "2025-12-29T09:53:17.206Z"
  },
  "property": {
      "_id": "6951d9f2e50b3906de2a1158",
      "user_id": "694eb22f4f40987a9a1f8da7",
      "property_name": "Downtown",
      "address": "123",
      "created_at": "2025-12-29T01:31:30.637Z"
  },
  "documents": [
      {
          "_id": "69524f951c3375833bf12223",
          "user_id": "694eb22f4f40987a9a1f8da7",
          "lease_id": "69524f8d1c3375833bf12221",
          "document_name": "Duracell fka Gillette 2015-12-18 Lease.pdf",
          "document_type": "main lease",
          "file_path": "leases/1767001997363-Duracell fka Gillette 2015-12-18 Lease.pdf",
          "created_at": "2025-12-29T09:53:25.199Z"
      }
  ],
  "lease_details": {
      "_id": "69524f8d1c3375833bf12222",
      "user_id": "694eb22f4f40987a9a1f8da7",
      "lease_id": "69524f8d1c3375833bf12221",
      "details": {
          "cam-single": {
              "data": {
                  "pageNumber": 39,
                  "title": "EXHIBIT D - MEMORANDUM OF ACCEPTANCE OF DELIVERY OF PREMISE",
                  "rawText": "EXHIBIT D MEMORANDUM OF ACCEPTANCE OF DELIVERY OF PREMISES This memorandum is entered into on ______ , 20_ by PH Office 2, LLC (\"Landlord\"} and Duracell Distributing, Inc. (\"Tenant\"), pursuant to Section 1 of the Lease Agreement (\"Lease\"} dated ___, __ , 2015, executed by Landlord and Tenant. All terms used herein have the same meanings as in the Lease. This memorandum amends the Lease (including the Basic Lease Information) to the extent of the matters set forth herein. 1. The Commencement Date is __~_, 2016. 2. The Premises contain 3,094 rentable square feet of area. 3. The Building contains 226,469 rentable square feet. 4. Tenant's Proportionate Share is 1.37%. LANDLORD: TENANT: PH OFFICE 2, LLC THE GILLETTE COMPANY By: _________ _ By: ____ ______ _ Name:·----------- Name: ____ ______ _ Title: _ _________ _ Title: ____ ______ _",
                  "landlord": "PH Office 2, LLC",
                  "tenant": "Duracell Distributing, Inc.",
                  "leaseReference": {
                      "section": "Section 1",
                      "leaseDate": null
                  },
                  "commencementDate": null,
                  "premisesRentableSqFt": 3094,
                  "buildingRentableSqFt": 226469,
                  "tenantProportionateShare": 1.37,
                  "tables": [
                      {
                          "id": 1,
                          "header": [
                              "This",
                              "memorandum",
                              "is",
                              "entered",
                              "into",
                              "on",
                              "______",
                              ",",
                              "20_",
                              "by",
                              "PH",
                              "Office",
                              "2,",
                              "LLC",
                              "(\"Landlord\"}"
                          ],
                          "rows": [
                              [
                                  "and",
                                  "Duracell",
                                  "Distributing,",
                                  "Inc.",
                                  "(\"Tenant\"),",
                                  "pursuant",
                                  "to",
                                  "Section",
                                  "1",
                                  "of",
                                  "the",
                                  "Lease",
                                  "Agreement",
                                  "(\"Lease\"}",
                                  "dated"
                              ],
                              [
                                  "__",
                                  "_,",
                                  "__",
                                  ",",
                                  "2015,",
                                  "executed",
                                  "by",
                                  "Landlord",
                                  "and",
                                  "Tenant.",
                                  "All",
                                  "terms",
                                  "used",
                                  "herein",
                                  "have",
                                  "the",
                                  "same",
                                  "meanings",
                                  "as"
                              ],
                              [
                                  "in",
                                  "the",
                                  "Lease.",
                                  "This",
                                  "memorandum",
                                  "amends",
                                  "the",
                                  "Lease",
                                  "(including",
                                  "the",
                                  "Basic",
                                  "Lease",
                                  "Information)",
                                  "to",
                                  "the",
                                  "extent"
                              ],
                              [
                                  "of",
                                  "the",
                                  "matters",
                                  "set",
                                  "forth",
                                  "herein."
                              ]
                          ]
                      },
                      {
                          "id": 2,
                          "header": [
                              "The",
                              "Commencement",
                              "Date",
                              "is",
                              "__",
                              "~_,",
                              "2016."
                          ],
                          "rows": [
                              [
                                  "1."
                              ]
                          ]
                      },
                      {
                          "id": 3,
                          "header": [
                              "THE",
                              "GILLETTE",
                              "COMPANY"
                          ],
                          "rows": [
                              [
                                  "PH",
                                  "OFFICE",
                                  "2,",
                                  "LLC"
                              ]
                          ]
                      },
                      {
                          "id": 4,
                          "header": [
                              "By:",
                              "_______",
                              "_",
                              "By:",
                              "____",
                              "______",
                              "_"
                          ],
                          "rows": [
                              [
                                  "Name:",
                                  "____",
                                  "______",
                                  "_"
                              ]
                          ]
                      },
                      {
                          "id": 5,
                          "header": [
                              "·-",
                              "----------"
                          ],
                          "rows": [
                              [
                                  "Title:",
                                  "____",
                                  "______",
                                  "_"
                              ],
                              [
                                  "Title:",
                                  "_",
                                  "_________",
                                  "_"
                              ]
                          ]
                      }
                  ],
                  "sectionTitle": "EXHIBIT D - MEMORANDUM OF ACCEPTANCE OF DELIVERY OF PREMISE",
                  "textContent": "CAM clause details extracted from the lease.",
                  "executionClause": "CAM clause details extracted from the lease.",
                  "citations": [
                      "Page 39"
                  ]
              }
          },
          "info": {
              "leaseInformation": {
                  "lease": {
                      "value": "Lease Agreement",
                      "citation": "Page 1",
                      "amendments": []
                  },
                  "property": {
                      "value": "5100 W. J.B. Hunt Drive, Suite 600, Rogers, Arkansas 72758",
                      "citation": "Page 2",
                      "amendments": []
                  },
                  "leaseFrom": {
                      "value": "PH Office 2, LLC, an Arkansas limited liability company",
                      "citation": "Page 1",
                      "amendments": []
                  },
                  "leaseTo": {
                      "value": "The Gillette Company, a Delaware corporation",
                      "citation": "Page 1",
                      "amendments": []
                  },
                  "squareFeet": {
                      "value": "2,654 usable sq ft / 3,094 rentable sq ft",
                      "citation": "Page 2",
                      "amendments": []
                  },
                  "baseRent": {
                      "value": "$25.00 per rentable square foot per year (first year) with 2% annual increase thereafter",
                      "citation": "Page 3",
                      "amendments": []
                  },
                  "securityDeposit": {
                      "value": "200",
                      "citation": "Page 3",
                      "amendments": []
                  },
                  "renewalOptions": {
                      "value": "Two (2) additional three (3) year renewal terms, each with rent based on Fair Market Value; Tenant must give written notice at least 120 days prior to expiration of the Primary Term or any Renewal Term",
                      "citation": "Page 4",
                      "amendments": []
                  }
              }
          },
          "space": {
              "space": {
                  "unit": {
                      "value": "",
                      "citation": "",
                      "amendments": []
                  },
                  "building": {
                      "value": "Hunt Tower",
                      "citation": "page 2",
                      "amendments": []
                  },
                  "premises": {
                      "value": "6th floor, Suite 600, 5100 W. J.B. Hunt Drive, Rogers, Arkansas 72758",
                      "citation": "page 2",
                      "amendments": []
                  },
                  "zipCode": {
                      "value": "72758",
                      "citation": "page 2",
                      "amendments": []
                  },
                  "city": {
                      "value": "Rogers",
                      "citation": "page 2",
                      "amendments": []
                  },
                  "state": {
                      "value": "Arkansas",
                      "citation": "page 2",
                      "amendments": []
                  },
                  "areaRentable": {
                      "value": "3,094 rentable square feet",
                      "citation": "page 2",
                      "amendments": []
                  },
                  "areaUsable": {
                      "value": "2,654 usable square feet",
                      "citation": "page 2",
                      "amendments": []
                  },
                  "commonArea": {
                      "value": "",
                      "citation": "",
                      "amendments": []
                  },
                  "parking": {
                      "type": {
                          "value": "spaces",
                          "citation": "page 20",
                          "amendments": []
                      },
                      "value": {
                          "value": "5 parking spaces per 1,000 rentable square feet (no charge)",
                          "citation": "page 20",
                          "amendments": []
                      }
                  },
                  "storageArea": {
                      "value": "",
                      "citation": "",
                      "amendments": []
                  },
                  "status": {
                      "value": "Occupied",
                      "citation": "",
                      "amendments": []
                  },
                  "notes": {
                      "value": "Early Access Period of 45 days prior to Commencement Date; Base Rent $25.00 per rentable sq ft, escalating 2% annually; Tenant Improvement Allowance $60 per rentable sq ft; Tenant has right of first refusal for adjacent space; Smoking prohibited within 25 ft of building; Various building rules and regulations apply.",
                      "citation": "pages 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39",
                      "amendments": []
                  }
              }
          },
          "charge-schedules": {
              "chargeSchedules": {
                  "baseRent": [
                      {
                          "period": {
                              "value": "Months 1-2",
                              "citation": "page 8"
                          },
                          "dateFrom": {
                              "value": "",
                              "citation": ""
                          },
                          "dateTo": {
                              "value": "",
                              "citation": ""
                          },
                          "monthlyAmount": {
                              "value": "$5.00",
                              "citation": "page 8"
                          },
                          "annualAmount": {
                              "value": "$0.00",
                              "citation": "page 8"
                          },
                          "areaRentable": {
                              "value": "3,094 sqft",
                              "citation": "page 2"
                          },
                          "amendments": []
                      },
                      {
                          "period": {
                              "value": "Months 3-14",
                              "citation": "page 8"
                          },
                          "dateFrom": {
                              "value": "",
                              "citation": ""
                          },
                          "dateTo": {
                              "value": "",
                              "citation": ""
                          },
                          "monthlyAmount": {
                              "value": "$6,445.83",
                              "citation": "page 8"
                          },
                          "annualAmount": {
                              "value": "$25.00 per rentable sq ft",
                              "citation": "page 8"
                          },
                          "areaRentable": {
                              "value": "3,094 sqft",
                              "citation": "page 2"
                          },
                          "amendments": []
                      },
                      {
                          "period": {
                              "value": "Months 15-26",
                              "citation": "page 8"
                          },
                          "dateFrom": {
                              "value": "",
                              "citation": ""
                          },
                          "dateTo": {
                              "value": "",
                              "citation": ""
                          },
                          "monthlyAmount": {
                              "value": "$6,574.75",
                              "citation": "page 8"
                          },
                          "annualAmount": {
                              "value": "$25.50 per rentable sq ft",
                              "citation": "page 8"
                          },
                          "areaRentable": {
                              "value": "3,094 sqft",
                              "citation": "page 2"
                          },
                          "amendments": []
                      },
                      {
                          "period": {
                              "value": "Months 27-38",
                              "citation": "page 8"
                          },
                          "dateFrom": {
                              "value": "",
                              "citation": ""
                          },
                          "dateTo": {
                              "value": "",
                              "citation": ""
                          },
                          "monthlyAmount": {
                              "value": "$6,706.25",
                              "citation": "page 8"
                          },
                          "annualAmount": {
                              "value": "$26.01 per rentable sq ft",
                              "citation": "page 8"
                          },
                          "areaRentable": {
                              "value": "3,094 sqft",
                              "citation": "page 2"
                          },
                          "amendments": []
                      },
                      {
                          "period": {
                              "value": "Months 39-50",
                              "citation": "page 8"
                          },
                          "dateFrom": {
                              "value": "",
                              "citation": ""
                          },
                          "dateTo": {
                              "value": "",
                              "citation": ""
                          },
                          "monthlyAmount": {
                              "value": "$6,840.32",
                              "citation": "page 8"
                          },
                          "annualAmount": {
                              "value": "$26.53 per rentable sq ft",
                              "citation": "page 8"
                          },
                          "areaRentable": {
                              "value": "3,094 sqft",
                              "citation": "page 2"
                          },
                          "amendments": []
                      },
                      {
                          "period": {
                              "value": "Months 51-62",
                              "citation": "page 8"
                          },
                          "dateFrom": {
                              "value": "",
                              "citation": ""
                          },
                          "dateTo": {
                              "value": "",
                              "citation": ""
                          },
                          "monthlyAmount": {
                              "value": "$6,976.97",
                              "citation": "page 8"
                          },
                          "annualAmount": {
                              "value": "$27.06 per rentable sq ft",
                              "citation": "page 8"
                          },
                          "areaRentable": {
                              "value": "3,094 sqft",
                              "citation": "page 2"
                          },
                          "amendments": []
                      }
                  ],
                  "lateFee": {
                      "calculationType": {
                          "value": "Percentage of overdue amount",
                          "citation": "page 8",
                          "amendments": []
                      },
                      "graceDays": {
                          "value": "5 business days after notice",
                          "citation": "page 8",
                          "amendments": []
                      },
                      "percent": {
                          "value": "5%",
                          "citation": "page 8",
                          "amendments": []
                      },
                      "secondFeeCalculationType": {
                          "value": "",
                          "citation": "",
                          "amendments": []
                      },
                      "secondFeeGrace": {
                          "value": "",
                          "citation": "",
                          "amendments": []
                      },
                      "secondFeePercent": {
                          "value": "",
                          "citation": "",
                          "amendments": []
                      },
                      "perDayFee": {
                          "value": "",
                          "citation": "",
                          "amendments": []
                      }
                  }
              }
          },
          "misc": {
              "otherLeaseProvisions": {
                  "operatingExpenses": {
                      "synopsis": {
                          "value": "Operating Expenses incurred during the lease term that exceed the OPEX Base Year (2017) are passed through to tenants on a prorated basis. Tenant’s share is 1.37%. Capital improvements are excluded unless they directly reduce Tenant’s expenses, in which case they are amortized over their useful life.",
                          "citation": "Pages 8‑9, 10‑11",
                          "amendments": []
                      },
                      "definition": {
                          "value": "\"Operating Expenses\" means the actual ordinary and reasonable costs incurred by Landlord for the operation, maintenance, repair, replacement, restoration or operation of the Property, including utilities, heating, air‑conditioning, lighting, security, etc., subject to the exclusions listed in the clause.",
                          "citation": "Pages 8‑9",
                          "amendments": []
                      },
                      "keyParameters": {
                          "value": "OPEX Base Year: 2017; Tenant’s Proportionate Share: 1.37%; Exclusions: capital improvements, casualty repairs, interest, depreciation, leasing commissions, legal fees, hazardous‑material remediation, etc.; Capital improvement amortization: straight‑line over useful life.",
                          "citation": "Pages 8‑9, 10‑11",
                          "amendments": []
                      },
                      "billingTimeline": {
                          "value": "Landlord provides an annual statement within 180 days after year‑end; Tenant pays Tenant’s Proportionate Share of any increase as Additional Rent; payments are due in lump sum upon receipt of the statement.",
                          "citation": "Page 9",
                          "amendments": []
                      },
                      "formulas": {
                          "value": "Tenant’s Share = (Tenant Rentable Sq ft ÷ Building Total Rentable Sq ft) × 100 = 1.37%; Capital improvement amortization = Cost ÷ Useful Life (straight‑line).",
                          "citation": "Pages 8‑9",
                          "amendments": []
                      },
                      "capitalRules": {
                          "value": "Capital improvements are not passed through unless they directly reduce Tenant’s Operating Expenses; such costs are amortized on a straight‑line basis over their useful life per generally accepted accounting principles.",
                          "citation": "Pages 9‑10",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“Operating Expenses (as defined herein) incurred in any year during the lease term which exceed the operating expenses on the Property for the calendar year of 2017 the ‘OPEX Base Year’ will be passed through to the Building tenants on a prorata basis… Notwithstanding the foregoing, Tenant shall not be responsible for the cost of any capital improvements or replacements unless such improvements or replacements directly reduce Tenant’s Operating Expenses, in which event such costs shall be amortized on a straight‑line basis over their useful life… The term ‘Operating Expenses’ as used herein means the actual ordinary and reasonable costs and expenses incurred by or on behalf of Landlord… Notwithstanding the foregoing, Tenant shall not be responsible for the cost of any capital improvements…”.",
                          "citation": "Pages 8‑11",
                          "amendments": []
                      }
                  },
                  "repairsAndMaintenance": {
                      "synopsis": {
                          "value": "Landlord is responsible for structural components, roof, foundation, exterior walls, common areas and building systems, and for repairs not caused by Tenant’s negligence. Tenant must maintain the usable premises, perform interior repairs, and is liable for damage caused by its use. Landlord may charge $50 per hour (minimum one hour) for tenant‑requested maintenance.",
                          "citation": "Pages 5‑6, 7‑8",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "Landlord shall make all repairs and replacements to the Building (including roof, foundation, exterior walls, structural components, common areas, grounds, parking lots, windows, and Building Systems) except for repairs and replacements that Tenant must make as expressly set forth in the Lease. Tenant shall maintain all parts of the usable Premises in good, clean, sanitary condition and promptly make all necessary repairs and replacements to the usable Premises. Tenant shall also repair any damage to the Premises or the Building caused by Tenant’s negligence or willful misconduct. Landlord may charge $50.00 per hour (minimum one hour) for maintenance personnel when Tenant requests repairs that are Tenant’s responsibility.",
                          "citation": "Pages 5‑8",
                          "amendments": []
                      }
                  },
                  "alterations": {
                      "synopsis": {
                          "value": "Tenant may not make any alterations, additions or improvements without prior written consent of Landlord, which shall not be unreasonably withheld. Non‑structural alterations up to $10,000 may be performed without prior consent. All alterations become Tenant’s property and must be removed at lease end, with the Premises restored to its original condition.",
                          "citation": "Pages 12‑13",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“Tenant shall not make any alterations, additions or improvements to the Premises without the prior written consent of Landlord, which consent shall not be unreasonably withheld. Tenant may, without Landlord’s prior written consent, perform non‑structural alterations and/or erect such shelves, machinery and trade fixtures as it desires provided that: (i) such items do not alter the basic character of the Premises…; (v) such alterations, additions or improvements do not exceed ten thousand dollars ($10,000.00). All alterations, additions, improvements and partitions erected by Tenant shall be and remain the property of Tenant during the Term of this Lease… All alterations… shall be removed on or before the earlier to occur of the date of termination of this Lease or vacating of the Premises by Tenant, at which time Tenant shall repair any damage caused by such removal.”",
                          "citation": "Pages 12‑13",
                          "amendments": []
                      }
                  },
                  "signs": {
                      "synopsis": {
                          "value": "Tenant may install signage displaying its corporate name and logo at its own expense, subject to applicable laws and landlord’s standards. Additional signage requires landlord’s prior written approval. Tenant must remove all signage and repair the building fascia at lease termination.",
                          "citation": "Pages 13‑14",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“During the Term of this Lease, Tenant shall be permitted, at Tenant’s cost and expense, to install and display signage containing Tenant’s corporate name and logo, provided that such signage shall comply with all applicable laws… Upon the expiration or earlier termination of this Lease, Tenant shall, at its sole cost and expense, remove such signage and in a good and workmanlike manner, restore the area containing such signage to the condition existing immediately prior to the installation of the signage. Tenant shall affix and maintain a sign… containing Tenant’s corporate name and logo adjacent to the entry door of the Premises. Landlord shall maintain a directory strip listing Tenant’s name in the lobby directory of the Building. Any additional signage… shall be subject to Landlord’s prior written approval, such approval not to be unreasonably withheld. Tenant shall repair, paint, and/or replace the Building façade surface to which its signs are attached upon vacation of the Premises.”",
                          "citation": "Pages 13‑14",
                          "amendments": []
                      }
                  },
                  "services": {
                      "synopsis": {
                          "value": "Landlord provides hot and cold water, temperature‑controlled HVAC (68‑72 °F) during business hours, optional after‑hours override, janitorial services (if requested) at Tenant’s expense, electrical lighting, and building‑wide heating, ventilation, air‑conditioning and related services.",
                          "citation": "Pages 14‑15",
                          "amendments": []
                      },
                      "keyParameters": {
                          "value": "Water: hot and cold; HVAC: 68‑72 °F, 7 am‑6 pm Mon‑Fri, 8 am‑12 pm Sat; After‑hours HVAC override: two‑hour intervals, no extra charge; Janitorial services: tenant‑paid if requested; Electrical lighting: provided by Landlord; Elevator service: 24/7.",
                          "citation": "Pages 14‑15",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“Landlord shall furnish Tenant while occupying premises the following services on all days except as otherwise stated: (a) Hot and cold water… (b) Heating and air conditioning (collectively referred to as ‘Temperature Control’), when necessary in Landlord’s reasonable judgment, for normal comfort between 68 and 72 degrees Fahrenheit… Tenant may request after‑hours temperature control… (c) At an additional expense to Tenant, and only if requested by Tenant, janitorial services may be arranged by Landlord… (d) Electrical current for standard Building lighting fixtures provided by Landlord… (e) Electrical lighting services and heating and air conditioning for all public areas and special service areas of Building… (D) Passenger elevator service in common with Landlord and other Tenants, twenty‑four hours, seven days a week.”",
                          "citation": "Pages 14‑15",
                          "amendments": []
                      }
                  },
                  "insurance": {
                      "synopsis": {
                          "value": "Landlord maintains all‑risk property insurance covering the Building at 100 % of replacement cost and commercial general liability insurance. Tenant maintains workers’ compensation, comprehensive general liability ($2 M property, $4 M per occurrence for personal injury), and fire/extended coverage for its improvements, naming Landlord as additional insured.",
                          "citation": "Pages 15‑16",
                          "amendments": []
                      },
                      "keyParameters": {
                          "value": "Landlord: All‑risk property insurance, 100 % replacement cost, commercial general liability (reasonable limits). Tenant: Workers’ compensation; Comprehensive general liability – $2 M property, $4 M per occurrence for personal injury; Fire and extended coverage for tenant improvements; Policies to name Landlord as additional insured and be assignable to Landlord’s mortgagee.",
                          "citation": "Pages 15‑16",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“Landlord shall (i) maintain ‘all risk’ general liability and property insurance covering the Building… in an amount not less than one hundred percent (100%) of the full ‘replacement cost’ thereof… and (ii) maintain commercial general liability insurance with reasonable limits of coverage. Tenant, at its own expense, shall maintain during the Term of this Lease a policy or policies of worker’s compensation and comprehensive general liability insurance, including personal injury and property damage, in the amount of Two Million Dollars ($2,000,000.00) for property damage and Four Million Dollars ($4,000,000.00) per occurrence for personal injuries… Tenant, at its own expense, also shall maintain… fire and extended coverage insurance covering the replacement cost of all Tenant Improvements within the Premises. Said policies shall (i) name Landlord as an additional insured, (ii) be issued by an insurance company licensed to do business in the state where the Building is located, (iii) provide that said insurance shall not be canceled unless thirty (30) days prior written notice shall have been given to Landlord.”",
                          "citation": "Pages 15‑16",
                          "amendments": []
                      }
                  },
                  "casualty": {
                      "synopsis": {
                          "value": "If the Premises are damaged or destroyed by fire or other peril, Tenant must give written notice. If damage prevents use or repairs exceed 120 days, the Lease terminates and rent is abated. If repairs are completed within 120 days, Landlord restores the Premises and rent is reduced proportionally. If damage equals or exceeds 30 % of usable space or occurs within six (6) months of lease end, Tenant may terminate the Lease with rent abated proportionally.",
                          "citation": "Pages 16‑17",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“A. If the Premises should be damaged or destroyed by fire or other peril, Tenant immediately shall give written notice to Landlord. If the Building… should be totally destroyed, or if they should be so damaged thereby that… rebuilding or repairs cannot be completed within one hundred twenty (120) days after the first date of such damage, this Lease shall terminate… and the rent shall be abated during the unexpired portion of this Lease. B. Except as provided in Section 11C… if the Building… should be damaged… and rebuilding… can be substantially completed within one hundred twenty (120) days… the Lease shall not terminate, and Landlord shall restore the Premises to the level of Building standard finishes. … If 30 % or more of the usable space is damaged… or the casualty occurs within six (6) months of the end of the Term, then Tenant may terminate this Lease… and the rent shall be abated during the unexpired portion of this Lease.”",
                          "citation": "Pages 16‑17",
                          "amendments": []
                      }
                  },
                  "liabilityAndIndemnification": {
                      "synopsis": {
                          "value": "Landlord indemnifies Tenant against all claims, suits, losses, damages, costs and attorney’s fees arising from Landlord’s negligence, except for claims caused by Tenant’s negligence. Tenant indemnifies Landlord similarly. Both parties waive consequential, indirect and punitive damages and agree that indemnity obligations survive lease termination.",
                          "citation": "Pages 16‑18",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“EXCEPT FOR ANY CLAIMS, RIGHTS OF RECOVERY AND CAUSES OF ACTION THAT TENANT HAS RELEASED, LANDLORD SHALL INDEMNIFY, PROTECT, HOLD HARMLESS AND DEFEND TENANT… FOR ANY INJURY OR DAMAGE TO ANY PROPERTY OR PERSON… CAUSED BY NEGLIGENCE OR WILLFUL MISCONDUCT OF LANDLORD… UNLESS THE INDEMNIFIED LOSS IS CAUSED WHOLLY OR IN PART BY TENANT'S NEGLIGENCE… The parties also agree that neither shall be liable for consequential, indirect or punitive damages, and that the indemnity provisions shall survive the expiration or termination of this Lease.”",
                          "citation": "Pages 16‑18",
                          "amendments": []
                      }
                  },
                  "use": {
                      "synopsis": {
                          "value": "Premises shall be used only for Tenant’s business offices and other lawful purposes. No storage of trucks or vehicles without Landlord’s consent. No hazardous or explosive materials except limited office supplies. No smoking within 25 feet of the Building. Tenant must comply with all applicable laws, building rules, and must not cause odors, noise or other nuisances.",
                          "citation": "Pages 17‑18, 36‑38",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“The Premises shall be used only for Tenant’s business offices affiliated with Tenant’s services and for such other lawful purposes as may be incidental thereto… Outside storage, including without limitation, storage of trucks and other vehicles is prohibited without Landlord’s prior written consent… Tenant shall never incorporate into, or dispose of, at, in or under the Premises… any toxic or hazardous materials… Tenant shall not permit any objectionable or unpleasant odors, smoke, dust, gas, noise or vibrations to emanate from the Premises… SMOKING IS NOT PERMITTED IN THE PREMISES OR WITHIN 25 FEET OF THE BUILDING.”",
                          "citation": "Pages 17‑18, 36‑38",
                          "amendments": []
                      }
                  },
                  "landlordsRightOfEntry": {
                      "synopsis": {
                          "value": "Landlord may enter the Premises at any time without notice in an emergency, and with reasonable notice (at least two business days) to show the Premises to prospective purchasers or lenders during the final three months of the lease term.",
                          "citation": "Pages 18‑19",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“Landlord shall have the right to enter the Premises at any time, without notice to Tenant, in case of an emergency posing a threat to persons or property. During the period that is three (3) months prior to the end of the Lease Term, upon telephonic notice to Tenant delivered at least two business days in advance, Landlord and Landlord's representatives may enter the Premises during business hours for the purpose of showing the Premises.”",
                          "citation": "Pages 18‑19",
                          "amendments": []
                      }
                  },
                  "assignmentAndSubletting": {
                      "synopsis": {
                          "value": "Tenant may not assign or sublease without Landlord’s prior written consent, which shall not be unreasonably withheld. If a subtenant pays more than Base Rent, Tenant must pay 50 % of the excess to Landlord. Bankruptcy assignments are permitted under specified conditions. Permitted transferees for P&G subsidiary and Duracell transfer are allowed without Landlord consent.",
                          "citation": "Pages 18‑20, 21‑22",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“Tenant shall not assign this Lease or sublease all or any part of the Premises without Landlord’s prior written approval or consent, which shall not be unreasonably withheld or delayed. In the event that the Tenant receives rent from a subtenant that is greater than the Base Rent, Tenant is obligated to pay fifty percent (50%) of any amount greater than the Base Rent to the Landlord within thirty (30) days of receipt. If this Lease is assigned to any person or entity pursuant to the provisions of the United States Bankruptcy Code… the consideration shall be paid to Landlord… Tenant may assign its rights under this Lease to certain Permitted Transferees (successor corporation, purchaser of assets, or affiliate) without Landlord’s consent. Landlord also agrees that Tenant may assign this Lease to The Duracell Company… without Landlord’s consent (the “Preapproved Transfer”).”",
                          "citation": "Pages 18‑22",
                          "amendments": []
                      }
                  },
                  "parking": {
                      "synopsis": {
                          "value": "Tenant is entitled to at least five (5) parking spaces per 1,000 rentable square feet of the Premises at no charge during the lease term.",
                          "citation": "Page 20",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“Parking is shared in the Building's parking lot with other tenants of the Building; however, Landlord confirms that Tenant shall be entitled to the use of not less than five (5) parking spaces per 1,000 rentable square feet of the Premises at no charge to Tenant during the Term of this Lease.”",
                          "citation": "Page 20",
                          "amendments": []
                      }
                  },
                  "condemnation": {
                      "synopsis": {
                          "value": "If any part of the Premises is taken by eminent domain or other governmental taking that interferes with the Premises’ use, the Lease terminates and rent is abated. If the taking does not materially interfere, rent is reduced proportionally and Landlord restores the remaining portion. Compensation from the taking belongs to Landlord; Tenant assigns any interest to Landlord.",
                          "citation": "Page 20",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“If any part of the Premises are taken for any public or quasi‑public use… and the taking prevents or materially interferes with the use of the Premises… this Lease shall terminate and the rent shall be abated… If such taking does not materially interfere… the rent payable… shall be reduced to such extent as may be fair and reasonable… All compensation awarded… shall be the property of Landlord, and Tenant hereby assigns any interest in any such award to Landlord.”",
                          "citation": "Page 20",
                          "amendments": []
                      }
                  },
                  "holdover": {
                      "synopsis": {
                          "value": "If Tenant holds over after lease expiration, Landlord may treat the tenancy as a month‑to‑month tenancy with rent at 150 % of the prior Base Rent, or as a tenancy at sufferance with the same rent. If holdover exceeds two (2) months, Tenant must pay Landlord all damages, including loss of subsequent tenants.",
                          "citation": "Pages 20‑21",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“If Tenant retains possession… then Landlord may, at its option, serve written notice… that such holding over constitutes either (i) the creation of a month‑to‑month tenancy… or (ii) creation of a tenancy at sufferance… provided, however, that the Base Rent… shall be equal to one hundred fifty percent (150%) of the Base Rent being paid monthly to Landlord… If no such notice is served, then a tenancy at sufferance shall be deemed to be created… If such holding over by Tenant extends more than two (2) months after the date of Lease termination, Tenant shall also pay to Landlord all damages sustained by Landlord resulting from retention of possession by Tenant.”",
                          "citation": "Pages 20‑21",
                          "amendments": []
                      }
                  },
                  "quietEnjoyment": {
                      "synopsis": {
                          "value": "Tenant shall have quiet enjoyment of the Premises without interference or hindrance from Landlord or anyone claiming through Landlord.",
                          "citation": "Page 21",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“Landlord has the authority to enter into this Lease and so long as Tenant pays all amounts due hereunder and performs all other covenants and agreements herein set forth, Tenant shall peaceably and quietly have, hold and enjoy the Premises for the Term hereof without hindrance from Landlord or anyone claiming through Landlord, subject to the provisions of this Lease.”",
                          "citation": "Page 21",
                          "amendments": []
                      }
                  },
                  "defaultAndRemedies": {
                      "synopsis": {
                          "value": "Events of default include failure to pay Base Rent within five (5) business days after notice, insolvency, bankruptcy, or other specified events. Landlord’s remedies include termination, acceleration of rent, re‑entry, re‑letting, and recovery of damages, including liquidated damages based on the difference between remaining rent and fair market value.",
                          "citation": "Pages 21‑22",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“A. Tenant shall fail to pay any installment of the Base Rent when due… and such failure shall continue for a period of five (5) business days after the date of Tenant’s receipt of Landlord’s written notice… B. The Tenant or any guarantor… shall become insolvent… C. The concurrence of both… (a) any case… seeking an order for relief… (b) such case results in an order for relief… not stayed… The following events… each shall be deemed to be an event of default by Tenant… Landlord shall have the option to pursue any one or more of the following remedies… (1) Terminate this Lease… (2) If the Event of Default relates to non‑payment of Base Rent… terminate this Lease… (3) Enter upon and take possession… (4) Do whatever Tenant is obligated to do… (5) Require Tenant to pay any rental in advance of each month….”",
                          "citation": "Pages 21‑22",
                          "amendments": []
                      }
                  },
                  "subordination": {
                      "synopsis": {
                          "value": "The Lease is subordinate to any existing or future mortgages, deeds of trust or other liens, unless a mortgagee elects to make the Lease superior. Future subordination is subject to the mortgagee agreeing not to disturb Tenant’s rights.",
                          "citation": "Pages 24‑25",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“Tenant accepts this Lease subject and subordinate to any mortgages and/or deeds of trust now or at any time hereafter constituting a lien… provided, however, that if the mortgagee… elects to have Tenant’s interest in this Lease superior to any such instrument, then by notice to Tenant… this Lease shall be deemed superior… Notwithstanding the foregoing, the automatic subordination of this Lease to any future mortgages… shall be subject to the Mortgagee agreeing to not disturb Tenant’s rights….”",
                          "citation": "Pages 24‑25",
                          "amendments": []
                      }
                  },
                  "liens": {
                      "synopsis": {
                          "value": "Tenant has no authority to create or place any lien or encumbrance on the Premises. Tenant must pay all sums due for labor and materials and hold Landlord harmless from any claims. Tenant must give Landlord immediate written notice of any lien filed against the Premises.",
                          "citation": "Page 24",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“Tenant has no authority, express or implied, to create or place any lien or encumbrance… Tenant covenants and agrees that it will pay or cause to be paid all sums legally due… and that it will save and hold Landlord harmless from any and all loss, cost or expense based on or arising out of asserted claims or liens… Tenant agrees to give Landlord immediate written notice of the placing of any lien or encumbrance against the Premises.”",
                          "citation": "Page 24",
                          "amendments": []
                      }
                  },
                  "hazardousMaterials": {
                      "synopsis": {
                          "value": "Tenant shall not bring, store or dispose of toxic or hazardous materials, except limited office supplies and kitchen cleaning materials (≤1 gallon containers, properly labeled). Tenant must notify Landlord of any spills and allow Landlord to require reasonable changes to cleanup methods. Landlord represents the Property is free of hazardous materials, but if hazardous materials are later discovered not caused by Tenant, Landlord bears the cost.",
                          "citation": "Pages 24‑25, 26‑27",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“Tenant shall never incorporate into, or dispose of, at, in or under the Premises… any toxic or hazardous materials… Tenant further agrees not to use… unless such materials are either (a) office supplies or (b) kitchen cleaning materials… purchased in a container not larger than one (1) gallon and properly labeled… In the event there is a spill of a toxic or hazardous material… Tenant shall notify Landlord… Landlord shall have the right to require reasonable changes in such method… Landlord represents and warrants that to its knowledge the Property is free from any toxic or hazardous materials… If toxic or hazardous materials are discovered… which was not caused by Tenant… the Landlord will be liable for all costs and expenses associated with regulatory requirements to eliminate such problems.”",
                          "citation": "Pages 24‑27",
                          "amendments": []
                      }
                  },
                  "rulesAndRegulations": {
                      "synopsis": {
                          "value": "Landlord provides all locks, maintains an alphabetical tenant directory, restricts use of the building name, controls signage, requires landlord approval for contractors, limits movement of furniture to designated hours, and indemnifies Tenant for movement‑related damages. Landlord is not responsible for lost or stolen property.",
                          "citation": "Pages 35‑36",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“1. Landlord shall provide all locks for doors in Tenant’s leased area… 2. Landlord will provide and maintain in the lobby… an alphabetical directory of the tenants… 3. The Tenant shall not use the name of the Building… without Landlord’s prior written consent… 4. No signs will be allowed on windows… or on exterior identification pylons… All such signs in common areas as requested by Tenant will be contracted for by Landlord… 5. Tenant will refer all contractors… to Landlord for supervision, approval and control… 6. Movement into or out of the Building of furniture… shall be restricted to hours designated by Landlord… All such movement shall be under supervision of Landlord… Tenant shall assume all risk for damage… Landlord shall not be responsible for lost or stolen property, equipment, money or jewelry from the Premises or public areas.”",
                          "citation": "Pages 35‑36",
                          "amendments": []
                      }
                  },
                  "brokerage": {
                      "synopsis": {
                          "value": "Both parties represent that no brokerage commissions or finder's fees have been incurred except for the brokers identified herein. Sage Partners and Jones Lang LaSalle represent Tenant; Pinnacle Realty Group represents Landlord. Landlord will pay its brokers.",
                          "citation": "Page 26",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“Tenant and Landlord represent and warrant to each other that neither has incurred liabilities or claims for brokerage commissions or finder's fees… Sage Partners in conjunction with Jones Lang LaSalle represent Tenant… Pinnacle Realty Group represents Landlord… Landlord shall pay the costs of the brokers identified in this Article 27 pursuant to a separate agreement.”",
                          "citation": "Page 26",
                          "amendments": []
                      }
                  },
                  "estoppel": {
                      "synopsis": {
                          "value": "Within thirty (30) days after a written request by Landlord, Tenant must deliver an estoppel certificate stating that the Lease is in full force, rent is current, there are no defaults, no offsets, and confirming any other factual matters as requested.",
                          "citation": "Page 28",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“Tenant agrees, from time to time, within thirty (30) days after request by Landlord, to deliver to Landlord or Landlord’s designee, a certificate of occupancy and an estoppel certificate stating (1) that this Lease is in full force and effect, (2) the date to which rent is paid, (3) that there is no default on the part of Landlord or Tenant, (4) that Tenant does not have any right of offset, claims or defenses to the performance of its obligations, and (5) such other factual matters pertaining to this Lease as may be requested by Landlord.”",
                          "citation": "Page 28",
                          "amendments": []
                      }
                  },
                  "notices": {
                      "synopsis": {
                          "value": "All notices must be delivered to the addresses set forth in the Basic Lease Information, either by personal delivery, nationally recognized overnight carrier, or certified mail with return receipt. Notices are effective upon delivery or upon refusal as shown by carrier records.",
                          "citation": "Page 29",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“All written notice or document required or permitted to be delivered hereunder shall be in writing and shall be personally delivered or sent by nationally recognized overnight carrier… or by certified mail, return receipt requested, postage prepaid, addressed to the parties at the respective addresses set out in the Basic Lease Information… All notices shall be effective upon delivery or upon refusal of an attempted delivery as shown by the carrier’s records.”",
                          "citation": "Page 29",
                          "amendments": []
                      }
                  },
                  "rightOfFirstRefusalOffer": {
                      "synopsis": {
                          "value": "Tenant has a first right of refusal on adjacent space on the 6th floor that becomes available during the lease term. Tenant must notify Landlord within ten (10) business days of a bona‑fide offer. Rental rate mirrors current rate; improvement allowance is prorated.",
                          "citation": "Page 30",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“Tenant shall have a first right of refusal on adjacent space on the sixth (6th) floor that is available or becomes available during the Lease Term (‘First Refusal Space’). If Landlord receives a bona fide offer… Landlord shall notify Tenant and offer the First Refusal Space to Tenant… Tenant shall have 10 business days from the date of Landlord’s notice to notify Landlord of its intent to take the First Refusal Space… The rental rate on the First Refusal Space will mirror the then current rental rate under this Lease and the Term will run concurrently with the Term of this Lease. The Improvement Allowance amount shall be pro‑rated to reflect the remaining lease term.”",
                          "citation": "Page 30",
                          "amendments": []
                      }
                  },
                  "expansionAndRelocation": {
                      "synopsis": {
                          "value": "The Right of First Refusal also provides Tenant the opportunity to expand into the First Refusal Space, with rent and improvement allowance terms as described in the Right of First Refusal clause.",
                          "citation": "Page 30",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "Same as Right of First Refusal clause (see page 30).",
                          "citation": "Page 30",
                          "amendments": []
                      }
                  },
                  "landlordDefault": {
                      "synopsis": {
                          "value": "If Landlord fails to cure any breach of its obligations within thirty (30) days after written notice from Tenant, such failure constitutes a Landlord Default. Tenant may, at its election, cure the default and offset related costs against rent.",
                          "citation": "Page 23",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“If Landlord fails to perform any of its obligations hereunder within thirty (30) days after written notice from Tenant… such failure shall be deemed to be an event of default by Landlord (a ‘Landlord Default’). Unless and until Landlord cures any default after such notice, Tenant shall not have any remedy… Tenant may, at its election, cure such Landlord Default and offset the amounts owed against monthly installments of Base Rent and Additional Rent due from Tenant to Landlord until Tenant is reimbursed in full.”",
                          "citation": "Page 23",
                          "amendments": []
                      }
                  },
                  "premisesAndTerms": {
                      "synopsis": {
                          "value": "Lease for approximately 2,754 usable and 3,094 rentable square feet on the 6th floor of Hunt Tower, 5100 W. J.B. Hunt Drive, Suite 600, Rogers, AR 72758. Primary term begins on the earlier of Tenant's business commencement or two (2) das after Landlord's work is completed and ends after sixty‑two (62) full months. Rent commencement is the first day of the third (3rd) full month of the Primary Term. Base rent is $25.00 per rentable square foot, inclusive of operating expenses, utilities, insurance and taxs, and escalates annually by two percent (2%). Tenant’s proportionate share of building expenses is 1.37%. Tenant is entitled to a tenant improvement allowance of $60.00 per rentable square foot ($185,640 total).",
                          "citation": "Pages 2‑3, 8‑9",
                          "amendments": []
                      },
                      "keyParameters": {
                          "value": "Usable area: 2,654 sf; Rentable area: 3,094 sf; Location: 6th floor, Hunt Tower, 5100 W. J.B. Hunt Drive, Suite 600, Rogers, AR 72758; Commencement Date: earlier of Tenant’s business start or two (2) days after Landlord’s Work; Primary Term: 62 months; Rent Commencement: first day of 3rd full month; Base Rent: $25.00 / sf (incl. expenses); Rent Escalation: 2% per year; Tenant Improvement Allowance: $60 / sf ($185,640 total); Tenant’s Proportionate Share: 1.37%; Security Deposit: None (Intentionally Deleted).",
                          "citation": "Pages 2‑3, 8‑9",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“The Premises consists of approximately Two Thousand Six Hundred Fifty‑four (2,654) usable square feet and Three Thousand Ninety‑four (3,094) rentable square feet… Lease shall commence on the ‘Commencement Date’… Primary Term shall end on the last day of the sixty‑second (62nd) full month… The rental rate for the first year of the Primary Term is $25.00 per rentable square foot, which includes operating expenses, utilities, insurance and taxes, and is net of janitorial services. The rental rate shall increase annually by two percent (2%). Tenant’s Proportionate Share shall be calculated as the resultant percentage based on the rentable square footage of the Building as the denominator and tenant’s rentable square footage as the numerator (1.37%).”",
                          "citation": "Pages 2‑3, 8‑9",
                          "amendments": []
                      }
                  },
                  "tax": {
                      "synopsis": {
                          "value": "Landlord shall pay all real‑property taxes and special assessments on the Premises. Taxes exceeding the Tax Base Year (calendar year 2017) are passed through to tenants on a pro‑rata basis. Tenant is liable for personal‑property taxes and any increase in taxes caused by Tenant’s use.",
                          "citation": "Pages 9‑10",
                          "amendments": []
                      },
                      "definition": {
                          "value": "\"Taxes\" means all real‑property taxes and special assessments accruing against the Premises, the Land and/or improvements, except for excluded items listed in the clause (e.g., income taxes, sales taxes, highway taxes, etc.).",
                          "citation": "Pages 9‑10",
                          "amendments": []
                      },
                      "keyParameters": {
                          "value": "Tax Base Year: calendar year 2017; Tenant’s Proportionate Share of Taxes: 1.37%; Exclusions: income, sales, highway, storm‑sewer, off‑site improvements, substitute taxes, etc.; Tenant responsibility for personal‑property taxes.",
                          "citation": "Pages 9‑10",
                          "amendments": []
                      },
                      "narrative": {
                          "value": "“Landlord agrees to pay all real property taxes and special assessments (collectively referred to herein as “Taxes”) that accrue against the Premises… Property taxes incurred in any year during the lease term which exceed the taxes on the property during the Tax Base Year (as defined below) will be passed through to building tenants based on a pro‑rata square footage basis… Tenant shall be liable for all taxes levied or assessed against any personal property or fixtures placed in the Premises.”",
                          "citation": "Pages 9‑10",
                          "amendments": []
                      }
                  }
              }
          },
          "audit": {
              "audit_checklist": [
                  {
                      "category": "Commencement Date Ambiguity",
                      "issue_description": "The Commencement Date is defined as the earlier of (i) the date Tenant commences business operations on the Premises, or (ii) two (2) days after the date Landlord's Work is completed. The definition of \"Landlord's Work is completed\" is not precise, creating uncertainty about when the lease term begins.",
                      "affected_clause": "\"Lease shall commence on the \"Commencement Date\" which shall be the earlier of (i) the date on which Tenant commences business operations on the Premises, or (ii) two (2) days after the date Landlord's Work is completed.\"",
                      "page_references": [
                          2
                      ],
                      "certainty_level": "MEDIUM",
                      "recommended_action": "Negotiate a clear definition of \"Landlord's Work is completed\" (e.g., certificate of completion) and obtain written confirmation of the Commencement Date before rent accrues."
                  },
                  {
                      "category": "Rent Commencement Conflict",
                      "issue_description": "Rent is stated to commence on the first day of the third full month of the Primary Term, which may conflict with the Commencement Date definition and cause rent to start before the Tenant is ready to occupy.",
                      "affected_clause": "\"Rent commences on the first day of the third (3rd) full month of the Primary Term.\"",
                      "page_references": [
                          2
                      ],
                      "certainty_level": "MEDIUM",
                      "recommended_action": "Clarify whether rent commencement is tied to the Commencement Date or a fixed calendar schedule, and align the two provisions."
                  },
                  {
                      "category": "Base Rent Inclusion Ambiguity",
                      "issue_description": "Base Rent is described as \"$25.00 per rentable square foot, which includes operating expenses, utilities, insurance and taxes, and is net of janitorial services,\" but later Operating Expenses are separately defined and passed through, creating a potential double‑counting or unclear cost structure.",
                      "affected_clause": "\"The rental rate for the first year of the Primary Term is $25 .00 per rentable square foot, which includes operating expenses, utilities, insurance and taxes, and is net of janitorial services.\"",
                      "page_references": [
                          3
                      ],
                      "certainty_level": "MEDIUM",
                      "recommended_action": "Obtain a detailed rent statement separating base rent from pass‑through expenses and confirm that operating expenses are not double‑counted."
                  },
                  {
                      "category": "Improvement Allowance Limitation",
                      "issue_description": "Tenant's Improvement Allowance of $60 per rentable square foot ($185,640) is restricted from use for telecom, cabling, security systems, furniture, trade fixtures, equipment, signage, or moving costs, which may limit the tenant's ability to fit out the space as needed.",
                      "affected_clause": "\"Tenant may not utilize the Improvement Allowance for telecom, cabling, security system, furniture, trade fixtures, equipment, signage, or moving costs.\"",
                      "page_references": [
                          5
                      ],
                      "certainty_level": "HIGH",
                      "recommended_action": "Negotiate broader use of the Improvement Allowance or secure a separate budget for excluded items."
                  },
                  {
                      "category": "Option Rent Determination Ambiguity",
                      "issue_description": "The process for determining the Option Rent during renewal includes a \"reasonable and good‑faith determination\" by Landlord and a multi‑step appraisal process, but the criteria for \"reasonable\" and timelines are vague, potentially leading to disputes over renewal rent.",
                      "affected_clause": "\"Landlord shall, within thirty (30) days after Tenant's delivery of Tenant's notice to exercise, deliver notice to Tenant setting forth Landlord's reasonable and good‑faith determination of the annual Base Rent payable by Tenant during the Renewal Term (\"Option Rent Notice\").\"",
                      "page_references": [
                          5
                      ],
                      "certainty_level": "MEDIUM",
                      "recommended_action": "Define objective benchmarks for the Option Rent calculation and set firm deadlines for each appraisal step."
                  },
                  {
                      "category": "Early Access Cost Exposure",
                      "issue_description": "Tenant may access the Premises 45 days prior to the Commencement Date at no rent, but must comply with all Landlord rules and may incur costs for utilities and services without clear reimbursement provisions.",
                      "affected_clause": "\"Tenant shall not be required to pay Rent, utilities or any other charges during the Early Access Period.\"",
                      "page_references": [
                          5
                      ],
                      "certainty_level": "MEDIUM",
                      "recommended_action": "Request a written schedule of any charges that may arise during Early Access and negotiate a cap or reimbursement mechanism."
                  },
                  {
                      "category": "Late Delivery Penalty Ambiguity",
                      "issue_description": "If the Commencement Date does not occur by May 1, 2016, Tenant may deduct $214.86 per day from Base Rent, and may terminate if delivery is delayed beyond 30 days after the Target Delivery Date. The method of calculating the penalty and its enforceability are unclear.",
                      "affected_clause": "\"Tenant shall have the right to deduct from monthly Base Rent $214.86 for each day between the Target Commencement Date and the actual Commencement Date (the \"Late Delivery Penalty\"); and (ii) if the Commencement Date does not occur on or before the date that is thirty (30) days after the Target Delivery Date, then Tenant may terminate this Lease...\"",
                      "page_references": [
                          5
                      ],
                      "certainty_level": "MEDIUM",
                      "recommended_action": "Confirm the calculation method for the penalty, and negotiate a maximum cap on deductions."
                  },
                  {
                      "category": "Early Termination Financial Risk",
                      "issue_description": "Tenant may terminate at the end of the 38th month by providing 180 days' notice and must reimburse Landlord for the unamortized Improvement Allowance and Broker's commissions, with interest at 6% annual, representing a potentially large, undefined cost.",
                      "affected_clause": "\"Should Tenant exercise such option during the Primary Term, Tenant shall, on or before the Early Termination Date, reimburse Landlord for the unamortized Improvement Allowance... and Broker's commissions... ('Termination Fee') amortized with an annual interest rate of six percent (6.0%).\"",
                      "page_references": [
                          5
                      ],
                      "certainty_level": "HIGH",
                      "recommended_action": "Obtain a schedule of the unamortized Improvement Allowance and broker commissions at the time of termination, and negotiate a cap or alternative calculation method."
                  },
                  {
                      "category": "Operating Expenses Cap Ambiguity",
                      "issue_description": "Tenant's share of Uncontrollable Operating Expenses is capped at a 5% increase per year, but the definition of \"Uncontrollable Operating Expenses\" includes insurance, taxes, utilities, security, and snow removal, which may be subject to landlord's discretion.",
                      "affected_clause": "\"Tenant's Proportionate Share of Operating Expenses for Uncontrollable Operating Expenses ... shall not increase by more than five percent (5%)... Uncontrollable Operating Expenses means insurance costs, utilities, Taxes, security costs, and snow and ice removal expenses.\"",
                      "page_references": [
                          12
                      ],
                      "certainty_level": "MEDIUM",
                      "recommended_action": "Request a detailed breakdown of what expenses are considered uncontrollable and negotiate a higher cap or exclusion of certain items."
                  },
                  {
                      "category": "Repair Responsibility Conflict",
                      "issue_description": "Landlord is responsible for structural components and major systems, while Tenant is responsible for all repairs to the usable Premises and damage caused by negligence. The definition of \"walls\" excludes Tenant Improvements, potentially leading to disputes over repair obligations for walls that contain tenant improvements.",
                      "affected_clause": "\"The term \"walls\" as used herein shall not include any components that are part of Tenant Improvements.\"",
                      "page_references": [
                          12
                      ],
                      "certainty_level": "MEDIUM",
                      "recommended_action": "Clarify responsibility for repair of walls that have tenant improvements attached and obtain a written schedule of maintenance responsibilities."
                  },
                  {
                      "category": "Indemnification Scope Complexity",
                      "issue_description": "Mutual indemnity clauses contain numerous carve‑outs for negligence and willful misconduct, making it difficult to determine when each party is liable, especially regarding landlord's failure to maintain the building.",
                      "affected_clause": "\"EXCEPT FOR ANY CLAIMS... LANDLORD SHALL INDEMNIFY... unless the indemnified loss is caused wholly or in part by Tenant's negligence or willful misconduct...\" and reciprocal clause for Tenant.",
                      "page_references": [
                          16,
                          17
                      ],
                      "certainty_level": "MEDIUM",
                      "recommended_action": "Seek a simplified indemnity provision with clear triggers and limits, and consider insurance to cover potential exposures."
                  },
                  {
                      "category": "Insurance Requirements Burden",
                      "issue_description": "Tenant must maintain $2,000,000 property damage and $4,000,000 per occurrence liability insurance, name Landlord as additional insured, and provide certificates at lease commencement and renewal, which may be costly and administratively burdensome.",
                      "affected_clause": "\"Tenant, at its own expense, shall maintain... Two Million Dollars ($2,000,000.00) for property damage and Four Million Dollars ($4,000,000.00) per occurrence for personal injuries...\"",
                      "page_references": [
                          15
                      ],
                      "certainty_level": "HIGH",
                      "recommended_action": "Obtain insurance quotes to assess cost, and negotiate higher limits for the Landlord to assume part of the risk or a shared premium arrangement."
                  },
                  {
                      "category": "Assignment & Subletting Complexity",
                      "issue_description": "The lease contains multiple, overlapping assignment provisions, including Permitted Transferee rights, Preapproved Transfer to Duracell, and release of the original Tenant. The language is dense and may create ambiguity about who can assign and under what conditions.",
                      "affected_clause": "\"Tenant may assign... to any Permitted Transferee...; Tenant may assign to The Duracell Company... without Landlord's consent (the \"Preapproved Transfer\"); Upon the effective date of any such Preapproved Transfer, The Gillette Company shall be fully released...\"",
                      "page_references": [
                          19,
                          20
                      ],
                      "certainty_level": "HIGH",
                      "recommended_action": "Summarize and streamline assignment rights, and obtain a written consent matrix for any future assignments."
                  },
                  {
                      "category": "Condemnation Compensation Risk",
                      "issue_description": "If part of the Premises is taken by eminent domain, all compensation goes to Landlord, and Tenant assigns any interest in such award, leaving Tenant with no compensation for loss of business or goodwill.",
                      "affected_clause": "\"All compensation awarded ... shall be the property of Landlord, and Tenant hereby assigns any interest in any such award to Landlord; provided, however, Landlord shall have no interest in any award made to Tenant for loss of business or goodwill...\"",
                      "page_references": [
                          18
                      ],
                      "certainty_level": "HIGH",
                      "recommended_action": "Negotiate a carve‑out allowing Tenant to retain compensation for loss of business or goodwill."
                  },
                  {
                      "category": "Holding Over Penalty",
                      "issue_description": "If Tenant remains after lease expiration, rent escalates to 150% of prior Base Rent, and additional damages may be assessed, creating a steep financial penalty.",
                      "affected_clause": "\"Base Rent or daily Base Rent under (ii) shall be equal to one hundred fifty percent (150%) of the Base Rent being paid monthly to Landlord...\"",
                      "page_references": [
                          20
                      ],
                      "certainty_level": "HIGH",
                      "recommended_action": "Add a grace period or reduced penalty, and require written notice before holding over."
                  },
                  {
                      "category": "Default & Cure Period Ambiguity",
                      "issue_description": "Tenant default triggers a 5‑day cure period after notice, while Landlord default requires 30 days to cure. The asymmetry may disadvantage Tenant, and the definition of \"material breach\" is not specified.",
                      "affected_clause": "\"Tenant shall fail to pay... and such failure shall continue for a period of five (5) business days...\" and \"Landlord shall... within thirty (30) days after written notice...\"",
                      "page_references": [
                          21,
                          22
                      ],
                      "certainty_level": "MEDIUM",
                      "recommended_action": "Seek equal cure periods for both parties and define what constitutes a material breach."
                  },
                  {
                      "category": "Remedies Liquidated Damages Uncertainty",
                      "issue_description": "The lease defines damages for non‑payment as the excess of total remaining rent over fair market value, discounted at the Prime Rate, but the calculation method and the designation as liquidated damages may be contested.",
                      "affected_clause": "\"Terminate this Lease... Tenant shall be liable for damages equal to the excess of (i) the total rental for the remainder of the Term... over (ii) the fair market rental value...\"",
                      "page_references": [
                          22
                      ],
                      "certainty_level": "MEDIUM",
                      "recommended_action": "Request a clear formula with caps or a fixed amount to avoid unpredictable liability."
                  },
                  {
                      "category": "Confidentiality Enforcement Risk",
                      "issue_description": "The lease imposes a confidentiality obligation on both parties, potentially restricting required disclosures to lenders or prospective buyers, which could impede financing.",
                      "affected_clause": "\"Landlord and Tenant agree that the terms and conditions of this Lease are confidential and the parties hereto agree not to disclose the terms of this Lease to any third party (other than to its attorneys and accountants and other than to parties who propose to purchase or finance the Building)...\"",
                      "page_references": [
                          26,
                          27
                      ],
                      "certainty_level": "MEDIUM",
                      "recommended_action": "Add carve‑outs allowing disclosure to lenders, investors, and regulators with prior written notice."
                  },
                  {
                      "category": "Rules & Regulations Subjectivity",
                      "issue_description": "Numerous rules (e.g., use of building name, signage, movement of furniture, smoking, waste of electricity) are subject to Landlord's discretion, creating unpredictable obligations and potential enforcement disputes.",
                      "affected_clause": "\"Tenant shall not use the name HUNT VENTURES...; No signs will be allowed...; Tenant shall not waste electricity, water or air conditioning...; Smoking is prohibited within 25 feet...\"",
                      "page_references": [
                          27,
                          28,
                          35,
                          36
                      ],
                      "certainty_level": "HIGH",
                      "recommended_action": "Request a written list of rules at lease commencement and negotiate amendment rights with reasonable notice periods."
                  },
                  {
                      "category": "Hazardous Materials Liability",
                      "issue_description": "Tenant is prohibited from storing hazardous materials, but Landlord represents the property as free of such materials. If hazardous substances are later discovered, Tenant may bear removal costs despite Landlord's warranty.",
                      "affected_clause": "\"Tenant shall never incorporate into, or dispose of, at, in or under the Premises... any toxic or hazardous materials...; Landlord represents that the Property is free from any toxic or hazardous materials...\"",
                      "page_references": [
                          24,
                          25
                      ],
                      "certainty_level": "HIGH",
                      "recommended_action": "Obtain indemnity from Landlord for any pre‑existing hazardous material issues and conduct an independent environmental audit."
                  },
                  {
                      "category": "Tax Pass‑Through Ambiguity",
                      "issue_description": "Taxes are defined as those exceeding the Tax Base Year (2017), but the calculation method and adjustments for future base years are unclear, potentially leading to unpredictable tax escalations.",
                      "affected_clause": "\"Tax Base Year shall be the calendar year of 2017 or such later year... Property taxes incurred in any year during the lease term which exceed the taxes on the property during the Tax Base Year... shall be passed through to building tenants...\"",
                      "page_references": [
                          9
                      ],
                      "certainty_level": "MEDIUM",
                      "recommended_action": "Request a detailed tax reconciliation schedule and a cap on annual tax pass‑through increases."
                  },
                  {
                      "category": "Additional Rent Definition Risk",
                      "issue_description": "All sums of money and payments due Landlord are deemed \"Additional Rent,\" which could include fees not expressly identified, creating uncertainty about the scope of rent obligations.",
                      "affected_clause": "\"All sums of money and all payments due Landlord hereunder shall be deemed to be additional rental (\\\"Additional Rent\\\") owed to Landlord.\"",
                      "page_references": [
                          29
                      ],
                      "certainty_level": "MEDIUM",
                      "recommended_action": "Define specific categories of Additional Rent and request an annual statement itemizing such charges."
                  },
                  {
                      "category": "Prime Rate Definition Uncertainty",
                      "issue_description": "The Prime Rate is tied to the WSJ publication; if the WSJ is not published on the termination date, the lease references the most recent prior issue, which could be ambiguous and lead to disputes over the rate applied.",
                      "affected_clause": "\"The term \\\"Prime Rate\\\" as used herein shall mean the per annum \\\"prime rate\\\" of interest as published... by The Wall Street Journal... or if The Wall Street Journal is not published on the date... then the \\\"prime rate\\\" of interest as published in The Wall Street Journal on the most recent date prior to the date...\"",
                      "page_references": [
                          23
                      ],
                      "certainty_level": "MEDIUM",
                      "recommended_action": "Agree on an alternative source or a fixed rate floor/ceiling for periods when WSJ is unavailable."
                  },
                  {
                      "category": "Signature Validity Concern",
                      "issue_description": "The signature blocks on pages 30‑31 contain garbled characters and illegible names/titles, raising questions about the enforceability of the executed lease.",
                      "affected_clause": "Signature blocks with illegible text (e.g., \"By: C::,=.. gS-----.._\", \"Name: Tim Graham\", \"Title: President\").",
                      "page_references": [
                          30,
                          31
                      ],
                      "certainty_level": "HIGH",
                      "recommended_action": "Obtain clean, properly executed signature pages with legible signatures and titles."
                  }
              ]
          }
      },
      "created_at": "2025-12-29T09:53:17.308Z",
      "updated_at": "2025-12-29T13:50:12.021Z"
  }
}

module.exports = {
  CORS_CONFIG,
  AnalysisType,
  ANALYSIS_CONFIG,
  MOCK_LEASE_RESPONSE
};

