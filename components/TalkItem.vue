<template>
  <el-card :data-id="op.id" :class="{'talk-item': true, 'talk-item_undone': op.id && !op.done, 'talk-item_active': active || activeItem === id}">
    <div slot="header" class="clearfix">
      <NuxtLink class="item__date" :to="'/talk/' + op.id" title="Ссылка на разговор">{{ op.updated ? new Date(op.updated).toLocaleString() : '&nbsp;' }}</NuxtLink>
      <NuxtLink v-if="op.id" class="item__id" :to="'/talk/' + op.id" :title="talkInfo">{{ op.id.substring(op.id.length - 6) }}</NuxtLink>
      <div v-if="op.filename" v-html="op.filename"></div>
      <div v-if="op.id && !op.done">done: {{ op.done ? 'yes' : 'no' }}</div>
      <div class="talk-item__player" v-if="audioUri">
        <audio controls :src="audioUri"></audio>
        <el-radio-group v-if="audioReady" class="talk-item__player-speed" v-model="speed" size="mini">
          <el-radio-button label="0.5"></el-radio-button>
          <el-radio-button label="1.0"></el-radio-button>
          <el-radio-button label="1.5"></el-radio-button>
          <el-radio-button label="2.0"></el-radio-button>
          <el-radio-button label="2.5"></el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div @mouseup="handleSelection" class="chunks" :contenteditable="this.active">
      <div :class="{'chunk-line': true, 'chunk-line_active': isChunkActive(chunk) }"
      v-for="chunk, k in chunksFiltered" :key="k"
      :title="'Click to go to: ' + chunk.alternatives[0].words[0].startTime"
      @click="goto(chunk.alternatives[0].words[0].startTime)">
        {{ chunk.alternatives[0].text }}
      </div>
    </div>
    <button class="talk-item__remove" @click="$emit('remove', op.id)">✖</button>
  </el-card>
</template>

