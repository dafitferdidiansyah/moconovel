// API Client Adapter for Local HTTP & Telegram Bot RPC Modes

const CONFIG_KEY = "wtr_reader_config";

export const getApiConfig = () => {
  const saved = localStorage.getItem(CONFIG_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
  }
  return {
    mode: "local", // "local" or "telegram"
    localApiUrl: "http://localhost:8000",
    telegramToken: "",
    telegramChatId: ""
  };
};

export const saveApiConfig = (config) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

// Helper for Telegram long-polling RPC
const callTelegramRpc = async (action, params = {}) => {
  const config = getApiConfig();
  const token = config.telegramToken;
  const chatId = config.telegramChatId;

  if (!token || !chatId) {
    throw new Error("Telegram Bot Token and Chat ID must be configured in settings!");
  }

  const reqId = "req_" + Math.random().toString(36).substring(2, 9) + Date.now();
  const payload = {
    id: reqId,
    action,
    ...params
  };

  // 1. Send REQUEST message to Telegram group
  const sendUrl = `https://api.telegram.org/bot${token}/sendMessage`;
  const sendResponse = await fetch(sendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: `REQUEST: ${JSON.stringify(payload)}`
    })
  });

  if (!sendResponse.ok) {
    throw new Error("Failed to send request to Telegram Bot API.");
  }

  // 2. Poll getUpdates to find the RESPONSE
  const startTime = Date.now();
  const timeoutMs = 25000; // 25 seconds timeout
  let lastUpdateId = 0;

  while (Date.now() - startTime < timeoutMs) {
    // Wait 1.5 seconds between polls to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const pollUrl = `https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId + 1}&timeout=5`;
    try {
      const pollRes = await fetch(pollUrl);
      const pollData = await pollRes.json();
      if (!pollData.ok) continue;

      for (const update of pollData.result) {
        lastUpdateId = Math.max(lastUpdateId, update.update_id);
        const msg = update.message;
        if (!msg) continue;

        const text = msg.text || "";
        const caption = msg.caption || "";

        // Check if message is a text RESPONSE matching our request ID
        if (text.startsWith("RESPONSE:")) {
          try {
            const respObj = JSON.parse(text.substring("RESPONSE:".length).strip || text.substring(9).trim());
            if (respObj.id === reqId) {
              if (respObj.status === "success") {
                return respObj.data;
              } else {
                throw new Error(respObj.message || "Unknown server error");
              }
            }
          } catch (e) {
            // Ignore parse errors for unrelated messages
          }
        }

        // Check if message is a file-document RESPONSE matching our request ID
        if (caption.startsWith("RESPONSE:") && msg.document) {
          try {
            const info = JSON.parse(caption.substring(9).trim());
            if (info.id === reqId && info.file) {
              // Retrieve file download path
              const getFileUrl = `https://api.telegram.org/bot${token}/getFile?file_id=${msg.document.file_id}`;
              const fileInfoRes = await fetch(getFileUrl);
              const fileInfo = await fileInfoRes.json();
              
              if (fileInfo.ok) {
                const filePath = fileInfo.result.file_path;
                const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
                
                // Fetch the actual JSON file content
                const fileContentRes = await fetch(downloadUrl);
                const fileData = await fileContentRes.json();
                
                if (fileData.status === "success") {
                  return fileData.data;
                } else {
                  throw new Error(fileData.message || "Error reading file payload");
                }
              }
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    } catch (e) {
      console.error("Error polling Telegram updates: ", e);
    }
  }

  throw new Error("Request to local Django server timed out via Telegram RPC.");
};

// Abstract API functions that check the current mode
export const fetchNovels = async (params = {}) => {
  const config = getApiConfig();
  if (config.mode === "local") {
    const query = new URLSearchParams(params).toString();
    const url = `${config.localApiUrl}/api/novels/${query ? `?${query}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch novels from local API");
    return await res.json();
  } else {
    return await callTelegramRpc("list_novels", { params });
  }
};

export const fetchNovel = async (id) => {
  const config = getApiConfig();
  if (config.mode === "local") {
    const res = await fetch(`${config.localApiUrl}/api/novels/${id}/`);
    if (!res.ok) throw new Error("Failed to fetch novel details");
    return await res.json();
  } else {
    return await callTelegramRpc("get_novel", { novel_id: parseInt(id) });
  }
};

export const fetchChapter = async (novelId, chapterNumber) => {
  const config = getApiConfig();
  if (config.mode === "local") {
    const res = await fetch(`${config.localApiUrl}/api/novels/${novelId}/chapters/${chapterNumber}/`);
    if (!res.ok) throw new Error("Failed to fetch chapter content");
    return await res.json();
  } else {
    return await callTelegramRpc("get_chapter", { 
      novel_id: parseInt(novelId), 
      chapter_number: parseInt(chapterNumber) 
    });
  }
};
