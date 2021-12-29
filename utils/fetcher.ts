const fetcher = (...args: unknown[]) =>
  fetch(...args).then((res) => res.json());

export default fetcher