<style>
.chunk-line { color: #aaa; cursor: pointer; }
.chunk-line_active { color:inherit; }
.chunk-line_active:hover { text-shadow: 0 0 1px black; }
.chunk-line:hover { color: inherit; }

.item__date {
  color: #999;
}
.item__id {
  float: right;
  color: #999;
}
.talk-item:hover .talk-item__remove {
  display: block;
}
.talk-item .el-card__body {
  max-height: 400px;
  overflow-y: hidden;
  width: 100%;
}
.talk-item_active .el-card__body {
  max-height: none;
}
.talk-item_undone {
  background: #ffffcc;
}
.talk-item__remove {
  display: none;
  background: none;
  border: none;
  float: right;
  cursor: pointer;
  position: absolute;
  bottom: 25px;
  right: 15px;
}
.talk-item__player {
  margin-top: 15px;
}
.talk-item__player-speed {
  float: right;
  margin-top: 12px;
}
</style>

<script lang="js">
export default {
  props: ['id', 't', 'active'],
  data() {
    return {
      op: { chunks: []},
      interval: false,
      currentTime: 0,
      audioReady: true,
      selectionProcess: false,
    }
  },

  computed: {
    chunksFiltered() {
      if (!this.op.chunks) return [];
      return this.op.chunks.filter(c => c.channelTag === '1');
    },
    activeItem() {
      return this.$store.state.activeItem;
    },
    speed: {
      get() {
        return this.$store.state.speed;
      },
      set(val) {
        this.$store.commit('speed', val);
      }
    },
    audioUri() {
      return this.op.mp3Uri || this.op.uploadedUri;
    },
    talkInfo() {
      return 'Формат: ' + this.op.uploadedUri.substring(this.op.uploadedUri.length - 3);
    }
  },

  watch: {
    speed(speed) {
      if (this.audioReady) this.audio().playbackRate = speed;
    },
    activeItem(val) {
      console.log('watch activeItem: ', val);
      if (this.audioReady && this.id != val) this.audio().pause();
    }
  },


  async mounted() {
    this.tryGetData(6);

    setTimeout(() => {
      if (this.audio()) {
        this.audioReady = true;
        this.audio().onerror = () => {
          this.audioReady = false;
        }

        // set speed
        this.audio().playbackRate = this.speed;

        // set global active when playing
        this.audio().onplaying = () => {
          this.$store.commit('activeItem', this.id);
        }
      }

      // autoplay from t
      if (this.t) {
        console.log('this.t: ', this.t);
        this.goto(this.t);
      }
    }, 500);

    // update 100 sec after load while not done
    let tries = 10;
    setInterval(() => {
      if (!this.op.done) {
        this.tryGetData();
      }
    }, 10000);

    this.interval = setInterval(() => {
      if (this.audioReady && this.audio()) this.currentTime = this.audio().currentTime;
    }, 1000);

    // edit mode
    if (this.active) {
      console.log('chunks: ', this.$el.querySelector('.chunks'));
      // document.designMode = 'on';
      // this.$el.querySelector('.chunks').designMode = 'on';
    }
    
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },

  methods: {
    async tryGetData(tries) {
      // console.log('tryGetData');
      if (!this.id || tries <= 0) {
        this.op = {
          id: this.id,
          updated: 0,
          chunks: [],
        }
      }

      try {
        const data = await this.$axios.$get(`${this.$store.state.serverUrl}/ops/${this.id}.json`);
        this.op = data;
      } catch(e) {
        setTimeout(() => {
          this.tryGetData(tries - 1);
        }, 10000);
      }
    },

    goto(str) {
      if (this.selectionProcess) return;
      console.log('goto');
      const audio = this.audio();
      if (!audio) return;
      const offset = parseFloat(str.replace('s', ''));
      audio.currentTime = offset;
      this.currentTime = offset;
      audio.play();

      // add to url on talk page
      if ($nuxt.$route.name === 'talk-id') this.$router.push({ query: { t: str } });
      this.$store.commit('activeItem', this.id);
    },

    isChunkActive(chunk) {
      const start = parseFloat(chunk.alternatives[0].words[0].startTime.replace('s', ''));
      // const end = parseFloat(chunk.alternatives[0].words[0].endTime.replace('s', ''));
      const isActive = this.currentTime >= start; // || this.currentTime > end;
      // console.log(`this.currentTime: ${this.currentTime}, start: ${start}, end: ${end}, isActive: ${isActive}`);
      return isActive;
    },

    audio() {
      return this.$el.querySelector('audio');
    },

    handleSelection() {
      console.log('handleSelection');
      const minSentenseLength = 10;
      const minBlockLength = 300;

      if (!this.active) return;
      const sel = window.getSelection();
      if (!sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      const el = document.createElement('div');
      el.append(range.cloneContents());
      // console.log('el: ', el);

      let text = el.innerText;
      // console.log('el: ', el);
      // console.log('text: ', text);

      if (text.length < minSentenseLength) return;

      // не переключать аудио, если делаем выделение
      this.selectionProcess = true;
      setTimeout(() => {
        this.selectionProcess = false;
      }, 100);

      // Абзац
      if (text.length > minBlockLength) {
        text = text + '\n\n';
        const div = document.createElement('div');
        div.appendChild(document.createElement('br'));
        el.appendChild(div);
        range.deleteContents();
        range.insertNode(el);
        return;
      }

      // Предложение
      else {
        // capitalize sentence
        text = text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
        console.log('text: ', text);

        // remove line breaks and spaces
        text = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ');
        console.log('text: ', text);

        // replace . with ,
        if (!text.match(/\.$/)) text = text.replace(/\./g, ',')
        console.log('text: ', text);

        // add .
        if (!text.match(/\.$/)) text += '.';

        text = text.replace(/ \.$/, '. ');
      }


      // replace text
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
    }
  }
}
</script>