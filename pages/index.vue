<template>
  <div :class="{'container': true}">
    <el-row>
      <el-col :span="24">
        <div class="upload-form">
          <template v-if="isLogined && isTTSAvailable">
            <label>Upload
              <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
            </label>
            <el-link :type="formState" v-html="formMsg"></el-link>
            <!-- <el-button v-on:click="submitFile()">Submit</el-button> -->
          </template>
          <el-link v-if="!isTTSAvailable" type="danger">Сервер распознавания недоступен, попробуйте позже</el-link>
        </div>
        <!-- <div v-else>
          Login for upload
        </div> -->
      </el-col>
    </el-row>

    <div class="items__total">Total: {{ items.length }}</div>
    <draggable v-model="items" tag="div" class="items__history" :options="{disabled : !isDraggable}">
      <el-row :gutter="12" v-for="item of items" :key="item.id">
        <el-col :span="24"><TalkItem @remove="removeItem" :id="item.id"></TalkItem></el-col>
      </el-row>
    </draggable>
  </div>

</template>

<style>
.el-card{
  margin-bottom: 15px;
}
.upload-form {
  margin-bottom: 15px;
}
@media(max-width: 640px) {
  .upload-form {
    margin: 15px;
  }
}
.sortable-chosen .talk-item {
  background: #ddd;
}
</style>

<script lang="ts">
import Vue from 'vue';
import TalkItem from '@/components/TalkItem';
import draggable from 'vuedraggable';

export default Vue.extend({
  components: {
    TalkItem, draggable
  },

  data() {
    return {
      // items: [],
      file: '',
      interval: null,
      formMsg: '',
      formState: '',
      isTTSAvailable: true,
    }
  },

  computed: {
    itemsHistory() {
      return this.$store.state.itemsHistory;
    },
    itemsHistoryReversed() {
      return [...this.$store.state.itemsHistory].reverse();
    },
    items: {
      get() {
        // console.log('get:', this.$store.state.items);
        /* if (this.$store.state.items.length === 0) {
          return this.itemsHistory.map (id => { return { id }});
        } */
        return this.itemsHistory.map (id => { return { id }}).reverse();
        // return this.$store.state.items;
      },
      set(val) {
        // console.log(val);
        this.$store.commit('items', val);
      }
    },
    isDraggable() {
      return false; // disabled
      // return window.innerWidth > 640;
    },
    isLogined() {
      return this.$store.state.user && !!this.$store.state.user.email;
    }
  },

  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      this.submitFile();
    },
    async submitFile() {
      this.formState = '';
      this.formMsg = 'Processing...';
      let formData = new FormData();
      formData.append('file', this.file);

      const answer = await this.$axios.post(
        this.$store.state.serverUrl + '/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      if (answer && answer.data && answer.data.opId) {
        this.formMsg = 'Success!';
        this.formState = 'success';
        this.$store.dispatch('addItem', answer.data.opId);
      }
      else {
        this.formMsg = 'Error!'
        this.formState = 'danger';
        if (answer.data.error) this.formMsg = answer.data.error.replace(/\n/g, '<br>\n');
        console.error('error send file');
      }
      // console.log('answer:', answer);
    },

    removeItem(id) {
      console.log('remove item:', id);
      this.$store.dispatch('removeItem', id);
    }
  },

  head() {
    return {
      title: 'Talks - Speech To Text service'
    }
  },

  async mounted(){
    document.designMode = 'off';

    // update history from firebase
    // TODO: replace with event from firebase
    this.interval = setInterval(() => {
      this.$store.dispatch('updateFromFirebase');
    }, 60 * 1000)

    // this.items = this.itemsHistory.map (id => { return { id }});
    /* setInterval(() => {
      console.log('this.$store.state.user:', this.$store.state.user);
    }, 1000); */

    try {
      const answer = await this.$axios.get(this.$store.state.serverUrl + '/');
      if (answer) this.isTTSAvailable = true;
    }
    catch(e) {
      this.isTTSAvailable = false;
      console.log('TTS server not available');
    }
    
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
})
</script>

<style>
</style>
