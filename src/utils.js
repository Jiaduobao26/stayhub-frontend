const domain = process.env.REACT_APP_API_URL;
const TOKEN_KEY = "authToken";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
});

const request = (url, options = {}) =>
  fetch(url, options).then(async (res) => {
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? `Request failed: ${res.status}`);
    }
    const ct = res.headers.get("content-type") ?? "";
    return ct.includes("application/json") ? res.json() : undefined;
  });

export const login = (credential) =>
  request(`${domain}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credential),
  });

export const register = (credential) =>
  request(`${domain}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credential),
  });

export const getReservations = () =>
  request(`${domain}/bookings`, {
    headers: authHeaders(),
  });

export const getStaysByHost = () =>
  request(`${domain}/listings`, {
    headers: authHeaders(),
  });

export const searchStays = (query) => {
  const url = new URL(`${domain}/listings/search`);
  url.searchParams.append("guest_number", query.guest_number);
  url.searchParams.append("checkin_date", query.checkin_date.format("YYYY-MM-DD"));
  url.searchParams.append("checkout_date", query.checkout_date.format("YYYY-MM-DD"));
  // TODO: get lat/lon/distance from user location or search input
  // example: lat=37, lon=-122, distance=500000 (San Francisco Bay Area, meters)
  url.searchParams.append("lat", query.lat);
  url.searchParams.append("lon", query.lon);
  url.searchParams.append("distance", query.distance);
  return request(url, { headers: authHeaders() });
};

export const deleteStay = (stayId) =>
  request(`${domain}/listings/${stayId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

export const bookStay = (data) =>
  request(`${domain}/bookings`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const cancelReservation = (reservationId) =>
  request(`${domain}/bookings/${reservationId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

export const getReservationsByStay = (stayId) =>
  request(`${domain}/listings/${stayId}/bookings`, {
    headers: authHeaders(),
  });

export const uploadStay = (data) =>
  request(`${domain}/listings`, {
    method: "POST",
    headers: authHeaders(),
    body: data,
  });
