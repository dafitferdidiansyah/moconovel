export const PRIMARY_TAB_SEARCH = 'search';
export const PRIMARY_TAB_RANK = 'rank';
export const PRIMARY_TAB_RECOMMEND = 'recommend';
export const PRIMARY_TAB_OTHERS = 'others';

export const HOMEPAGE_SECTIONS = new Set(['realtime', 'guess']);

export const PRIMARY_TABS = [
  { id: PRIMARY_TAB_SEARCH, label: 'Search' },
  { id: PRIMARY_TAB_RANK, label: 'Rankings' },
  { id: PRIMARY_TAB_RECOMMEND, label: 'Recommend' },
  { id: PRIMARY_TAB_OTHERS, label: 'Other' },
];

export const PRIMARY_TAB_IDS = new Set(PRIMARY_TABS.map((tab) => tab.id));

export const RANK_SECONDARY_TABS = [
  { id: 'recommend', label: 'Recommendations' },
  { id: 'finished', label: 'Completed Novels' },
  { id: 'new', label: 'New Books' },
  { id: 'chasing', label: 'Updates Ranking' },
  { id: 'darkhorse', label: 'Dark Horse Ranking' },
  { id: 'peak', label: 'Peak Ranking' },
  { id: 'reading', label: 'Reading Ranking' },
];

export const RECOMMEND_SECONDARY_TABS = [
  { id: 'realtime', label: 'Live Trending' },
  { id: 'guess', label: 'You May Like' },
];

export const SECONDARY_TABS_BY_PRIMARY = {
  [PRIMARY_TAB_RANK]: RANK_SECONDARY_TABS,
  [PRIMARY_TAB_RECOMMEND]: RECOMMEND_SECONDARY_TABS,
};

export const DEFAULT_SECONDARY_BY_PRIMARY = {
  [PRIMARY_TAB_RANK]: 'recommend',
  [PRIMARY_TAB_RECOMMEND]: 'realtime',
};

export const PRIMARY_ERROR_MESSAGES = {
  [PRIMARY_TAB_SEARCH]: 'Search failed, please try again later.',
  [PRIMARY_TAB_RANK]: 'Failed to get rankings, please try again later.',
  [PRIMARY_TAB_RECOMMEND]: 'Failed to get recommendations, please try again later.',
};

export function resolveDiscoverRoute(tab, section) {
  const fallback = {
    activePrimary: PRIMARY_TAB_SEARCH,
    activeSecondary: null,
    secondaryTabs: [],
    redirectTab: PRIMARY_TAB_SEARCH,
    redirectSection: null,
  };

  if (!tab || !PRIMARY_TAB_IDS.has(tab)) {
    return fallback;
  }

  const activePrimary = tab;
  const secondaryTabs = SECONDARY_TABS_BY_PRIMARY[activePrimary] ?? [];
  const defaultSecondary = DEFAULT_SECONDARY_BY_PRIMARY[activePrimary];
  const hasSectionTab = activePrimary === PRIMARY_TAB_RANK || activePrimary === PRIMARY_TAB_RECOMMEND;

  if (section && !hasSectionTab) {
    return {
      activePrimary,
      activeSecondary: null,
      secondaryTabs,
      redirectTab: activePrimary,
      redirectSection: null,
    };
  }

  if (hasSectionTab && (!section || !secondaryTabs.some((t) => t.id === section))) {
    return {
      activePrimary,
      activeSecondary: defaultSecondary,
      secondaryTabs,
      redirectTab: activePrimary,
      redirectSection: defaultSecondary,
    };
  }

  return {
    activePrimary,
    activeSecondary: section ?? defaultSecondary,
    secondaryTabs,
    redirectTab: null,
    redirectSection: null,
  };
}
