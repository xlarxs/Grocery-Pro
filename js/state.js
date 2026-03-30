window.AppState = (() => {
  const STORAGE_KEY = 'grocery-pro-state';

  const DEFAULT_STATE = {
    currentView: 'list',
    darkMode: false,
    shoppingList: [],
    selectedStores: [],
    budget: {
      total: 100,
      spent: 0,
      currency: 'EUR'
    },
    route: null,
    userLocation: { lat: 48.8756, lng: 9.3984 },
    filters: {
      stores: { chains: [], types: [], openNow: false },
      products: { categories: [], organic: false, vegan: false }
    },
    purchaseHistory: [],
    priceHistory: {},
    settings: {
      defaultBudget: 100,
      fuelConsumption: 7,
      fuelPrice: 1.80,
      preferredChains: [],
      notifications: true
    }
  };

  const listeners = new Set();

  function deepMerge(target, source) {
    if (source === null || typeof source !== 'object' || Array.isArray(source)) {
      return source;
    }
    const result = Object.assign({}, target);
    for (const key of Object.keys(source)) {
      if (
        source[key] !== null &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        target[key] !== null &&
        typeof target[key] === 'object' &&
        !Array.isArray(target[key])
      ) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  function loadPersistedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return deepMerge({}, DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return deepMerge(DEFAULT_STATE, parsed);
    } catch {
      return deepMerge({}, DEFAULT_STATE);
    }
  }

  function persistState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage might be full or unavailable
    }
  }

  function emitStateChanged(state, changes) {
    window.dispatchEvent(new CustomEvent('state-changed', {
      detail: { state, changes }
    }));
  }

  function notifyListeners(state, changes) {
    for (const listener of listeners) {
      try {
        listener(state, changes);
      } catch (e) {
        console.error('AppState listener error:', e);
      }
    }
  }

  let state = loadPersistedState();

  function makeItemId() {
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  const actions = {
    ADD_LIST_ITEM(payload) {
      const item = Object.assign({
        id: makeItemId(),
        productId: null,
        name: '',
        brand: '',
        category: '',
        quantity: 1,
        unit: 'Stk',
        estimatedPrice: 0,
        actualPrice: null,
        checked: false,
        storeId: null,
        addedAt: new Date().toISOString(),
        notes: ''
      }, payload);
      return { shoppingList: [...state.shoppingList, item] };
    },

    REMOVE_LIST_ITEM(payload) {
      return { shoppingList: state.shoppingList.filter(i => i.id !== payload.id) };
    },

    UPDATE_LIST_ITEM(payload) {
      return {
        shoppingList: state.shoppingList.map(i =>
          i.id === payload.id ? Object.assign({}, i, payload) : i
        )
      };
    },

    TOGGLE_ITEM_CHECKED(payload) {
      return {
        shoppingList: state.shoppingList.map(i =>
          i.id === payload.id ? Object.assign({}, i, { checked: !i.checked }) : i
        )
      };
    },

    CLEAR_CHECKED() {
      return { shoppingList: state.shoppingList.filter(i => !i.checked) };
    },

    SET_BUDGET(payload) {
      return { budget: Object.assign({}, state.budget, payload) };
    },

    ADD_PURCHASE(payload) {
      const record = Object.assign({
        id: 'purchase_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        items: [],
        storeId: null,
        totalAmount: 0
      }, payload);
      return {
        purchaseHistory: [...state.purchaseHistory, record],
        budget: Object.assign({}, state.budget, {
          spent: state.budget.spent + (record.totalAmount || 0)
        })
      };
    },

    SET_ROUTE(payload) {
      return { route: payload };
    },

    SELECT_STORE(payload) {
      if (state.selectedStores.includes(payload.storeId)) return {};
      return { selectedStores: [...state.selectedStores, payload.storeId] };
    },

    DESELECT_STORE(payload) {
      return { selectedStores: state.selectedStores.filter(id => id !== payload.storeId) };
    },

    SET_VIEW(payload) {
      return { currentView: payload.view };
    },

    TOGGLE_DARK_MODE() {
      return { darkMode: !state.darkMode };
    },

    UPDATE_SETTINGS(payload) {
      return { settings: Object.assign({}, state.settings, payload) };
    },

    ADD_PRICE_HISTORY(payload) {
      const { productId, price, date, storeId } = payload;
      const history = state.priceHistory[productId] || [];
      const entry = {
        price,
        date: date || new Date().toISOString(),
        storeId
      };
      return {
        priceHistory: Object.assign({}, state.priceHistory, {
          [productId]: [...history, entry]
        })
      };
    }
  };

  return {
    getState() {
      return Object.assign({}, state);
    },

    setState(updates) {
      const changes = updates;
      state = deepMerge(state, updates);
      persistState(state);
      notifyListeners(state, changes);
      emitStateChanged(state, changes);
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    dispatch(action, payload) {
      const handler = actions[action];
      if (!handler) {
        console.warn('AppState: unknown action', action);
        return;
      }
      const changes = handler(payload);
      if (!changes || Object.keys(changes).length === 0) return;
      state = deepMerge(state, changes);
      persistState(state);
      notifyListeners(state, changes);
      emitStateChanged(state, changes);
    },

    reset() {
      state = deepMerge({}, DEFAULT_STATE);
      persistState(state);
      notifyListeners(state, {});
      emitStateChanged(state, {});
    }
  };
})();
