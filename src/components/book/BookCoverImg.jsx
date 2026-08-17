import { useEffect } from 'react';
import { useCoverImageSrc } from '../../hooks/book/useCoverImageSrc';

function BookCoverImg({
  url,
  fallbackUrl = null,
  alt = '',
  ImgComponent = 'img',
  Placeholder = null,
  onFailed,
  ...props
}) {
  const { src, loading, failed, onError } = useCoverImageSrc(url, fallbackUrl);

  useEffect(() => {
    if (failed) onFailed?.();
  }, [failed, onFailed]);

  if (!url || failed) return null;

  if (loading && Placeholder) {
    return <Placeholder aria-busy="true">Converting</Placeholder>;
  }

  if (!src) return null;

  return (
    <ImgComponent
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={onError}
      {...props}
    />
  );
}

export default BookCoverImg;
