/* Works Cited (MLA 9). Every source used on the site and in the game.
   *asterisks* = italics. "verify" = a detail Claude could not confirm automatically; check it before you submit.
   To add your own entries, use works_cited_extra in content.js (they're merged and sorted automatically). */
window.WORKS_CITED = [
  { text: "\"Appendix B - Table of Standards.\" *SNAP Policy Manual*, North Dakota Department of Health and Human Services, effective 1 Oct. 2026, www.nd.gov/dhs/policymanuals/SNAP/Content/Appendix%20B%20-%20Table%20of%20Standards.htm.",
    url: "https://www.nd.gov/dhs/policymanuals/SNAP/Content/Appendix%20B%20-%20Table%20of%20Standards.htm", usedIn: "Game (SNAP income limit)" },

  { text: "Bostock, Mike. *us-atlas*. Version 3.0.1, GitHub, github.com/topojson/us-atlas.",
    url: "https://github.com/topojson/us-atlas", usedIn: "Map (state shapes)" },

  { text: "\"Cartographic Boundary Files - Shapefile.\" United States Census Bureau, 2017 ed., www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html.",
    url: "https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html", usedIn: "Map (state boundaries)" },

  { text: "*Child Care in America: 2024 Price & Supply*. Child Care Aware of America, www.childcareaware.org/price-landscape24/. Accessed 20 Nov. 2026.",
    url: "https://www.childcareaware.org/price-landscape24/", usedIn: "Game (North Dakota child care costs)",
    verify: "Confirm this is where the North Dakota figures ($873 center, $847 home-based, 4-year-old) come from, and add the publication date." },

  { text: "\"Child Care Costs in the United States: Minnesota.\" Economic Policy Institute, www.epi.org/child-care-costs-in-the-united-states/#/MN. Accessed 20 Nov. 2026.",
    url: "https://www.epi.org/child-care-costs-in-the-united-states/#/MN", usedIn: "Game (Minneapolis center care)",
    verify: "The EPI site blocked the automated check. Open the link and confirm the page title." },

  { text: "\"Federal Reserve Board Issues Economic Well-Being of U.S. Households in 2024 Report.\" Board of Governors of the Federal Reserve System, 28 May 2025, www.federalreserve.gov/newsevents/pressreleases/other20250528a.htm.",
    url: "https://www.federalreserve.gov/newsevents/pressreleases/other20250528a.htm", usedIn: "Game ($400 emergency statistic)" },

  { text: "\"Food Security in the U.S.: Key Statistics & Graphics.\" Economic Research Service, U.S. Department of Agriculture, updated 30 Mar. 2026, www.ers.usda.gov/topics/food-nutrition-assistance/food-security-in-the-us/key-statistics-graphics.",
    url: "https://www.ers.usda.gov/topics/food-nutrition-assistance/food-security-in-the-us/key-statistics-graphics", usedIn: "Home and Map (state data file and 2001–2024 trend data)" },

  { text: "Hennigan, Mary. \"Minnesota Families Are Sinking under the Weight of Nation-Leading Child Care Costs.\" *Minnesota Reformer*, 12 May 2025, minnesotareformer.com/2025/05/12/minnesota-families-are-sinking-under-the-weight-of-nation-leading-child-care-costs/.",
    url: "https://minnesotareformer.com/2025/05/12/minnesota-families-are-sinking-under-the-weight-of-nation-leading-child-care-costs/", usedIn: "Game (Minneapolis center care, $1,500/month)" },

  { text: "\"HUD Fair Market Rents (FMRs) by State, County, and Metropolitan Areas.\" *HUD User*, U.S. Department of Housing and Urban Development, FY 2026, www.huduser.gov/portal/datasets/fmr.html.",
    url: "https://www.huduser.gov/portal/datasets/fmr.html", usedIn: "Game (rent)" },

  { text: "\"May 2025 Metropolitan and Nonmetropolitan Area Occupational Employment and Wage Estimates: Fargo, ND-MN.\" U.S. Bureau of Labor Statistics, www.bls.gov/oes/current/oes_22020.htm. Accessed 20 Nov. 2026.",
    url: "https://www.bls.gov/oes/current/oes_22020.htm", usedIn: "Game (Fargo cashier wage)",
    verify: "The BLS site blocked the automated check. Open the link and confirm the title and that it shows the cashier (41-2011) median wage." },

  { text: "\"Minneapolis Minimum Wage Increases to $16.37 for All Employers.\" City of Minneapolis, Dec. 2025, www.minneapolismn.gov/news/2025/december/minimum-wage/.",
    url: "https://www.minneapolismn.gov/news/2025/december/minimum-wage/", usedIn: "Game (Minneapolis wage)" },

  { text: "\"North Dakota.\" First Five Years Fund, www.ffyf.org/states/north-dakota/. Accessed 20 Nov. 2026.",
    url: "https://www.ffyf.org/states/north-dakota/", usedIn: "Game (North Dakota child care costs)",
    verify: "The site blocked the automated check. Open the link and confirm the page and the North Dakota figures." },

  { text: "Rabbitt, Matthew P., et al. *Household Food Security in the United States in 2024*. Economic Research Report no. 358, U.S. Department of Agriculture, Economic Research Service, 30 Dec. 2025, https://doi.org/10.32747/2025.9458834.ers.",
    url: "https://doi.org/10.32747/2025.9458834.ers", usedIn: "Home (13.7%), Map (state averages), Game (final statistic)" },

  { text: "\"SNAP Cost-of-Living Adjustment (COLA) Information.\" Food and Nutrition Administration, U.S. Department of Agriculture, www.fna.usda.gov/snap/allotment/cola. Accessed 20 Nov. 2026.",
    url: "https://www.fna.usda.gov/snap/allotment/cola", usedIn: "Game (SNAP FY2027 amounts)" },

  { text: "\"State Minimum Wage Laws.\" Wage and Hour Division, U.S. Department of Labor, www.dol.gov/agencies/whd/minimum-wage/state. Accessed 20 Nov. 2026.",
    url: "https://www.dol.gov/agencies/whd/minimum-wage/state", usedIn: "Game (North Dakota minimum wage)",
    verify: "The DOL site blocked the automated check. Open the link and confirm the title." },

  { text: "\"USDA Food Plans: Monthly Cost of Food Reports.\" Food and Nutrition Administration, U.S. Department of Agriculture, www.fna.usda.gov/research/cnpp/usda-food-plans/cost-food-monthly-reports. Accessed 20 Nov. 2026.",
    url: "https://www.fna.usda.gov/research/cnpp/usda-food-plans/cost-food-monthly-reports", usedIn: "Game (Thrifty Food Plan)" }
];
