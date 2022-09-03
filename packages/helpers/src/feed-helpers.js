/* eslint-disable no-unused-vars */
import { kDefaultFilter } from "./filter-helpers.js";
import queryString from "query-string";

const TICKER_TICK_SITE_REGEX = new RegExp("^https://.*tickertick.com/");
const HIGH_QUALITY_SOURCE_TYPE = [
  "us_rss",
  "us_sec",
];

const FIN_BIZ_NEWS_QUERY = "T:fin_news";

const ANALYSIS_QUERY = "T:analysis";

const INDUSTRY_QUERY = "T:industry";

const EARNINGS_CALL_QUERY = "T:earning";

const MARKET_NEWS_QUERY = "T:market";

const TRADING_ACTIVITY_QUERY = "T:trade";

const SEC_FILING_QUERY = "(and s:sec tld:gov)";

const GOV_QUERY = "(diff tld:gov s:sec)";

// Note that foreign companies' 6-k forms for quarterly earnings
// are not included here.
const FINANCIAL_SEC_FILING_QUERY = "T:sec_fin";

const IPO_SEC_QUERY = "T:sec_ipo";

const SEC_IMPORTANT_FILING_QUERY = "T:sec_important";

const UNIMPORTANT_SEC_FILING_QUERY = `
(diff 
    ${SEC_FILING_QUERY}
    ${SEC_IMPORTANT_FILING_QUERY}
)
`;

const UGC_QUERY = "T:ugc";

const kExclusionQueryMap = {
  unimportant_sec_filing: UNIMPORTANT_SEC_FILING_QUERY,
  ugc: UGC_QUERY,
  trading_activity: TRADING_ACTIVITY_QUERY,
  market_news: MARKET_NEWS_QUERY,
};

const BEST_TAG = ".best.";

const kStoryTypeQueryMap = {
  sec_filing: SEC_FILING_QUERY,
  financial_sec_filing: FINANCIAL_SEC_FILING_QUERY,
  ipo_sec_filing: IPO_SEC_QUERY,
  earnings_call: EARNINGS_CALL_QUERY,
  trading_activity: TRADING_ACTIVITY_QUERY,
  market_news: MARKET_NEWS_QUERY,
  financial_business_news: FIN_BIZ_NEWS_QUERY,
  analysis: ANALYSIS_QUERY,
  industry: INDUSTRY_QUERY,
  government: GOV_QUERY,
};

const kSecStoryTypes = new Set([
  "earnings_call",
  "sec_filing",
  "financial_sec_filing",
  "ipo_sec_filing",
]);

const isValidUrl = (url) => {
  let isValid = false;
  try {
    new URL(url);
    isValid = true;
  } catch (e) {
    console.error("Invalid URL: " + url);
  }
  return isValid;
};
const isBest = function (story) {
  if (story.tags && story.tags.indexOf(BEST_TAG) >= 0) {
    return true;
  }
  if (story.best) {
    return true;
  }
  return false;
};

export function extractTopStories(stories, minClusterSize=3) {
  let topStories = [];

  for (let story of stories) {
    let isTopStory = false;
    if (minClusterSize == 1) {
      isTopStory = isBest(story);
    } else if (story.similar_stories) {
      if (1 + story.similar_stories.length >= minClusterSize) {
        isTopStory = true;
      } else if (isBest(story)) {
        isTopStory = true;
      } else if (story.similar_stories_full) {
        for (let ss of story.similar_stories_full) {
          if (isBest(story)) {
            isTopStory = true;
            break;
          }
        }
      }
    }
    if (isTopStory) {
      topStories.push(story);
    }
  }
  return topStories;
}

export function getTopStories(stories) {
  for (let clusterSize = 3; clusterSize >= 1; --clusterSize) {
    let top_stories = extractTopStories(stories, clusterSize);
    if (top_stories.length > 0) {
      return top_stories;
    }
  }
  return stories;
}

// May throw an exception
export async function fetchStories(feedUrl) {
  const response = await fetch(feedUrl);
  if (response.status !== 200) {
    if (window) {
      window.Swal.fire("Try again?", "FAILED TO FETCH FEEDS", "error");
    }
    return;
  }
  let result = await response.json();
  let id_to_story = new Map();
  let similar_stories = new Set();
  let removed_stories = new Set();
  for (let story of result.stories) {
    if (isBest(story)) {
      story.best = true;
      let bestIdx = story.tags.indexOf(BEST_TAG);
      if (bestIdx >= 0) {
        story.tags.splice(bestIdx, 1);
        if (story.tags.length == 0) {
          delete story.tags;
        }
      }
    }
    // Remove 'favicon_url' to any other site.
    if (story.favicon_url && !story.favicon_url.match(TICKER_TICK_SITE_REGEX)) {
      delete story.favicon_url;
    }
    // Remove invalid 'url'
    if (!isValidUrl(story.url)) {
      removed_stories.add(story.id);
    }
    id_to_story[story.id] = story;
    if (story.similar_stories) {
      for (let similar_story_id of story.similar_stories) {
        similar_stories.add(similar_story_id);
      }
    }
  }

  let primary_stories = [];
  for (let story of result.stories) {
    if (similar_stories.has(story.id) || removed_stories.has(story.id)) {
      continue;
    }
    if (story.similar_stories) {
      story.similar_stories_full = [];
      for (let sid of story.similar_stories) {
        if (!removed_stories.has(sid)) {
          story.similar_stories_full.push(id_to_story[sid]);
        }
      }
    }
    primary_stories.push(story);
  }
  result.stories = primary_stories;
  return result;
}

