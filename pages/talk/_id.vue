<template>
  <div class="container">
    <el-row :gutter="12" v-for="item of items" :key="item.id">
      <el-col :span="24"><TalkItem :id="item.id" :t="t" :data-t="t" :active="true"></TalkItem></el-col>
    </el-row>
  </div>

</template>

<style>
.el-card{
  margin-bottom: 15px;
}
.upload-form {
  margin-bottom: 15px;
}
.sortable-chosen .talk-item {
  background: #ddd;
}
</style>

<script lang="ts">
import Vue from 'vue'
import TalkItem from '@/components/TalkItem'
import QueryInput from '@/components/QueryInput'
import draggable from 'vuedraggable';

export default Vue.extend({
  components: {
    TalkItem, QueryInput, draggable
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
  }
})
</script>

<style>
</style>
