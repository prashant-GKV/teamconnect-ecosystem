const getEnv = (key: string, fallback?: string): string => {
  const val = process.env[key] ?? fallback;
  if (val === undefined) throw new Error(`Missing env var: ${key}`);
  return val;
};

export const clientEnv = {
  API_BASE_URL: getEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:4000/api/v1"),
  USE_MOCKS:    process.env["NEXT_PUBLIC_USE_MOCKS"] !== "false",
} as const;