function getBlockedWebsitesTerm(blocked_websites) {
  const blocked_websites_terms = blocked_websites.map(
    (website) => {
        const parts = website.split(".");
        if (parts.length < 2) {
            // Not a valid website
            return "";
        }
        const domain_term = "s:" + parts[0];
        const tld_term = "tld:" + parts.slice(1).join(".");
        return `(and ${domain_term} ${tld_term})`
    }
  ).filter(
    // Remove empty terms
    (term) => term.length > 0
  );
  if (blocked_websites_terms.length == 0) {
    return null;
  }
  if (blocked_websites_terms.length == 1) {
    return blocked_websites_terms[0];
  }  
  return `(or ${blocked_websites_terms.join(" ")})`;
}

export const buildFeedUrlParameters = (tickers, filters, opts = {}) => {
  if (typeof tickers === "string") {
    tickers = [tickers];
  }

  filters = Object.assign(kDefaultFilter, filters);

  const { lastId, useSourceTypes, blocked_websites} = opts;

  const params = new URLSearchParams();

  // Return true iff the filters only look for SEC stories.
  const onlySecStories = (story_types) => {
    let non_sec_types = 0;
    let types = 0;
    for (let type of story_types) {
      if (kStoryTypeQueryMap[type]) {
        types++;
        if (!kSecStoryTypes.has(type)) {
          non_sec_types++;
        }
      }
    }
    return types > 0 && non_sec_types == 0;
  };
  const only_sec_stories = onlySecStories(filters.storyTypes);
  let ticker_term_prefix = "tt:";
  if (only_sec_stories) {
    // This is an optimization to help the backend retrieve stories faster.
    ticker_term_prefix = "t0:";
  }
  const or_terms = tickers.map((t) => {
    const term = ticker_term_prefix + t;
    if (only_sec_stories) {
      return term;
    }
    // "TT:" only matches titles.
    const title_term = ticker_term_prefix.toUpperCase() + t;
    const high_prio_story_type_queries = [
      FIN_BIZ_NEWS_QUERY,
      ANALYSIS_QUERY,
      INDUSTRY_QUERY,
      EARNINGS_CALL_QUERY,
    ];
    const top_type_terms = `(or ${high_prio_story_type_queries.join(" ")})`;
    // Only fin news stories can match descriptions. 
    return `(or ${title_term} (and tag:${BEST_TAG} ${term} ${top_type_terms}))`;
  });
  let query = `(or ${or_terms.join(" ")})`;

  if (useSourceTypes) {
    // ( and (or ) (or ) )
    query = `(and ${query} (or ${HIGH_QUALITY_SOURCE_TYPE.map(
      (t) => "st:" + t
    ).join(" ")}))`;
  }
  if (lastId) {
    params.append("last", lastId);
  }
  const extractSubqueries = (key_to_subquery_map, key_array) => {
    let queries = [];
    for (let key of key_array) {
      if (key_to_subquery_map[key]) {
        queries.push(key_to_subquery_map[key]);
      } else if (key == "most_relevant") {
        const t0_or = tickers.map((t) => "T0:" + t).join(" ");
        queries.push(`(or ${FIN_BIZ_NEWS_QUERY} (or ${t0_or}))`);
      }
    }
    return queries;
  };
  let n = 101;
  const story_type_queries = extractSubqueries(
    kStoryTypeQueryMap,
    filters.storyTypes
  );
  if (story_type_queries.length > 0) {
    query = `(and ${query} (or ${story_type_queries.join(" ")}))`;
    // It takes much longer time for the backend to retrieve the same number
    // of stories with story type constraints than without them.
    // Therefore, reduce 'n' here to shorten story fetching time.
    n = 51;
  }

  let exclusion_queries = extractSubqueries(
    kExclusionQueryMap,
    filters.exclusions
  );
  if (blocked_websites) {
    const blocked_websites_or_term = getBlockedWebsitesTerm(blocked_websites);
    if (blocked_websites_or_term) {
        exclusion_queries.push(blocked_websites_or_term);
    }
  }

  if (exclusion_queries.length > 0) {
    query = `(diff ${query} (or ${exclusion_queries.join(" ")}))`;
  }
  // http protocal doesn't limit the url length.
  // The TickerTick backend http server doesn't have a limit either.
  if (query.length > 4000) {
    console.error(
      `Backend search query too long (${query.length} bytes) for filters: ${filters}`
    );
  }
  params.append("n", n);
  params.append("q", query);
  return params;
};

export const buildUrlWithUtmParams = (url, utmParams) => {
  const urlObj = new URL(url);
  const parsed = queryString.parse(urlObj.search);
  const newUrlSearch = queryString.stringify({
    ...parsed,
    utm_source: utmParams.utm_source,
    utm_campaign: utmParams.utm_campaign,
    utm_medium: utmParams.utm_medium,
  });

  urlObj.search = `?${newUrlSearch}`;
  return urlObj.toString(); // urlObj.href also works
};
