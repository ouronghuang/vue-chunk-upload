<template>
  <vue-chunk-upload
      v-model="path"
      :preprocess-url="preprocessUrl"
      :upload-url="uploadUrl"
      :configs="{}"
      :allow-extensions="['jpg']"
      :allow-size="10485760"
      @invalid-size="handleInvalidSize"
      @invalid-extension="handleInvalidExtension"
      @completed="handleCompleted"
  >
  </vue-chunk-upload>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      path: '',
      preprocessUrl: '/chunk_uploads/preprocess',
      uploadUrl: '/chunk_uploads/upload'
    }
  },
  methods: {
    handleCompleted(path) {
      console.log(path)
    },
    handleInvalidSize(msg) {
      console.log(msg);
    },
    handleInvalidExtension(msg) {
      console.log(msg);
    }
  }
}
</script>
