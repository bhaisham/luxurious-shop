import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}

const SITE_NAME = 'Luxurious Shop';
const BASE_URL = 'https://luxuriousshop.mu';

export function SEO({ title, description, path = '', image }: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${BASE_URL}${path}`;
  const desc = description || 'Premium retail shop in Port Louis, Mauritius. Discover carefully selected products and contact us for enquiries.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  );
}

export function useScrollTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
}
