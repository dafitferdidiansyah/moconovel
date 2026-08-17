/** @returns {{ key: string, text: string }[]} */
export function getCoverMetaEntries(sortBy, {
  score,
  lastPublishTime,
  wordCount,
  category,
  chapterCount,
  convertedWordCount,
  convertedCategory,
}) {
  switch (sortBy) {
    case 'default':
    case 'manual':
      return (convertedCategory || category)
        ? [{ key: 'category', text: convertedCategory || category }]
        : [];
    case 'rating':
      return score ? [{ key: 'score', text: `Rating ${score}` }] : [];
    case 'update':
      return lastPublishTime
        ? [{ key: 'update', text: `Update ${lastPublishTime}` }]
        : [];
    case 'chapters':
      return [{
        key: 'chapters',
        text: chapterCount ? `Total ${chapterCount} Chapter` : 'No chapter information',
      }];
    case 'words':
      return (convertedWordCount || wordCount)
        ? [{ key: 'words', text: `${convertedWordCount || wordCount} words` }]
        : [];
    default:
      return [];
  }
}
