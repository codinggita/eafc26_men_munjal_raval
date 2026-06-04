const fs = require('fs');
const path = require('path');

const collectionData = {
  "Basic CRUD Routes": [
    { method: "GET", endpoint: "/conflicts", description: "Fetch all conflicts" },
    { method: "GET", endpoint: "/conflicts/:conflictId", description: "Fetch conflict by ID" },
    { method: "POST", endpoint: "/conflicts", description: "Create new conflict" },
    { method: "PUT", endpoint: "/conflicts/:conflictId", description: "Replace conflict data" },
    { method: "PATCH", endpoint: "/conflicts/:conflictId", description: "Update conflict details" },
    { method: "DELETE", endpoint: "/conflicts/:conflictId", description: "Delete conflict" }
  ],
  "Route Parameters": [
    { method: "GET", endpoint: "/conflicts/name/:name", description: "Fetch conflicts by name" },
    { method: "GET", endpoint: "/conflicts/type/:type", description: "Fetch conflicts by type" },
    { method: "GET", endpoint: "/conflicts/region/:region", description: "Fetch conflicts by region" },
    { method: "GET", endpoint: "/conflicts/status/:status", description: "Fetch conflicts by status" },
    { method: "GET", endpoint: "/conflicts/country/:country", description: "Fetch conflicts by country" },
    { method: "GET", endpoint: "/conflicts/start-year/:year", description: "Fetch conflicts by start year" },
    { method: "GET", endpoint: "/conflicts/end-year/:year", description: "Fetch conflicts by end year" },
    { method: "GET", endpoint: "/conflicts/inflation/:rate", description: "Fetch conflicts by inflation rate" },
    { method: "GET", endpoint: "/conflicts/gdp-loss/:percentage", description: "Fetch conflicts by GDP loss" },
    { method: "GET", endpoint: "/conflicts/poverty/:rate", description: "Fetch conflicts by poverty rate" },
    { method: "GET", endpoint: "/conflicts/extreme-poverty/:rate", description: "Fetch conflicts by extreme poverty" },
    { method: "GET", endpoint: "/conflicts/food-insecurity/:rate", description: "Fetch conflicts by food insecurity" },
    { method: "GET", endpoint: "/conflicts/unemployment/:rate", description: "Fetch conflicts by unemployment" },
    { method: "GET", endpoint: "/conflicts/youth-unemployment/:rate", description: "Fetch conflicts by youth unemployment" },
    { method: "GET", endpoint: "/conflicts/sector/:sector", description: "Fetch conflicts by sector" },
    { method: "GET", endpoint: "/conflicts/black-market/:level", description: "Fetch conflicts by black market level" },
    { method: "GET", endpoint: "/conflicts/black-market-goods/:goods", description: "Fetch conflicts by black market goods" },
    { method: "GET", endpoint: "/conflicts/profiteering/:status", description: "Fetch conflicts by profiteering status" },
    { method: "GET", endpoint: "/conflicts/currency-gap/:gap", description: "Fetch conflicts by currency gap" },
    { method: "GET", endpoint: "/conflicts/reconstruction-cost/:amount", description: "Fetch conflicts by reconstruction cost" },
    { method: "GET", endpoint: "/conflicts/cost-of-war/:amount", description: "Fetch conflicts by war cost" },
    { method: "GET", endpoint: "/conflicts/informal-economy/pre/:value", description: "Fetch pre-war informal economy" },
    { method: "GET", endpoint: "/conflicts/informal-economy/during/:value", description: "Fetch wartime informal economy" },
    { method: "GET", endpoint: "/conflicts/households/:count", description: "Fetch conflicts by affected households" },
    { method: "GET", endpoint: "/conflicts/region/:region/latest", description: "Fetch latest regional conflict" },
    { method: "GET", endpoint: "/conflicts/region/:region/oldest", description: "Fetch oldest regional conflict" },
    { method: "GET", endpoint: "/conflicts/country/:country/history", description: "Fetch country conflict history" },
    { method: "GET", endpoint: "/conflicts/type/:type/count", description: "Count conflicts by type" },
    { method: "GET", endpoint: "/conflicts/status/:status/count", description: "Count conflicts by status" },
    { method: "GET", endpoint: "/conflicts/year/:year", description: "Fetch conflicts by year" },
    { method: "GET", endpoint: "/conflicts/sector/:sector/highest-gdp-loss", description: "Fetch sector with highest GDP loss" },
    { method: "GET", endpoint: "/conflicts/sector/:sector/highest-inflation", description: "Fetch sector with highest inflation" },
    { method: "GET", endpoint: "/conflicts/war/:name/summary", description: "Fetch war summary" },
    { method: "GET", endpoint: "/conflicts/war/:name/economic-impact", description: "Fetch economic impact" },
    { method: "GET", endpoint: "/conflicts/war/:name/poverty-impact", description: "Fetch poverty impact" },
    { method: "GET", endpoint: "/conflicts/war/:name/black-market", description: "Fetch black market impact" },
    { method: "GET", endpoint: "/conflicts/war/:name/reconstruction", description: "Fetch reconstruction details" },
    { method: "GET", endpoint: "/conflicts/war/:name/currency-crisis", description: "Fetch currency crisis data" },
    { method: "GET", endpoint: "/conflicts/war/:name/unemployment", description: "Fetch unemployment impact" }
  ],
  "Query Parameter": [
    { method: "GET", endpoint: "/conflicts?status=Ongoing", description: "Filter ongoing conflicts" },
    { method: "GET", endpoint: "/conflicts?region=Europe", description: "Filter conflicts by region" },
    { method: "GET", endpoint: "/conflicts?country=Japan", description: "Filter conflicts by country" },
    { method: "GET", endpoint: "/conflicts?type=World War", description: "Filter conflicts by type" },
    { method: "GET", endpoint: "/conflicts?inflationAbove=50", description: "Fetch high inflation conflicts" },
    { method: "GET", endpoint: "/conflicts?inflationBelow=20", description: "Fetch low inflation conflicts" },
    { method: "GET", endpoint: "/conflicts?gdpLossAbove=30", description: "Fetch conflicts with high GDP loss" },
    { method: "GET", endpoint: "/conflicts?povertyAbove=25", description: "Fetch conflicts with high poverty" },
    { method: "GET", endpoint: "/conflicts?foodInsecurityAbove=20", description: "Fetch high food insecurity conflicts" },
    { method: "GET", endpoint: "/conflicts?currencyGapAbove=100", description: "Fetch high currency gap conflicts" },
    { method: "GET", endpoint: "/conflicts?warCostAbove=1000000000", description: "Fetch expensive wars" },
    { method: "GET", endpoint: "/conflicts?reconstructionAbove=5000000000", description: "Fetch costly reconstruction conflicts" },
    { method: "GET", endpoint: "/conflicts?sector=Agriculture", description: "Filter conflicts by sector" },
    { method: "GET", endpoint: "/conflicts?blackMarket=High", description: "Fetch high black market conflicts" },
    { method: "GET", endpoint: "/conflicts?profiteering=Yes", description: "Fetch profiteering conflicts" },
    { method: "GET", endpoint: "/conflicts?year=2022", description: "Fetch conflicts by year" },
    { method: "GET", endpoint: "/conflicts?startYear=1939", description: "Fetch conflicts by start year" },
    { method: "GET", endpoint: "/conflicts?endYear=1945", description: "Fetch conflicts by end year" },
    { method: "GET", endpoint: "/conflicts?country=Ukraine&status=Ongoing", description: "Fetch ongoing Ukraine conflicts" },
    { method: "GET", endpoint: "/conflicts?region=Middle East&type=Civil War", description: "Fetch Middle East civil wars" },
    { method: "GET", endpoint: "/conflicts?minInflation=20&maxInflation=80", description: "Fetch conflicts within inflation range" },
    { method: "GET", endpoint: "/conflicts?minGDP=-50&maxGDP=-20", description: "Fetch conflicts within GDP loss range" },
    { method: "GET", endpoint: "/conflicts?minPoverty=10&maxPoverty=40", description: "Fetch conflicts within poverty range" },
    { method: "GET", endpoint: "/conflicts?minUnemployment=5&maxUnemployment=30", description: "Fetch conflicts within unemployment range" },
    { method: "GET", endpoint: "/conflicts?sort=Inflation_Rate_%", description: "Sort conflicts by inflation" },
    { method: "GET", endpoint: "/conflicts?sort=-GDP_Change_%", description: "Sort conflicts descending by GDP change" },
    { method: "GET", endpoint: "/conflicts?sort=Start_Year", description: "Sort conflicts by start year" },
    { method: "GET", endpoint: "/conflicts?sort=-Estimated_Reconstruction_Cost_USD", description: "Sort by reconstruction cost" },
    { method: "GET", endpoint: "/conflicts?keyword=war", description: "Search war conflicts" },
    { method: "GET", endpoint: "/conflicts?keyword=Japan", description: "Search Japan conflicts" }
  ],
  "Pagination Routes": [
    { method: "GET", endpoint: "/conflicts?page=1&limit=10", description: "Paginate conflicts" },
    { method: "GET", endpoint: "/conflicts?page=2&limit=20", description: "Fetch second page of conflicts" },
    { method: "GET", endpoint: "/conflicts/ongoing?page=1&limit=5", description: "Paginate ongoing conflicts" },
    { method: "GET", endpoint: "/conflicts/resolved?page=2&limit=10", description: "Paginate resolved conflicts" },
    { method: "GET", endpoint: "/conflicts/europe?page=1&limit=15", description: "Paginate Europe conflicts" },
    { method: "GET", endpoint: "/conflicts/asia?page=1&limit=15", description: "Paginate Asia conflicts" },
    { method: "GET", endpoint: "/conflicts/high-inflation?page=1&limit=10", description: "Paginate high inflation conflicts" },
    { method: "GET", endpoint: "/conflicts/high-poverty?page=1&limit=10", description: "Paginate high poverty conflicts" },
    { method: "GET", endpoint: "/conflicts/high-gdp-loss?page=1&limit=10", description: "Paginate high GDP loss conflicts" },
    { method: "GET", endpoint: "/conflicts/black-market/high?page=1&limit=5", description: "Paginate high black market conflicts" }
  ],
  "Sorting APIs": [
    { method: "GET", endpoint: "/conflicts?sort=Inflation_Rate_%", description: "Sort by inflation rate" },
    { method: "GET", endpoint: "/conflicts?sort=-Inflation_Rate_%", description: "Sort descending by inflation rate" },
    { method: "GET", endpoint: "/conflicts?sort=GDP_Change_%", description: "Sort by GDP change" },
    { method: "GET", endpoint: "/conflicts?sort=-GDP_Change_%", description: "Sort descending by GDP change" },
    { method: "GET", endpoint: "/conflicts?sort=Pre_War_Unemployment_%", description: "Sort by pre-war unemployment" },
    { method: "GET", endpoint: "/conflicts?sort=-During_War_Unemployment_%", description: "Sort descending by wartime unemployment" },
    { method: "GET", endpoint: "/conflicts?sort=Food_Insecurity_Rate_%", description: "Sort by food insecurity" },
    { method: "GET", endpoint: "/conflicts?sort=-Extreme_Poverty_Rate_%", description: "Sort descending by extreme poverty" },
    { method: "GET", endpoint: "/conflicts?sort=Currency_Devaluation_%", description: "Sort by currency devaluation" },
    { method: "GET", endpoint: "/conflicts?sort=-Currency_Black_Market_Rate_Gap_%", description: "Sort by black market gap" },
    { method: "GET", endpoint: "/conflicts?sort=Estimated_Reconstruction_Cost_USD", description: "Sort by reconstruction cost" },
    { method: "GET", endpoint: "/conflicts?sort=-Cost_of_War_USD", description: "Sort descending by war cost" },
    { method: "GET", endpoint: "/conflicts?sort=Start_Year", description: "Sort by start year" },
    { method: "GET", endpoint: "/conflicts?sort=-End_Year", description: "Sort descending by end year" },
    { method: "GET", endpoint: "/conflicts?sort=Conflict_Name", description: "Sort by conflict name" }
  ],
  "Search APIs": [
    { method: "GET", endpoint: "/search?keyword=Japan", description: "Search Japan conflicts" },
    { method: "GET", endpoint: "/search?keyword=Europe", description: "Search Europe conflicts" },
    { method: "GET", endpoint: "/search?keyword=World War", description: "Search world wars" },
    { method: "GET", endpoint: "/search?keyword=Inflation", description: "Search inflation conflicts" },
    { method: "GET", endpoint: "/search/conflicts?country=Germany", description: "Search Germany conflicts" },
    { method: "GET", endpoint: "/search/conflicts?region=Africa", description: "Search Africa conflicts" },
    { method: "GET", endpoint: "/search/conflicts?type=Civil War", description: "Search civil wars" },
    { method: "GET", endpoint: "/search/conflicts?status=Resolved", description: "Search resolved conflicts" },
    { method: "GET", endpoint: "/search/economic?inflation=100", description: "Search high inflation conflicts" },
    { method: "GET", endpoint: "/search/economic?poverty=30", description: "Search poverty impact" },
    { method: "GET", endpoint: "/search/economic?gdp=-40", description: "Search GDP loss" },
    { method: "GET", endpoint: "/search/economic?currency=50", description: "Search currency crisis" },
    { method: "GET", endpoint: "/search/sector?name=Agriculture", description: "Search agriculture sector" },
    { method: "GET", endpoint: "/search/sector?name=Manufacturing", description: "Search manufacturing sector" },
    { method: "GET", endpoint: "/search/black-market?goods=fuel", description: "Search fuel black market" },
    { method: "GET", endpoint: "/search/black-market?goods=weapons", description: "Search weapons black market" }
  ],
  "Combined Query + Pagination + Sorting": [
    { method: "GET", endpoint: "/conflicts?status=Ongoing&page=1&limit=10&sort=-Inflation_Rate_%", description: "Fetch ongoing conflicts sorted by inflation" },
    { method: "GET", endpoint: "/conflicts?region=Europe&page=2&limit=5", description: "Fetch paginated Europe conflicts" },
    { method: "GET", endpoint: "/conflicts?country=Japan&sort=-GDP_Change_%", description: "Fetch Japan conflicts sorted by GDP" },
    { method: "GET", endpoint: "/conflicts?type=World War&page=1&limit=20", description: "Fetch paginated world wars" },
    { method: "GET", endpoint: "/conflicts?blackMarket=High&sort=-Currency_Black_Market_Rate_Gap_%", description: "Fetch black market conflicts" },
    { method: "GET", endpoint: "/conflicts?inflationAbove=50&page=1&limit=10", description: "Fetch high inflation conflicts" },
    { method: "GET", endpoint: "/conflicts?povertyAbove=20&sort=-Extreme_Poverty_Rate_%", description: "Fetch high poverty conflicts" },
    { method: "GET", endpoint: "/conflicts?sector=Energy&page=2&limit=10", description: "Fetch energy sector conflicts" },
    { method: "GET", endpoint: "/conflicts?profiteering=Yes&sort=-Cost_of_War_USD", description: "Fetch profiteering conflicts" },
    { method: "GET", endpoint: "/conflicts?country=Ukraine&status=Ongoing&page=1&limit=5", description: "Fetch Ukraine ongoing conflicts" }
  ],
  "POST Routes": [
    { method: "POST", endpoint: "/conflicts", description: "Create conflict" },
    { method: "POST", endpoint: "/regions", description: "Create region" },
    { method: "POST", endpoint: "/countries", description: "Create country" },
    { method: "POST", endpoint: "/economic-records", description: "Create economic record" },
    { method: "POST", endpoint: "/poverty-records", description: "Create poverty record" },
    { method: "POST", endpoint: "/inflation-records", description: "Create inflation record" },
    { method: "POST", endpoint: "/black-market-records", description: "Create black market record" },
    { method: "POST", endpoint: "/war-cost-records", description: "Create war cost record" },
    { method: "POST", endpoint: "/reconstruction-records", description: "Create reconstruction record" },
    { method: "POST", endpoint: "/unemployment-records", description: "Create unemployment record" }
  ],
  "PUT/PATCH Routes": [
    { method: "PUT", endpoint: "/conflicts/:conflictId", description: "Replace conflict" },
    { method: "PUT", endpoint: "/countries/:countryId", description: "Replace country" },
    { method: "PUT", endpoint: "/economic-records/:recordId", description: "Replace economic record" },
    { method: "PUT", endpoint: "/reconstruction-records/:recordId", description: "Replace reconstruction record" },
    { method: "PATCH", endpoint: "/conflicts/:conflictId/status", description: "Update conflict status" },
    { method: "PATCH", endpoint: "/conflicts/:conflictId/inflation", description: "Update inflation" },
    { method: "PATCH", endpoint: "/conflicts/:conflictId/gdp", description: "Update GDP" },
    { method: "PATCH", endpoint: "/conflicts/:conflictId/poverty", description: "Update poverty" },
    { method: "PATCH", endpoint: "/conflicts/:conflictId/unemployment", description: "Update unemployment" },
    { method: "PATCH", endpoint: "/conflicts/:conflictId/sector", description: "Update sector" }
  ],
  "DELETE Routes": [
    { method: "DELETE", endpoint: "/conflicts/:conflictId", description: "Delete conflict" },
    { method: "DELETE", endpoint: "/countries/:countryId", description: "Delete country" },
    { method: "DELETE", endpoint: "/regions/:regionId", description: "Delete region" },
    { method: "DELETE", endpoint: "/economic-records/:recordId", description: "Delete economic record" },
    { method: "DELETE", endpoint: "/poverty-records/:recordId", description: "Delete poverty record" },
    { method: "DELETE", endpoint: "/black-market-records/:recordId", description: "Delete black market record" },
    { method: "DELETE", endpoint: "/war-cost-records/:recordId", description: "Delete war cost record" },
    { method: "DELETE", endpoint: "/reconstruction-records/:recordId", description: "Delete reconstruction record" },
    { method: "DELETE", endpoint: "/inflation-records/:recordId", description: "Delete inflation record" },
    { method: "DELETE", endpoint: "/unemployment-records/:recordId", description: "Delete unemployment record" }
  ],
  "Statistics Routes": [
    { method: "GET", endpoint: "/stats/total-conflicts", description: "Fetch total conflicts" },
    { method: "GET", endpoint: "/stats/ongoing-conflicts", description: "Fetch ongoing conflicts" },
    { method: "GET", endpoint: "/stats/resolved-conflicts", description: "Fetch resolved conflicts" },
    { method: "GET", endpoint: "/stats/highest-inflation", description: "Fetch highest inflation" },
    { method: "GET", endpoint: "/stats/lowest-gdp", description: "Fetch lowest GDP" },
    { method: "GET", endpoint: "/stats/highest-poverty", description: "Fetch highest poverty" },
    { method: "GET", endpoint: "/stats/highest-food-insecurity", description: "Fetch highest food insecurity" },
    { method: "GET", endpoint: "/stats/highest-currency-gap", description: "Fetch highest currency gap" },
    { method: "GET", endpoint: "/stats/highest-war-cost", description: "Fetch highest war cost" },
    { method: "GET", endpoint: "/stats/highest-reconstruction-cost", description: "Fetch highest reconstruction cost" }
  ],
  "Middleware Routes": [
    { method: "GET", endpoint: "/admin/conflicts", description: "Access admin conflicts" },
    { method: "POST", endpoint: "/admin/conflicts", description: "Admin create conflict" },
    { method: "DELETE", endpoint: "/admin/conflicts/:conflictId", description: "Admin delete conflict" },
    { method: "PATCH", endpoint: "/admin/conflicts/:conflictId", description: "Admin update conflict" },
    { method: "GET", endpoint: "/admin/dashboard", description: "Access admin dashboard" },
    { method: "GET", endpoint: "/protected/conflicts", description: "Access protected conflicts" },
    { method: "POST", endpoint: "/protected/conflicts", description: "Create protected conflict" },
    { method: "DELETE", endpoint: "/protected/conflicts/:conflictId", description: "Delete protected conflict" }
  ],
  "Authentication Routes": [
    { method: "POST", endpoint: "/auth/register", description: "Register new user" },
    { method: "POST", endpoint: "/auth/login", description: "Login existing user" },
    { method: "POST", endpoint: "/auth/logout", description: "Logout authenticated user" },
    { method: "POST", endpoint: "/auth/forgot-password", description: "Request password reset" },
    { method: "POST", endpoint: "/auth/reset-password", description: "Reset forgotten password" },
    { method: "POST", endpoint: "/auth/refresh-token", description: "Refresh authentication token" },
    { method: "GET", endpoint: "/auth/me", description: "Fetch authenticated user" },
    { method: "DELETE", endpoint: "/auth/account", description: "Delete user account" }
  ],
  "JWT Authentication Routes": [
    { method: "GET", endpoint: "/jwt/profile", description: "Access JWT protected profile" },
    { method: "GET", endpoint: "/jwt/dashboard", description: "Access JWT protected dashboard" },
    { method: "POST", endpoint: "/jwt/generate-token", description: "Generate JWT token" },
    { method: "POST", endpoint: "/jwt/verify-token", description: "Verify JWT token" },
    { method: "POST", endpoint: "/jwt/refresh-token", description: "Refresh JWT token" },
    { method: "GET", endpoint: "/jwt/admin", description: "Access admin protected route" },
    { method: "GET", endpoint: "/jwt/user", description: "Access user protected route" },
    { method: "DELETE", endpoint: "/jwt/logout", description: "Logout JWT session" }
  ],
  "Error Handling": [
    { method: "GET", endpoint: "/conflicts/:conflictId", description: "Handle invalid conflict ID" },
    { method: "GET", endpoint: "/conflicts/:conflictId", description: "Handle conflict not found" },
    { method: "POST", endpoint: "/conflicts", description: "Handle missing required fields" },
    { method: "POST", endpoint: "/conflicts", description: "Handle duplicate conflict entry" },
    { method: "PATCH", endpoint: "/conflicts/:conflictId", description: "Handle invalid update data" },
    { method: "DELETE", endpoint: "/conflicts/:conflictId", description: "Handle already deleted conflict" },
    { method: "GET", endpoint: "/admin/conflicts", description: "Handle unauthorized access" },
    { method: "POST", endpoint: "/auth/login", description: "Handle invalid credentials" }
  ],
  "Request Validation": [
    { method: "POST", endpoint: "/conflicts", description: "Validate conflict name" },
    { method: "POST", endpoint: "/conflicts", description: "Validate conflict type" },
    { method: "POST", endpoint: "/conflicts", description: "Validate region" },
    { method: "POST", endpoint: "/conflicts", description: "Validate country" },
    { method: "POST", endpoint: "/conflicts", description: "Validate start year" },
    { method: "POST", endpoint: "/conflicts", description: "Validate end year" },
    { method: "POST", endpoint: "/conflicts", description: "Validate inflation" },
    { method: "POST", endpoint: "/conflicts", description: "Validate GDP loss" },
    { method: "POST", endpoint: "/conflicts", description: "Validate poverty rate" },
    { method: "POST", endpoint: "/conflicts", description: "Validate unemployment" }
  ],
  "API Rate Limiting": [
    { method: "GET", endpoint: "/conflicts", description: "Limit requests per minute" },
    { method: "POST", endpoint: "/auth/login", description: "Prevent brute force attacks" },
    { method: "POST", endpoint: "/auth/register", description: "Limit registration requests" },
    { method: "GET", endpoint: "/search", description: "Limit excessive searches" },
    { method: "GET", endpoint: "/admin/dashboard", description: "Strict admin rate limiting" },
    { method: "POST", endpoint: "/conflicts", description: "Prevent spam submissions" },
    { method: "DELETE", endpoint: "/conflicts/:conflictId", description: "Limit delete requests" },
    { method: "POST", endpoint: "/import/json", description: "Limit bulk uploads" }
  ],
  "Advance Routes": [
    { method: "GET", endpoint: "/conflicts/top/highest-inflation", description: "Fetch highest inflation conflicts" },
    { method: "GET", endpoint: "/conflicts/top/highest-poverty", description: "Fetch highest poverty conflicts" },
    { method: "GET", endpoint: "/conflicts/recent", description: "Fetch recent conflicts" },
    { method: "GET", endpoint: "/conflicts/latest", description: "Fetch latest conflicts" },
    { method: "GET", endpoint: "/conflicts/random", description: "Fetch random conflicts" },
    { method: "GET", endpoint: "/conflicts/trending", description: "Fetch trending conflicts" },
    { method: "GET", endpoint: "/conflicts/ongoing", description: "Fetch ongoing conflicts" },
    { method: "GET", endpoint: "/conflicts/resolved", description: "Fetch resolved conflicts" },
    { method: "GET", endpoint: "/conflicts/high-risk", description: "Fetch high risk conflicts" },
    { method: "GET", endpoint: "/conflicts/economic-collapse", description: "Fetch economic collapse conflicts" },
    { method: "GET", endpoint: "/health", description: "Check API health" },
    { method: "GET", endpoint: "/version", description: "Fetch API version" },
    { method: "GET", endpoint: "/compare?conflict1=WWII&conflict2=Ukraine", description: "Compare two conflicts" },
    { method: "GET", endpoint: "/conflicts/summary/ai", description: "Generate AI conflict summary" }
  ],
  "Good to Have Routes (HEAD & OPTIONS)": [
    { method: "HEAD", endpoint: "/conflicts", description: "Fetch only headers for conflicts collection" },
    { method: "HEAD", endpoint: "/conflicts/:conflictId", description: "Fetch headers for single conflict resource" },
    { method: "HEAD", endpoint: "/stats/total-conflicts", description: "Check metadata for total conflicts stats" },
    { method: "HEAD", endpoint: "/auth/me", description: "Verify authenticated user session headers" },
    { method: "HEAD", endpoint: "/health", description: "Check API health status headers only" },
    { method: "OPTIONS", endpoint: "/conflicts", description: "List supported methods for conflicts route" },
    { method: "OPTIONS", endpoint: "/conflicts/:conflictId", description: "List allowed methods for single conflict route" },
    { method: "OPTIONS", endpoint: "/auth/login", description: "Fetch allowed methods for login endpoint" },
    { method: "OPTIONS", endpoint: "/admin/conflicts", description: "Check supported admin route methods" },
    { method: "OPTIONS", endpoint: "/search", description: "Fetch supported search endpoint methods" },
    { method: "OPTIONS", endpoint: "/jwt/profile", description: "Fetch JWT route communication options" },
    { method: "OPTIONS", endpoint: "/health", description: "Fetch API communication capabilities" }
  ]
};

