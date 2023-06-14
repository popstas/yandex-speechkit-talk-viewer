<template>
  <div :class="{'container': true}">
    <el-row>
      <el-col :span="24">
        <div class="upload-form">
          <template v-if="isLogined && isTTSAvailable">
            <label>Upload
              <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
            </label>

            <div style="display: inline-block; margin: 14px 0 0">
              <el-checkbox v-model="postProcessing" >Вырезать тишину и шум</el-checkbox>
<!--              <el-checkbox v-model="punctuation" >Расставлять знаки препинания</el-checkbox>-->
            </div>

            <div style="margin-top: 10px">

              <el-select style="width:70px;margin-top: 10px" v-model="language" placeholder="Язык">
                <el-option
                  v-for="lang in ['ru', 'en']"
                  :key="lang"
                  :label="lang"
                  :value="lang"
                >
                </el-option>
              </el-select>
              <el-select style="width:100px" v-model="provider" placeholder="Движок">
                <el-option
                  v-for="item in availableSttProviders"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
              <div style="display: inline-block; width:300px; margin-top: 10px">
                <el-input v-if="provider === 'whisper'" v-model="prompt" placeholder="prompt"></el-input>
              </div>

              <el-link :type="formState" v-html="formMsg"></el-link>

              <template v-if="$store.state.featAudioRecorder">
                <br /><br /><audio-recorder
                  :upload-url="recorderUploadUrl"
                  :attempts="1"
                  :time="10"
                  :headers="recorderHeaders"
                  :before-recording="recorderCallback"
                  :pause-recording="recorderCallback"
                  :after-recording="recorderCallback"
                  :select-record="recorderCallback"
                  :before-upload="recorderCallback"
                  :successful-upload="recorderCallback"
                  :failed-upload="recorderCallback" />
                 <el-button v-on:click="submitFile()">Submit</el-button>
              </template>
            </div>
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
      <el-row :gutter="12" v-for="item of items.slice(0, 20)" :key="item.id">
        <el-col :span="24"><TalkItem @remove="removeItem" :id="item.id"></TalkItem></el-col>
      </el-row>
    </draggable>

    <div class="right-actions" v-if="isLogined && isTTSAvailable">
      <el-button title="upload" class="action-upload" icon="el-icon-upload2" @click="$refs.file.click()"></el-button>
    </div>
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

.right-actions {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
.right-actions button {
  border-radius: 100%;
  border-width: 2px;
  width: 48px;
  height: 48px;
  padding: 0;
}

.upload-form .el-link {
  vertical-align: baseline;
}
.el-checkbox,
.el-radio-button {
  filter: grayscale(100%);
}
.el-checkbox__input {
  margin-top: -4px;
}
.el-checkbox__label {
  font-weight: normal;
  margin-right: 1rem;
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
      prompt: '',
      availableSttProviders: [],
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
    postProcessing: {
      get() {
        return this.$store.state.postProcessing;
      },
      set(val) {
        this.$store.commit('postProcessing', val);
      }
    },
    language: {
      get() {
        return this.$store.state.language;
      },
      set(val) {
        this.$store.commit('language', val);
      }
    },
    /*punctuation: {
      get() {
        return this.$store.state.punctuation;
      },
      set(val) {
        this.$store.commit('punctuation', val);
      }
    },*/
    provider: {
      get() {
        return this.$store.state.provider;
      },
      set(val) {
        this.$store.commit('provider', val);
      }
    },
    isDraggable() {
      return false; // disabled
      // return window.innerWidth > 640;
    },
    isLogined() {
      return this.$store.state.user && !!this.$store.state.user.email;
    },
    recorderHeaders() {
      return {
        'X-Custom-Header': 'some data',
      };
    },
    recorderUploadUrl() {
      return this.$store.state.serverUrl + '/upload';
    },
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
      formData.append('postProcessing', this.postProcessing);
      formData.append('language', this.language);
      // formData.append('punctuation', this.punctuation);
      formData.append('prompt', this.prompt);
      formData.append('provider', this.provider);

      const answer = await this.$axios.post(
        this.$store.state.serverUrl + '/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // clear file input
      this.$refs.file.value = '';

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
    },

    recorderCallback(data) {
      console.debug(data);
    },
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
      if (answer && answer.data) {
        if (answer.data.whisper) this.availableSttProviders.push('whisper');
        if (answer.data.yandex) this.availableSttProviders.push('yandex');
      }
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
