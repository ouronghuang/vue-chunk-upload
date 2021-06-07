<template>
  <vue-chunk-upload
      v-model="path"
      :preprocess-url="preprocessUrl"
      :upload-url="uploadUrl"
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
      preprocessUrl: 'http://vr.test/api/chunk_uploads/preprocess?api_token=zs0daXdncEo7bdIXsgLAYzvbySeufXxY',
      uploadUrl: 'http://vr.test/api/chunk_uploads/upload?api_token=zs0daXdncEo7bdIXsgLAYzvbySeufXxY'
    }
  },
  methods: {
    handleCompleted() {
      console.log(this.path)
    }
  }
}
</script>
