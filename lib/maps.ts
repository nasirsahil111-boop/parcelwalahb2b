/**
 * Google Maps Distance Matrix lookup. Returns null when the API key is
 * absent or the lookup fails — callers then fall back to a clearly
 * labelled manual km entry. A Maps result is NEVER faked.
 */
export async function getDistanceKm(
  origin: string,
  destination: string
): Promise<{ km: number; text: string } | null> {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) return null;
  try {
    const url =
      `https://maps.googleapis.com/maps/api/distancematrix/json` +
      `?origins=${encodeURIComponent(origin)}` +
      `&destinations=${encodeURIComponent(destination)}` +
      `&mode=driving&key=${encodeURIComponent(key)}`;
    const res = await fetch(url);
    const data = await res.json();
    const el = data?.rows?.[0]?.elements?.[0];
    if (el?.status === "OK" && el?.distance?.value) {
      return { km: el.distance.value / 1000, text: el.distance.text };
    }
    return null;
  } catch {
    return null;
  }
}

export function hasMapsKey(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
}
