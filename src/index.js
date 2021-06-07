import ChunkUpload from './components/ChunkUpload';

export default {
  install: app => {
    app.component(ChunkUpload.name, ChunkUpload);
  }
}
