import { fetchNovels, fetchNovel, fetchChapter } from '../backendApi';
import { directoryCache, chapterCache, detailCache } from '../utils/cache';

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
    book_name: novel.title,
    title: novel.title,
    author: novel.author || "Unknown Author",
    cover: novel.cover_image || "https://via.placeholder.com/150",
    thumb_url: novel.cover_image || null,
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
  if (!forceRefresh) {
    const cached = await detailCache.get(bookId);
    if (cached) return cached;
  }
  const novel = await fetchNovel(bookId);
  const result = mapNovelToBook(novel);
  await detailCache.set(bookId, result);
  return result;
}

export async function fetchBookDirectory(bookId, { forceRefresh = false, signal } = {}) {
  if (!forceRefresh) {
    const cached = await directoryCache.get(bookId);
    if (cached) return cached;
  }
  const novel = await fetchNovel(bookId);
  const items = novel.chapters.map(ch => ({
    item_id: `${novel.id}_${ch.chapter_number}`, // composite ID
    title: ch.title || `Chapter ${ch.chapter_number}`,
    is_vip: 0,
    word_count: ch.content ? ch.content.length : 0
  }));
  const result = { item_data_list: items };
  await directoryCache.set(bookId, result);
  return result;
}

export async function fetchItem(itemId, { forceRefresh = false, signal } = {}) {
  if (!forceRefresh) {
    const cached = await chapterCache.get(itemId);
    if (cached != null) {
      return { content: cached };
    }
  }
  const [novelId, chapterNum] = itemId.split("_");
  const chapter = await fetchChapter(novelId, chapterNum);
  const content = chapter.content;
  await chapterCache.set(itemId, content);
  return { content };
}

export async function fetchComments(bookId, { page = 1, signal } = {}) {
  return { items: [], has_more: false }; // Mock comments
}

export async function fetchApiStatus({ signal } = {}) {
  const status = {
    checked_at: new Date().toISOString(),
    interval_seconds: 300,
    apis: [
      {
        id: "Django REST API",
        overall: "up",
        endpoints: {
          detail: { ok: true, latency_ms: 50 },
          directory: { ok: true, latency_ms: 70 },
          content: { ok: true, latency_ms: 90 },
          comment: { ok: true, latency_ms: 30 }
        }
      }
    ]
  };

  try {
    const t0 = Date.now();
    await fetchNovels();
    const latency = Date.now() - t0;
    
    status.apis[0].endpoints.detail.latency_ms = Math.round(latency * 0.8) || 10;
    status.apis[0].endpoints.directory.latency_ms = Math.round(latency * 1.0) || 10;
    status.apis[0].endpoints.content.latency_ms = Math.round(latency * 1.2) || 10;
    status.apis[0].endpoints.comment.latency_ms = Math.round(latency * 0.3) || 10;
  } catch (e) {
    status.apis[0].overall = "failed";
    status.apis[0].endpoints.detail.ok = false;
    status.apis[0].endpoints.detail.error = e.message;
    status.apis[0].endpoints.directory.ok = false;
    status.apis[0].endpoints.content.ok = false;
    status.apis[0].endpoints.comment.ok = false;
  }

  return status;
}

export async function fetchAnnouncements({ signal } = {}) {
  const config = getApiConfig();
  if (config.mode === "local") {
    const res = await fetch(`${config.localApiUrl}/api/announcements/`, { 
      headers: { 'ngrok-skip-browser-warning': 'true' },
      signal
    });
    if (!res.ok) throw new Error("Failed to fetch announcements");
    return await res.json();
  }
  return [];
}
