export function buildQueryString(filters, page = 1) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  // Skip page param kung reference search (iisa lang naman ang result)
  const isReferenceSearch = !!filters.reference;

  if (!isReferenceSearch && page && page > 1) {
    params.append("page", page);
  }

  return params.toString();
}
