<template>
  <div class="mx-auto md:p-2 px-5 pt-7 mt-2 md:text-[1.14rem] md:max-w-[53rem] md:mb-4 font-inter">
    <div class="flex flex-col items-center min-h-screen font-garamond">
      <PackageContainer 
        :guideFiles="guideFiles"
        :articleFiles="articleFiles"
        :openFolders="openFolders"
        :selectedFile="selectedFile"
        @toggle-folder="toggleFolder"
        @select-file="selectFile"
      />
      <FileDisplay 
        :selectedFile="selectedFile"
        :fileContent="fileContent"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script>
import FileDisplay from '../components/other/FileDisplay.vue';
import PackageContainer from '../components/other/PakcageContainer.vue';
import {marked} from 'marked';

export default {
  components: {
    FileDisplay,
    PackageContainer
  },
  data() {
    return {
      openFolders: {
        guide: true,
        article: true
      },
      selectedFile: null,
      fileContent: '',
      loading: false,
      guideFiles: [],
      articleFiles: []
    }
  },
  async created() {
    await this.fetchRepoFiles();
  },
  methods: {
    toggleFolder(folder) {
      this.openFolders[folder] = !this.openFolders[folder];
    },
    async selectFile(file) {
      if (!file.download_url) return;
      
      this.selectedFile = file;
      this.loading = true;
      
      try {
        const response = await fetch(file.download_url);
        const markdown = await response.text();
        this.fileContent = marked.parse(markdown);
      } catch (error) {
        console.error('Error fetching file:', error);
        this.fileContent = `<p>Error loading file: ${error.message}</p>`;
      } finally {
        this.loading = false;
      }
    },
    async fetchRepoFiles() {
      try {
        const guideResponse = await fetch('https://api.github.com/repos/Habbatul/Guide-Documentation-NgulikPribadi/contents/');
        const guideContents = await guideResponse.json();
        
        this.guideFiles = guideContents
          .filter(file => file.name.endsWith('.md'))
          .map(file => ({
            name: file.name,
            path: file.path,
            download_url: file.download_url
          }));
          
        this.articleFiles = [
          { name: 'Belum Ada', path: 'no-article', download_url: '' }
        ];
      } catch (error) {
        console.error('Error fetching repo contents:', error);
        this.guideFiles = [
          { 
            name: 'README.md', 
            path: 'README.md',
            download_url: 'https://raw.githubusercontent.com/Habbatul/Guide-Documentation-NgulikPribadi/main/README.md'
          }
        ];
        this.articleFiles = [
          { name: 'Belum Ada', path: 'no-article', download_url: '' }
        ];
      }
    }
  }
}
</script>