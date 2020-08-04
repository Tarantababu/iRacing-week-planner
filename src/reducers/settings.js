import uniq from 'lodash.uniq';
import { actionTypes as localStorageActionTypes } from 'redux-localstorage'
import { RESET_FILTERS, RESET_SETTINGS, UPDATE_FILTERS, UPDATE_SETTING } from '../actions/settings';

import availableColumns from '../data/availableColumns';
import { tracks, cars } from '../data';

export const defaultFilters = {
  type: ['Road', 'Oval', 'Dirt', 'RX'],
  licence: ['R', 'D', 'C', 'B', 'A', 'P'],
  official: [false, true],
  fixed: [false, true],
  ownedCars: false,
  ownedTracks: false,
  favouriteSeries: false,
  favouriteTracksOnly: false,
  favouriteCarsOnly: false,
};

export const defaultSettings = {
  filters: defaultFilters,
  ownedCars: cars.filter((car) => car.freeWithSubscription === true).map((car) => car.sku),
  ownedTracks: tracks.filter((track) => track.default).map((track) => track.pkgid),
  favouriteSeries: [],
  favouriteCars: [],
  favouriteTracks: [],
  sort: { key: 'licence', order: 'asc' },
  columns: availableColumns.filter((column) => column.default === true).map((column) => column.id),
};

const LEGACY_STORAGE_KEY = 'iracing-state';

const legacyStored = window.localStorage.getItem(LEGACY_STORAGE_KEY);
const startupSettings = legacyStored ? JSON.parse(legacyStored) : defaultSettings;

export default function settings(
  state = startupSettings,
  { type, filters, key, value, payload },
) {
  if (type === localStorageActionTypes.INIT) {
    const persistedStateSettings = payload ? payload.settings : {};

    persistedStateSettings.ownedCars = uniq([
      ...persistedStateSettings.ownedCars,
      ...defaultSettings.ownedCars,
    ]);

    persistedStateSettings.ownedTracks = uniq([
      ...persistedStateSettings.ownedCars,
      ...defaultSettings.ownedTracks,
    ]);

    window.localStorage.removeItem(LEGACY_STORAGE_KEY)

    return { ...state, ...persistedStateSettings };
  }

  if (type === UPDATE_FILTERS) {
    return { ...state, filters };
  }

  if (type === RESET_FILTERS) {
    return { ...state, filters: defaultFilters };
  }

  if (type === RESET_SETTINGS) {
    return { ...defaultSettings };
  }

  if (type === UPDATE_SETTING) {
    return { ...state, [key]: value };
  }

  return state;
}
