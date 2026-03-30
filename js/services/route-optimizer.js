'use strict';

window.RouteOptimizer = (() => {

  // Store chain categories for determining what they carry
  const CHAIN_CATEGORIES = {
    discounter: ['lidl', 'aldi', 'netto', 'penny'],
    vollsortimenter: ['rewe', 'edeka', 'kaufland'],
    drogerie: ['dm', 'rossmann'],
    bio: ['alnatura', 'bio company', 'basic'],
  };

  const CHAIN_PRODUCT_MAP = {
    discounter: ['lebensmittel', 'groceries', 'getraenke', 'drinks', 'snacks', 'suessigkeiten', 'tiefkuehl', 'koerperpflege', 'hygiene', 'haushalt', 'reinigung', 'household'],
    vollsortimenter: ['lebensmittel', 'groceries', 'getraenke', 'drinks', 'snacks', 'suessigkeiten', 'tiefkuehl', 'koerperpflege', 'hygiene', 'haushalt', 'reinigung', 'household', 'frische', 'fleisch', 'fisch', 'kaese', 'backwaren', 'obst', 'gemuese', 'baby', 'tiernahrung', 'gesundheit', 'health', 'bio', 'kosmetik'],
    drogerie: ['koerperpflege', 'hygiene', 'gesundheit', 'health', 'baby', 'haushalt', 'reinigung', 'household', 'kosmetik', 'drogerie'],
    bio: ['bio', 'lebensmittel', 'groceries', 'getraenke', 'drinks', 'snacks', 'koerperpflege', 'hygiene', 'obst', 'gemuese'],
  };

  function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function estimateDrivingTime(distanceKm, hour = new Date().getHours()) {
    let multiplier = 1.0;
    if ((hour >= 7 && hour < 9) || (hour === 7 && new Date().getMinutes() >= 30)) {
      multiplier = 1.5;
    }
    if (hour >= 7 && hour < 9) multiplier = 1.5;
    if (hour >= 16 && hour < 19) multiplier = 1.5;
    const avgSpeedKmh = 40;
    return (distanceKm / avgSpeedKmh) * 60 * multiplier;
  }

  function parseHour(timeStr) {
    if (!timeStr) return null;
    const parts = timeStr.replace('.', ':').split(':');
    const h = parseInt(parts[0], 10);
    const m = parts[1] ? parseInt(parts[1], 10) : 0;
    return h * 60 + m;
  }

  function isStoreOpen(store, date = new Date()) {
    if (!store || !store.openingHours) return false;
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayNamesDe = ['sonntag', 'montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag'];
    const dayIdx = date.getDay();
    const dayKey = dayNames[dayIdx];
    const dayKeyDe = dayNamesDe[dayIdx];

    const hours = store.openingHours[dayKey] || store.openingHours[dayKeyDe] ||
      store.openingHours[dayIdx] || null;

    if (!hours) return false;
    if (hours === 'closed' || hours === 'geschlossen') return false;

    const currentMinutes = date.getHours() * 60 + date.getMinutes();

    if (typeof hours === 'string') {
      const match = hours.match(/(\d{1,2}[:.]\d{2})\s*[-–]\s*(\d{1,2}[:.]\d{2})/);
      if (match) {
        const open = parseHour(match[1]);
        const close = parseHour(match[2]);
        if (open !== null && close !== null) {
          return currentMinutes >= open && currentMinutes < close;
        }
      }
    }

    if (Array.isArray(hours)) {
      return hours.some(slot => {
        const open = parseHour(slot.open || slot.from || slot[0]);
        const close = parseHour(slot.close || slot.to || slot[1]);
        if (open !== null && close !== null) {
          return currentMinutes >= open && currentMinutes < close;
        }
        return false;
      });
    }

    if (typeof hours === 'object' && (hours.open || hours.from)) {
      const open = parseHour(hours.open || hours.from);
      const close = parseHour(hours.close || hours.to);
      if (open !== null && close !== null) {
        return currentMinutes >= open && currentMinutes < close;
      }
    }

    return false;
  }

  function getChainType(store) {
    const chainLower = (store.chain || store.name || '').toLowerCase();
    for (const [type, chains] of Object.entries(CHAIN_CATEGORIES)) {
      if (chains.some(c => chainLower.includes(c))) return type;
    }
    return 'vollsortimenter';
  }

  function storeCarriesCategory(store, category) {
    const chainType = getChainType(store);
    const allowed = CHAIN_PRODUCT_MAP[chainType] || CHAIN_PRODUCT_MAP.vollsortimenter;
    if (!category) return chainType === 'vollsortimenter';
    const catLower = category.toLowerCase();
    return allowed.some(a => catLower.includes(a) || a.includes(catLower));
  }

  function findStoresForItems(shoppingList, stores) {
    const result = {};
    for (const store of stores) {
      result[store.id] = [];
    }

    for (const item of shoppingList) {
      if (item.checked) continue;
      const cat = (item.category || '').toLowerCase();
      const storeList = stores.filter(s => storeCarriesCategory(s, cat));
      if (storeList.length === 0) {
        const fallback = stores.find(s => getChainType(s) === 'vollsortimenter') || stores[0];
        if (fallback) result[fallback.id].push(item);
      } else {
        storeList[0] && result[storeList[0].id].push(item);
      }
    }

    return result;
  }

  function optimizeRoute(stops, startLat, startLng) {
    if (!stops || stops.length === 0) return [];
    const remaining = [...stops];
    const ordered = [];
    let currentLat = startLat;
    let currentLng = startLng;

    while (remaining.length > 0) {
      let nearestIdx = 0;
      let nearestDist = Infinity;
      for (let i = 0; i < remaining.length; i++) {
        const s = remaining[i];
        const d = haversineDistance(currentLat, currentLng, s.store.lat, s.store.lng);
        if (d < nearestDist) {
          nearestDist = d;
          nearestIdx = i;
        }
      }
      const nearest = remaining.splice(nearestIdx, 1)[0];
      nearest.distanceFromPrev = nearestDist;
      ordered.push(nearest);
      currentLat = nearest.store.lat;
      currentLng = nearest.store.lng;
    }

    return ordered;
  }

  function getOpeningStatus(store, date = new Date()) {
    const open = isStoreOpen(store, date);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayIdx = date.getDay();
    const hours = store.openingHours
      ? (store.openingHours[dayNames[dayIdx]] || store.openingHours[dayIdx] || null)
      : null;

    let hoursText = '';
    if (typeof hours === 'string' && hours !== 'closed' && hours !== 'geschlossen') {
      hoursText = hours;
    }

    if (open) {
      return hoursText ? `Geöffnet · ${hoursText}` : 'Geöffnet';
    } else {
      return hoursText ? `Geschlossen · Heute: ${hoursText}` : 'Geschlossen';
    }
  }

  function formatRoute(route) {
    if (!route || !route.stops || route.stops.length === 0) {
      return { stops: [], summary: 'Keine Route berechnet' };
    }

    const stops = route.stops.map((stop, idx) => {
      const arrivalStr = stop.arrivalTime
        ? stop.arrivalTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
        : '–';
      return {
        index: idx + 1,
        storeName: stop.store.name,
        storeChain: stop.store.chain,
        address: `${stop.store.address || ''}, ${stop.store.city || ''}`.trim().replace(/^,\s*/, ''),
        items: stop.items || [],
        itemCount: (stop.items || []).length,
        arrivalTime: arrivalStr,
        distanceFromPrev: stop.distanceFromPrev != null
          ? `${stop.distanceFromPrev.toFixed(1)} km`
          : idx === 0 ? 'Start' : '–',
      };
    });

    return {
      stops,
      totalDistance: `${(route.totalDistance || 0).toFixed(1)} km`,
      totalTime: `${Math.round(route.totalTime || 0)} Min.`,
      fuelCost: `${(route.fuelCost || 0).toFixed(2)} €`,
      warnings: route.warnings || [],
      summary: `${stops.length} ${stops.length === 1 ? 'Markt' : 'Märkte'} · ${(route.totalDistance || 0).toFixed(1)} km · ca. ${Math.round(route.totalTime || 0)} Min.`,
    };
  }

  return {
    optimize(shoppingList, stores, userLocation, settings = {}) {
      const warnings = [];

      if (!shoppingList || shoppingList.length === 0) {
        return { stops: [], totalDistance: 0, totalTime: 0, fuelCost: 0, warnings: ['Einkaufsliste ist leer.'] };
      }

      if (!stores || stores.length === 0) {
        return { stops: [], totalDistance: 0, totalTime: 0, fuelCost: 0, warnings: ['Keine Märkte ausgewählt.'] };
      }

      const userLat = userLocation?.lat ?? 52.52;
      const userLng = userLocation?.lng ?? 13.405;
      const fuelConsumption = settings.fuelConsumption ?? 7.5;
      const fuelPrice = settings.fuelPrice ?? 1.85;

      const uncheckedItems = shoppingList.filter(i => !i.checked);

      const storeItems = findStoresForItems(uncheckedItems, stores);

      const rawStops = stores
        .filter(s => (storeItems[s.id] || []).length > 0)
        .map(s => ({ store: s, items: storeItems[s.id] || [] }));

      if (rawStops.length === 0) {
        return { stops: [], totalDistance: 0, totalTime: 0, fuelCost: 0, warnings: ['Alle Artikel bereits eingekauft oder keine passenden Märkte.'] };
      }

      const now = new Date();
      for (const stop of rawStops) {
        if (!isStoreOpen(stop.store, now)) {
          warnings.push(`${stop.store.name} ist aktuell geschlossen.`);
        }
      }

      const optimized = optimizeRoute(rawStops, userLat, userLng);

      let totalDistance = 0;
      let totalTime = 0;
      let currentLat = userLat;
      let currentLng = userLng;
      let currentTime = new Date();

      const stops = optimized.map(stop => {
        const dist = stop.distanceFromPrev || haversineDistance(currentLat, currentLng, stop.store.lat, stop.store.lng);
        const driveMin = estimateDrivingTime(dist, currentTime.getHours());
        const shopMin = Math.max(10, (stop.items || []).length * 3);
        totalDistance += dist;
        totalTime += driveMin + shopMin;
        const arrivalTime = new Date(currentTime.getTime() + driveMin * 60000);
        currentTime = new Date(arrivalTime.getTime() + shopMin * 60000);
        currentLat = stop.store.lat;
        currentLng = stop.store.lng;

        return {
          store: stop.store,
          items: stop.items,
          arrivalTime,
          distance: dist,
          distanceFromPrev: dist,
        };
      });

      const fuelCost = (totalDistance / 100) * fuelConsumption * fuelPrice;

      return { stops, totalDistance, totalTime, fuelCost, warnings };
    },

    isStoreOpen,
    haversineDistance,
    getOpeningStatus,
    formatRoute,
  };
})();
