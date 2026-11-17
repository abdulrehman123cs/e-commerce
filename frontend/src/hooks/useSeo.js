import { useEffect } from "react";
import { applySeo } from "../seo.js";

export function useSeo(options) {
  const {
    title,
    description,
    keywords,
    path,
    image,
    type,
    noindex,
    jsonLd,
  } = options || {};

  useEffect(() => {
    applySeo({
      title,
      description,
      keywords,
      path,
      image,
      type,
      noindex,
      jsonLd,
    });
  }, [title, description, keywords, path, image, type, noindex, jsonLd]);
}
