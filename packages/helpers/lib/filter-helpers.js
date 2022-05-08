// * k means const, common convention in backend
export const kFullFilterObject = {
    storyTypes: {
        // Use the singular form
        financial_business_news: {
            value: "financial_business_news",
            label: "Best business news",
        },
        analysis: {
            value: "analysis",
            label: "Stock analysis",
        },
        industry: {
            value: "industry",
            label: "Industry publication",
        },
        most_relevant: {
            value: "most_relevant",
            label: "Most relevant news",
        },
        sec_filing: { value: "sec_filing", label: "SEC filing" },
        financial_sec_filing: {
            value: "financial_sec_filing",
            label: "Quarterly/Annual report SEC filing",
        },
        ipo_sec_filing: { value: "ipo_sec_filing", label: "IPO SEC filing" },
        earnings_call: {
            value: "earnings_call",
            label: "Earnings Call",
        },
        trading_activity: { value: "trading_activity", label: "Trading Activity" },
        market_news: { value: "market_news", label: "Market News" },
    },
    exclusions: {
        unimportant_sec_filing: {
            value: "unimportant_sec_filing",
            label: "Less important SEC filing",
        },
        ugc: { value: "ugc", label: "UGC stories (e.g. Reddit)" },
        trading_activity: { value: "trading_activity", label: "Trading Activity" },
        market_news: { value: "market_news", label: "Market News" },
    },
};

export const kDefaultFilter = {
    // An empty array means all types are acceptable.
    storyTypes: [],
    exclusions: ["unimportant_sec_filing", "ugc"],
    // All options: us_rss, cn_rss,
    // This one is not exposed to users.
    // An empty array means all sources are acceptable.
    // source_types: [],
};

/**
 *
 */
export function convertFilter2KV(filter) {
    const exclArray = filter?.exclusions || [];
    const storyTypeArray = filter?.storyTypes || [];

    const filterKV = {
        exclusions: {},
        storyTypes: {},
    };

    for (const excl of exclArray) {
        filterKV.exclusions[excl] = true;
    }

    for (const storyType of storyTypeArray) {
        filterKV.storyTypes[storyType] = true;
    }

    return filterKV;
}

/**
 *
 */
export function convertKV2Filter(filterKV) {
    const filter = {
        exclusions: [],
        storyTypes: [],
    };

    const exclObj = filterKV.exclusions;
    const storyTypesObj = filterKV.storyTypes;

    for (const [excl, exclValueBool] of Object.entries(exclObj)) {
        if (exclValueBool) {
            filter.exclusions.push(excl);
        }
    }

    for (const [storyType, storyTypeValueBool] of Object.entries(storyTypesObj)) {
        if (storyTypeValueBool) {
            filter.storyTypes.push(storyType);
        }
    }

    return filter;
}
