import { fetchNovels, fetchNovel, fetchChapter } from '../backendApi';

// Mock API Service toggles
export function getApiService() {
  return localStorage.getItem('apiService') || 'custom';
}

export function setApiService(apiId) {
  localStorage.setItem('apiService', apiId);
}

// Mappers
function mapNovelToBook(novel) {
  return {
    book_id: novel.id.toString(),
    title: novel.title,
    author: novel.author || "Unknown",
    cover: novel.cover_image || "https://via.placeholder.com/150",
    category: novel.genres ? Object.keys(novel.genres).join(", ") : "Uncategorized",
    word_count: 0, // Mock
    abstract: novel.description || "No description available.",
    status: novel.status === "Ongoing" ? 0 : 1 // 0=ongoing, 1=completed (guess for Fanqie)
  };
}

export async function fetchHomepageBookList(section, { signal } = {}) {
  // Map sections to params if needed
  const novels = await fetchNovels();
  return novels.map(mapNovelToBook);
}

export async function fetchRankBookList(board, { signal } = {}) {
  const novels = await fetchNovels({ sort: "Popular" });
  return novels.map(mapNovelToBook);
}

export async function fetchSearchBooks(query, { signal } = {}) {
  const params = query ? { q: query } : {};
  const novels = await fetchNovels(params);
  return novels.map(mapNovelToBook);
}

export async function fetchBookDetail(bookId, { forceRefresh = false, signal } = {}) {
  const novel = await fetchNovel(bookId);
  return {
    book_info: mapNovelToBook(novel),
    statistics: { read_count: 0, like_count: 0 } // Mock
  };
}

export async function fetchBookDirectory(bookId, { forceRefresh = false, signal } = {}) {
  const novel = await fetchNovel(bookId);
  const items = novel.chapters.map(ch => ({
    item_id: `${novel.id}_${ch.chapter_number}`, // composite ID
    title: ch.title || `Chapter ${ch.chapter_number}`,
    is_vip: 0,
    word_count: ch.content ? ch.content.length : 0
  }));
  return { item_list: items };
}

export async function fetchItem(itemId, { forceRefresh = false, signal } = {}) {
  const [novelId, chapterNum] = itemId.split("_");
  const chapter = await fetchChapter(novelId, chapterNum);
  
  // Format content as HTML paragraphs if it's plain text
  const formattedContent = chapter.content
    .split("\n")
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => `<p>${p}</p>`)
    .join("");

  return { content: formattedContent };
}

export async function fetchComments(bookId, { page = 1, signal } = {}) {
  return { items: [], has_more: false }; // Mock comments
}

export async function fetchApiStatus({ signal } = {}) {
  return { status: "ok" };
}

export async function fetchAnnouncements({ signal } = {}) {
  return []; // Mock announcements
}

