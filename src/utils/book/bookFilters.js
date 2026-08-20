export const EMPTY_BOOK_FILTERS = {
  categories: {}, // maps category/genre name -> 'include' | 'exclude' | 'neutral'
  status: '',
  wordCount: '',
};

export const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'ongoing', label: 'Ongoing' },
];

export const WORD_COUNT_FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'under30', label: '300k-' },
  { value: '30to50', label: '30-500k' },
  { value: '50to100', label: '50-1000k' },
  { value: '100to200', label: '100-2000k' },
  { value: 'over200', label: '2000k+' },
];

const WORD_COUNT_RANGES = {
  under30: { max: 300_000 },
  '30to50': { min: 300_000, max: 500_000 },
  '50to100': { min: 500_000, max: 1_000_000 },
  '100to200': { min: 1_000_000, max: 2_000_000 },
  over200: { min: 2_000_000 },
};

export function hasActiveBookFilters(filters = EMPTY_BOOK_FILTERS) {
  const hasActiveCategories = filters.categories && Object.values(filters.categories).some(state => state === 'include' || state === 'exclude');
  return Boolean(hasActiveCategories || filters.status || filters.wordCount);
}

const STATUS_FILTER_VALUES = new Set(STATUS_FILTER_OPTIONS.map((option) => option.value));
const WORD_COUNT_FILTER_VALUES = new Set(WORD_COUNT_FILTER_OPTIONS.map((option) => option.value));

export function normalizeBookFilters(raw) {
  if (!raw || typeof raw !== 'object') return { ...EMPTY_BOOK_FILTERS };
  
  let categories = {};
  if (raw.categories && typeof raw.categories === 'object') {
    categories = raw.categories;
  } else if (typeof raw.category === 'string' && raw.category) {
    categories = { [raw.category]: 'include' };
  }
  
  return {
    categories,
    status: STATUS_FILTER_VALUES.has(raw.status) ? raw.status : '',
    wordCount: WORD_COUNT_FILTER_VALUES.has(raw.wordCount) ? raw.wordCount : '',
  };
}

export function normalizeBookFilterState(raw) {
  if (!raw || typeof raw !== 'object') {
    return { filters: { ...EMPTY_BOOK_FILTERS }, expanded: false };
  }
  return {
    filters: normalizeBookFilters(raw.filters ?? raw),
    expanded: Boolean(raw.expanded),
  };
}

function parseWordCount(raw) {
  if (raw === '0' || raw == null || raw === '') return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

/** @param {object|null|undefined} detail */
export function extractBookFilterMeta(detail) {
  const d = detail || {};
  return {
    category: d.category || '',
    creationStatus: d.creation_status ?? '',
    wordCount: parseWordCount(d.word_number),
  };
}

/** @param {object} book */
export function extractDiscoverBookFilterMeta(book) {
  return extractBookFilterMeta(book?.book_info || book);
}

/** @param {Array} items */
export function collectCategoriesFromItems(items, getMeta) {
  const categories = new Set();
  items.forEach((item) => {
    const categoryStr = getMeta(item)?.category;
    if (categoryStr) {
      categoryStr.split(',').forEach(c => {
        const trimmed = c.trim();
        if (trimmed) categories.add(trimmed);
      });
    }
  });
  return [...categories].sort((a, b) => a.localeCompare(b, 'zh-Hant'));
}

function matchesWordCountFilter(wordCount, filterKey) {
  if (!filterKey) return true;
  if (wordCount == null) return false;
  const range = WORD_COUNT_RANGES[filterKey];
  if (!range) return true;
  if (range.min != null && wordCount < range.min) return false;
  if (range.max != null && wordCount >= range.max) return false;
  return true;
}

function matchesStatusFilter(creationStatus, filterKey) {
  if (!filterKey) return true;
  if (filterKey === 'completed') return creationStatus === '0';
  if (filterKey === 'ongoing') return Boolean(creationStatus) && creationStatus !== '0';
  return true;
}

function matchesCategoryFilter(categoryStr, filterCategories = {}) {
  const bookGenres = categoryStr ? categoryStr.split(',').map(c => c.trim()) : [];
  
  for (const [catName, state] of Object.entries(filterCategories)) {
    if (state === 'include') {
      if (!bookGenres.includes(catName)) return false;
    } else if (state === 'exclude') {
      if (bookGenres.includes(catName)) return false;
    }
  }
  return true;
}

/** @param {object|null|undefined} meta */
export function bookMatchesFilters(meta, filters = EMPTY_BOOK_FILTERS) {
  if (!hasActiveBookFilters(filters)) return true;
  if (!meta) return true;

  return (
    matchesCategoryFilter(meta.category, filters.categories)
    && matchesStatusFilter(meta.creationStatus, filters.status)
    && matchesWordCountFilter(meta.wordCount, filters.wordCount)
  );
}

/** @param {Array} items @param {Function} getMeta @param {object} filters @param {Array} options @param {string} filterKey */
export function computeBookFilterOptionCounts(items, getMeta, filters, options, filterKey) {
  const counts = {};
  for (const option of options) {
    let testFilters = { ...filters };
    if (filterKey === 'category') {
      if (option.value) {
        testFilters.categories = { ...filters.categories, [option.value]: 'include' };
      } else {
        testFilters.categories = {};
      }
    } else {
      testFilters[filterKey] = option.value;
    }
    
    let count = 0;
    for (const item of items) {
      if (bookMatchesFilters(getMeta(item), testFilters)) count += 1;
    }
    counts[option.value || ''] = count;
  }
  return counts;
}
