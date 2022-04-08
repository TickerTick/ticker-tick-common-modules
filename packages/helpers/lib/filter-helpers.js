// * k means const, common convention in backend
export const kFullFilterObject = {
    storyTypes: {
        // Use the singular form
        financial_business_news: {
            value: "financial_business_news",
            label: "Best business news",
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
    languages: { en: { value: "en", label: "English" }, zh: { value: "zh", label: "Chinese" } },
};

export const kDefaultFilter = {
    // An empty array means all types are acceptable.
    storyTypes: [],
    exclusions: ["unimportant_sec_filing", "ugc"],
    languages: ["en"],
    // All options: us_rss, cn_rss,
    // This one is not exposed to users.
    // An empty array means all sources are acceptable.
    // source_types: [],
};

/**
 *
 * @param {*} filter : { languanges: ['en','zh']}
 * @returns {  languages: { en: true, zh: true}}
 */
export function convertFilter2KV(filter) {
    const langArray = filter?.languages || [];
    const exclArray = filter?.exclusions || [];
    const storyTypeArray = filter?.storyTypes || [];

    const filterKV = {
        languages: {},
        exclusions: {},
        storyTypes: {},
    };

    for (const lang of langArray) {
        filterKV.languages[lang] = true;
    }

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
 * @param {*} filter : {  languages: { en: true, zh: true}}
 * @returns { languanges: ['en','zh']}
 */
export function convertKV2Filter(filterKV) {
    const filter = {
        languages: [],
        exclusions: [],
        storyTypes: [],
    };

    const langObj = filterKV.languages;
    const exclObj = filterKV.exclusions;
    const storyTypesObj = filterKV.storyTypes;

    for (const [lang, langValueBool] of Object.entries(langObj)) {
        if (langValueBool) {
            filter.languages.push(lang);
        }
    }

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