const collection = {
  info: {
    name: "War Economic Impact API",
    description: "Comprehensive Postman collection for the War Economic Impact API including all specific routes requested.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  item: [],
  variable: [
    {
      key: "baseUrl",
      value: "http://localhost:5000/api/v1",
      type: "string"
    },
    {
      key: "token",
      value: "",
      type: "string"
    }
  ]
};

// Helper function to build a URL object from an endpoint string
function buildUrlObject(endpointStr) {
  const urlObj = {
    raw: `{{baseUrl}}${endpointStr}`,
    host: ["{{baseUrl}}"],
    path: [],
    query: []
  };
  
  let pathStr = endpointStr;
  
  if (endpointStr.includes('?')) {
    const [pathPart, queryPart] = endpointStr.split('?');
    pathStr = pathPart;
    
    queryPart.split('&').forEach(q => {
      const [key, value] = q.split('=');
      urlObj.query.push({
        key: key,
        value: value || ""
      });
    });
  }
  
  urlObj.path = pathStr.split('/').filter(p => p !== '');
  return urlObj;
}

for (const [groupName, routes] of Object.entries(collectionData)) {
  const folder = {
    name: groupName,
    item: []
  };

  routes.forEach((route, index) => {
    const isSpecialHealthOrVersion = route.endpoint === '/health' || route.endpoint === '/version';
    
    // Some routes in the list might conflict if they have the exact same name, so add description or index to the name if needed, but here description acts as the name
    let reqItem = {
      name: route.description || `${route.method} ${route.endpoint}`,
      request: {
        method: route.method,
        header: [
          {
            key: "Authorization",
            value: "Bearer {{token}}",
            type: "text"
          }
        ],
        url: buildUrlObject(isSpecialHealthOrVersion ? route.endpoint.replace(/^\//, '/') : route.endpoint)
      },
      response: []
    };

    if (isSpecialHealthOrVersion) {
      // Fix baseUrl issue for root routes
      reqItem.request.url.raw = reqItem.request.url.raw.replace('{{baseUrl}}', 'http://localhost:5000');
      reqItem.request.url.host = ["http://localhost:5000"];
    }

    if (["POST", "PUT", "PATCH"].includes(route.method)) {
      reqItem.request.body = {
        mode: "raw",
        raw: "{\n    \n}",
        options: {
          raw: {
            language: "json"
          }
        }
      };
    }

    folder.item.push(reqItem);
  });

  collection.item.push(folder);
}

const outputPath = path.join(__dirname, '..', 'War_Economic_Impact_API_Complete.postman_collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));

console.log(`Generated complete Postman collection at ${outputPath}`);
