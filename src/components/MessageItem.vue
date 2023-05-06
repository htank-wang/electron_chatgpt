<script setup lang="ts">
import { message } from 'ant-design-vue';
import { UserOutlined, CopyOutlined } from '@ant-design/icons-vue';
import { MessageProps } from '../types'

import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import useClipboard from 'vue-clipboard3'
// highlightjs
import hljs from 'highlight.js';

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});

VMdPreview.use(createCopyCodePlugin());


defineProps<{ item: MessageProps }>()

const { toClipboard } = useClipboard()

const copy = async (Msg: string) => {
  try {
    await toClipboard(Msg)
    message.success("Copy success")
  } catch (e) {
    console.error(e)
  }
}


const handleCopyCodeSuccess = () => {
  message.success("Copy success")
}
</script>

<template>
  <div :class="'message-item ' + item.role + ' ' + + item.type">
    <div class="head">
      <a-avatar v-if="item.role === 'user'" shape="square">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
      <a-avatar v-else src="./chatgpt.png" shape="square" />
    </div>

    <div :class="'content ' + item.role">
      <CopyOutlined class="copy" @click="copy(item.content)" />
      <v-md-preview :text="item.content" @copy-code-success="handleCopyCodeSuccess"></v-md-preview>
    </div>
  </div>
</template>

<style scoped lang="less">
.message-item {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  padding: 15px 30px;

  .head {
    align-items: center;
    border-radius: 5px;
    color: #fff;
    display: flex;
    font-weight: 700;
    justify-content: center;
    left: 3px;
    margin-right: 10px;
    position: absolute;
    top: 15px;
    left: 30px;
  }


  .content {
    position: relative;
    min-height: 20px;
    margin-left: 40px;
    margin-top: 5px;

    .copy {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 16px;
      color: #666;
      cursor: pointer;
      display: none;
      background-color: #fff;
      padding: 3px;
      z-index: 10;
    }

    &:hover .copy {
      display: block;
    }

    &.error {
      color: #f81d22;
    }
  }

  &.user {}

  &.assistant,
  &.error,
  &.system {
    background-color: #fff;
  }
}

.read-the-docs {
  color: #888;
}

:deep(.github-markdown-body) {
  padding: 0px 0px 0px;
}
</style>
