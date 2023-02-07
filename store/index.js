import pjson from '~/package.json';
import firebase from "firebase";

export const state = () => ({
  // data
  items: [],
  itemsHistory: [],

  // constants
  serverUrl: process.env.SERVER_URL || 'http://localhost:5771',
  name: pjson.name,
  version: pjson.version,
  description: pjson.description,
  homepage: pjson.homepage,

  // app state
  q: '',
  speed: 1.0,
  user: false,
  connectionId: 0, // current tab id
  lastConnectionId: 0, // current user id
  uid: '', // only for anonymous
  log: [],
  lastTalkId: 0,
  activeItem: '',
  postProcessing: true,
  language: 'ru',
  punctuation: true,
  featAudioRecorder: false,
})

export const getters = {
  getFilteredItems(state, getters) {
    return (q) => {
      return state.items
    }
  }
};

export const mutations = {
  jsonUrlHistory(state, newValue) {
    state.jsonUrlHistory = newValue;
  },

  items(state, newValue) {
    state.items = newValue;
  },
  itemsHistory(state, newValue) {
    state.itemsHistory = newValue;
  },
  speed(state, newValue) {
    state.speed = newValue;
  },
  q(state, newValue) {
    if (!newValue) newValue = '';
    state.q = newValue;
  },
  setUser(state, newValue) {
    state.user = newValue;
  },
  setUid(state, newValue) {
    state.uid = newValue;
  },
  serverUrl(state, newValue) {
    state.serverUrl = newValue;
  },
  connectionId(state, newValue) {
    state.connectionId = newValue;
  },
  lastConnectionId(state, newValue) {
    state.lastConnectionId = newValue;
  },
  log(state, newValue) {
    state.log = newValue;
  },
  lastTalkId(state, newValue) {
    state.lastTalkId = newValue;
  },
  activeItem(state, newValue) {
    state.activeItem = newValue;
  },
  postProcessing(state, newValue) {
    state.postProcessing = newValue;
  },
  language(state, newValue) {
    state.language = newValue;
  },
  punctuation(state, newValue) {
    state.punctuation = newValue;
  },
};

export const actions = {
  // дополняет items и сохраняет
  /* items({ commit, state, getters }, items) {
    commit('items', itemsData);
  }, */

  addItem({ commit, state, getters }, id) {
    // console.log('state.itemsHistory:', [...state.itemsHistory, id]);
    commit('itemsHistory', [...state.itemsHistory, id]);
    firebase
      .database()
      .ref("users/" + state.user.uid)
      .update({
        itemsHistory: state.itemsHistory
      });
  },

  removeItem({ commit, state, getters }, id) {
    // console.log('state.itemsHistory:', [...state.itemsHistory, id]);
    const h = [...state.itemsHistory];
    if (h.indexOf(id) !== -1) delete(h[h.indexOf(id)]);
    commit('itemsHistory', h.filter(Boolean));
    firebase
      .database()
      .ref("users/" + state.user.uid)
      .update({
        itemsHistory: state.itemsHistory
      });
  },

  updateFromFirebase({ commit, state }) {
    if (!state.user.email) return;

    firebase
      .database()
      .ref("users/" + state.user.uid)
      .once("value")
      .then(snapshot => {
        const itemsHistory = (snapshot.val() && snapshot.val().itemsHistory) || false;
        if (itemsHistory) {
          console.log('Update itemsHistory from firebase');
          commit("itemsHistory", itemsHistory);
        }

        const settings = (snapshot.val() && snapshot.val().settings) || false;
        if (settings) {
          console.log('Update settings from firebase:', settings);
          /* if (settings.webhookShow && state.webhookShow !== settings.webhookShow) {
            console.log('Update webhookShow from firebase:', settings);
            commit('webhookShow', settings.webhookShow);
          } */
        }
      });
  },

  setUser({ commit, state, dispatch }, user) {
    if(user) {
      commit("setUser", {
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
        email: user.email,
      });

      if (!user.email) return;

      dispatch('updateFromFirebase');
    } else {
      commit("setUser", false);
    }
  },
};

export const strict = true;
// export const strict = false;
