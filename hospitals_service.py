"""
hospitals_service.py
Nearby hospital search via Mapbox Search Box API (category search).
Docs: https://docs.mapbox.com/api/search/search-box/

Uses MAPBOX_SECRET_TOKEN from the server environment — never sent to the
browser. The frontend renders the returned coordinates on its own map using
the separate public MAPBOX_PUBLIC_TOKEN, and calls the Mapbox Directions API
directly (client-side) to draw the route.
"""

import os
import math

import requests

TOKEN = os.getenv("MAPBOX_SECRET_TOKEN", "")
SEARCH_URL = "https://api.mapbox.com/search/searchbox/v1/category/hospital"


def is_configured() -> bool:
    return bool(TOKEN)


def _haversine_km(lat1, lng1, lat2, lng2):
    R = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def nearby(lat: float, lng: float, limit: int = 8) -> list[dict]:
    if not is_configured():
        raise RuntimeError("Mapbox not configured. Set MAPBOX_SECRET_TOKEN in hackathon/.env")

    params = {
        "proximity": f"{lng},{lat}",
        "limit": limit,
        "access_token": TOKEN,
    }
    resp = requests.get(SEARCH_URL, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    results = []
    for feature in data.get("features", []):
        props = feature.get("properties", {})
        coords = feature.get("geometry", {}).get("coordinates", [None, None])
        h_lng, h_lat = coords[0], coords[1]
        if h_lat is None or h_lng is None:
            continue
        results.append({
            "name": props.get("name", "Unknown facility"),
            "address": props.get("full_address") or props.get("address", ""),
            "lat": h_lat,
            "lng": h_lng,
            "distance_km": round(_haversine_km(lat, lng, h_lat, h_lng), 2),
        })

    results.sort(key=lambda r: r["distance_km"])
    return results
