import { useCallback, useEffect, useRef, useState } from 'react';
import { convertHeicCoverUrl, isHeicCoverUrl } from '../../utils/book/coverUrl';

export function useCoverImageSrc(url, fallbackUrl = null) {
  const [src, setSrc] = useState(url || null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const triedConvertRef = useRef(false);
  const triedFallbackRef = useRef(false);
  const activeUrlRef = useRef(url);

  useEffect(() => {
    activeUrlRef.current = url;
    triedConvertRef.current = false;
    triedFallbackRef.current = false;
    setSrc(url || null);
    setLoading(false);
    setFailed(false);
  }, [url, fallbackUrl]);

  const onError = useCallback(() => {
    const currentUrl = activeUrlRef.current;
    if (!currentUrl) {
      setFailed(true);
      return;
    }

    const switchToFallback = () => {
      if (!fallbackUrl || currentUrl === fallbackUrl || triedFallbackRef.current) return false;
      triedFallbackRef.current = true;
      triedConvertRef.current = false;
      activeUrlRef.current = fallbackUrl;
      setSrc(fallbackUrl);
      setLoading(false);
      return true;
    };

    if (!isHeicCoverUrl(currentUrl)) {
      if (switchToFallback()) return;
      setFailed(true);
      return;
    }

    if (triedConvertRef.current) {
      if (switchToFallback()) return;
      setFailed(true);
      return;
    }

    triedConvertRef.current = true;

    setLoading(true);

    void convertHeicCoverUrl(currentUrl).then((displayUrl) => {
      if (activeUrlRef.current !== currentUrl) return;
      setLoading(false);
      if (displayUrl) {
        setSrc(displayUrl);
      } else if (switchToFallback()) {
        return;
      } else {
        setFailed(true);
      }
    });
  }, [fallbackUrl]);

  return { src, loading, failed, onError };
}
