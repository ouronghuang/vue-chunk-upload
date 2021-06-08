<template>
  <div :class="$options.name">
    <input
        class="file"
        type="file"
        ref="file"
        :disabled="uploading"
        @change="handleChange"
    />
    <slot
        :requestProgress="requestProgress"
        :totalProgress="totalProgress"
        :msg="msg"
    >
      <div class="progress">
        <div
            class="total"
            :style="`width: ${totalProgress}%;`"
        >
          {{ totalProgress }}%
        </div>
        <div
            class="request"
            :style="`width: ${requestProgress}%;`"
        />
      </div>
      <div class="message">
        {{ msg }}
      </div>
    </slot>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'vue-chunk-upload',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    preprocessUrl: {
      type: String,
      required: true
    },
    uploadUrl: {
      type: String,
      required: true
    },
    configs: {
      type: Object,
      default() {
        return {};
      }
    },
    allowSize: {
      type: Number,
      default: 0
    },
    allowExtensions: {
      type: Array,
      default() {
        return [];
      }
    },
    fields: {
      type: Object,
      default() {
        return {
          filename: 'filename',
          size: 'size',
          total: 'total',
          index: 'index',
          file: 'file'
        };
      }
    }
  },
  emits: [
    'update:modelValue',
    'invalid-size',
    'invalid-extension',
    'completed'
  ],
  data() {
    return {
      uploading: false,
      requestProgress: 0,
      totalProgress: 0,
      msg: '上传准备就绪',
      http: null,
      file: null,
      chunk: {
        filename: '',
        extension: '',
        index: 0,
        total: 0,
        size: 0
      }
    }
  },
  mounted() {
    this.http = axios.create({
      onUploadProgress: ({loaded, total}) => {
        this.requestProgress = this.calculateProgress(loaded / total);
      },
      ...this.configs
    });
  },
  methods: {
    handleChange(e) {
      let file = e.target.files;

      if (!file) {
        return this.$refs.file.value = null;
      }

      file = Array.prototype.slice.call(file);

      if (!file.length) {
        return this.$refs.file.value = null;
      }

      this.file = file[0];
      this.$refs.file.value = null;

      if (this.allowSize && this.file.size > this.allowSize) {
        return this.$emit('invalid-size', '文件过大');
      }

      if (this.allowExtensions.length) {
        const index = this.file.name.lastIndexOf('.');
        const extension = this.file.name.substring(index + 1);

        if (this.allowExtensions.indexOf(extension) === -1) {
          return this.$emit('invalid-extension', '不支持的文件类型');
        }
      }


      this.handlePreprocess();
    },
    handlePreprocess() {
      this.requestProgress = 0;
      this.msg = '正在准备...';
      this.uploading = true;
      let form = {};
      form[this.fields.filename] = this.file.name;
      form[this.fields.size] = this.file.size;

      this.http.post(this.preprocessUrl, form).then(({data}) => {
        this.chunk.filename = data.filename;
        this.chunk.extension = data.extension;
        this.chunk.size = data.size;
        this.chunk.total = Math.ceil(this.file.size / this.chunk.size);
        this.msg = '正在上传...';
        this.handleUpload();
      });
    },
    handleUpload() {
      this.requestProgress = 0;
      const form = new FormData();
      const start = this.chunk.index * this.chunk.size;
      const end = Math.min(this.file.size, start + this.chunk.size);
      this.chunk.index++;
      form.append(this.fields.file, this.file.slice(start, end), this.file.name);
      form.append(this.fields.filename, this.chunk.filename);
      form.append(this.fields.total, this.chunk.total);
      form.append(this.fields.index, this.chunk.index);

      this.http.post(this.uploadUrl, form).then(({data}) => {
        this.totalProgress = this.calculateProgress(this.chunk.index / this.chunk.total);

        if (data.path) {
          this.$emit('update:modelValue', data.path);
          this.$emit('completed', data.path);
          this.msg = '上传成功';
        } else {
          this.handleUpload();
        }
      })
    },
    calculateProgress(progress) {
      return Math.round(progress * 10000) / 100;
    }
  }
}
</script>

<style scoped lang="scss">
$primary: #409eff;
$warning: #e6a23c;

.vue-chunk-upload {
  display: inline-block;
  font-size: 14px;

  .progress {
    position: relative;
    background: #3c3f41;
    margin: 5px 0;

    .total {
      background: $primary;
      width: 0;
      text-align: right;
      font-size: 12px;
      color: #fff;
      transition: width .2s linear;
    }

    .request {
      position: absolute;
      width: 0;
      top: 0;
      left: 0;
      height: 2px;
      background: $warning;
      transition: width .2s linear;
    }
  }
}
</style>
