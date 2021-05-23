<template>
  <el-container>
    <el-header height="66px">
      <el-row>
        <el-col :span="12">
          <div role="menubar" class="header__menu el-menu--horizontal el-menu">
            <NuxtLink to="/" @click.native="handleSelect(1)" role="menuitem" :class="{ 'el-menu-item': true, 'is-active': selectedId == 1 }">All</NuxtLink>
            <NuxtLink :to="'/talk/' + $store.state.lastTalkId" v-if="$store.state.lastTalkId" @click.native="handleSelect(2)" role="menuitem" :class="{ 'el-menu-item': true, 'is-active': selectedId == 2 }">One talk</NuxtLink>
          </div>

          <!-- <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" class="header__menu">
            <el-menu-item style="width: 50px" v-if="!this.selectedId || this.selectedId=='1'" index="1">All</el-menu-item>
            <el-menu-item style="width: 50px" v-else index="1">&lt</el-menu-item>
            <el-menu-item v-if="$store.state.lastTalkId" index="2">One talk</el-menu-item>
          </el-menu> -->
        </el-col>
        <el-col :span="12">
          <Profile></Profile>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <nuxt />
    </el-main>

    <el-footer height="36px">
      <a 
        target="_blank"
        href="https://github.com/popstas/yandex-speechkit-talk-viewer/releases"
      >{{ $store.state.name }} {{ $store.state.version }}</a>
    </el-footer>
  </el-container>
</template>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

body {
  overflow-x: auto;
  height: 100%;
}
#__nuxt, #__layout {
  height: 100%;
}

.el-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
}

@media(max-width: 640px) {
  .el-main {
    padding: 0;
  }
}

.header__menu a{
  text-decoration: none;
}
.header__menu .nuxt-link-exact-active,
.header__menu .is-active{
  border-bottom: 2px solid #409EFF;
}

.el-footer {
  padding: 8px 8px;
}

.el-footer a {
  color: #ccc;
}

.container {
  width: auto;
}

</style>

<script>
import Profile from "~/components/Profile";

import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyANd2RlGurQ4AgsV-kbawXs3u7gtmp5eTo",
  authDomain: "yandex-stt.firebaseapp.com",
  databaseURL: "https://yandex-stt-default-rtdb.firebaseio.com",
  projectId: "yandex-stt",
  storageBucket: "yandex-stt.appspot.com",
  messagingSenderId: "14453428567",
  appId: "1:14453428567:web:f9daa43a66fdde45bc2e12",
  measurementId: "G-EZQ87DXLF3"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default {
  components: {Profile},
  data() {
    return {
      selectedId: this.activeIndex,
    }
  },

  computed: {
    activeIndex() {
      const dict = {
        index: '1',
        'talk-id': '2'
      }
      const val = dict[$nuxt.$route.name] || '0';
      return val;
    }
  },
  methods: {
    handleSelect(index) {
      console.log('index: ', index);
      this.selectedId = index;

      const dict = {
        1: '/',
        2: this.$store.state.lastTalkId ? `/talk/${this.$store.state.lastTalkId}` : '/',
      };
      const path = dict[index];
      if (path) this.$router.push({path: path});
    }
  }
}
</script>
