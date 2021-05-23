import createPersistedState from 'vuex-persistedstate';

export default ({store}) => {
  createPersistedState({
    paths: [
      'itemsHistory',
      'uid',
      'log',
      'speed',
      'lastTalkId',
      'activeItem',
    ],
  })(store);
};
