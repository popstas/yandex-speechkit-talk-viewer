<template>
  <div class="container page-talk">
    <el-row :gutter="12" v-for="item of items" :key="item.id">
      <el-col :span="24"><TalkItem :id="item.id" :t="t" :data-t="t" :active="true"></TalkItem></el-col>
    </el-row>
  </div>

</template>

<style>
.page-talk {
  margin-top: 40px;
}
.el-card{
  margin-bottom: 15px;
}
.upload-form {
  margin-bottom: 15px;
}
.sortable-chosen .talk-item {
  background: #ddd;
}
.page-talk .talk-item__player {
  position: fixed;
  max-width: 960px;
  top: 35px;
  right: 5px;
  left: 5px;
  margin: 0 auto;
  padding-left: 20px;
}
</style>

<script lang="ts">
import Vue from 'vue'
import TalkItem from '@/components/TalkItem'
import draggable from 'vuedraggable';

export default Vue.extend({
  components: {
    TalkItem, draggable
  },

  data() {
    return {
      items: [],
      id: '',
      t: 0,
    }
  },

  computed: {
    pageTitle() {
      return 'Talk ...' + this.id.substring(this.id.length - 5);
    }
  },

  methods: {
  },

  head() {
    return {
      title: this.pageTitle
    }
  },

  mounted(){
    this.id = this.$route.params.id;
    this.items = [{ id: this.id }];
    this.$store.commit('lastTalkId', this.id);

    if (this.$route.query.t) {
      this.t = this.$route.query.t;
    }

    // set speed from get param
    if (this.$route.query["speed"]) {
      this.$store.commit('speed', this.$route.query["speed"]);
    }
  },
})
</script>

<style>
</style>
