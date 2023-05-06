<script setup lang="ts">
import { message } from 'ant-design-vue';
import { reactive, ref, watch, onMounted } from 'vue'
import { SendOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { postRemoteMessage } from './api'
import MessageItem from './components/MessageItem.vue';
import Header from './components/Header.vue';
import SiderMenu from './components/SiderMenu.vue';
import { guid } from './utils';
import { nextTick } from 'process'

const db = require('@electron/remote').getGlobal("db")

let sessions = reactive({
  data: db.get("sessions") as any[] || [] as any[]
})

let messages = reactive({
  data: [] as any
})
const loading = ref(false)
const activeKey = ref()
const searchVal = ref('')
if (sessions.data.length) {
  activeKey.value = sessions.data[0].id;
  messages.data = sessions.data[0].messages
}

watch(activeKey, (newValue) => {
  updateMessages();
});

onMounted(() => {
  scrollToBottom();
  hasApiKey()
})

const headerRef = ref<null | HTMLElement>(null) as any;
const hasApiKey = () => {
  const config = db.get("config") || {};
  if (!config.key) {
    headerRef.value.showKeyModal();
    return false;
  }
  return true
}

const updateDB = () => {
  db.set('sessions', sessions.data)
}

const newSession = () => {
  if (!hasApiKey()) {
    return
  }
  const id = guid();
  sessions.data.push({ id, name: "New session", messages: [] })
  activeKey.value = id
  updateDB();
}

const updateMessages = () => {
  if (!sessions.data.length) return;
  messages.data = sessions.data.filter(item => item.id === activeKey.value)[0].messages
  scrollToBottom();
  updateDB();
}

const appendMessage = (message: any, role: string) => {
  sessions.data.forEach(item => {
    if (item.id === activeKey.value) {
      if (role === 'user') {
        item.messages = item.messages.concat(message);
      } else {
        console.log("item message", message)
        // item.messages.push(message);
        const lastItem = item.messages[item.messages.length - 1];
        lastItem.role = message.role;
        lastItem.content = message.content;
      }
    }
  })
  updateMessages();
}

const send = async () => {
  if (loading.value || !searchVal.value) return;
  if (!hasApiKey()) {
    return
  }
  if (!messages.data.length) {
    sessions.data.forEach(item => {
      if (item.id === activeKey.value) {
        item.name = searchVal.value
      };
    })
  }
  const message = [{ "role": "user", "content": searchVal.value }, { "role": "system", "content": 'Entering...' }];
  appendMessage(message, "user");
  nextTick(() => {
    searchVal.value = ""
  })
  loading.value = true
  try {
    const result = await postRemoteMessage(messages.data.filter((item: any) => item.type !== "error"))
    appendMessage(result.data.choices[0].message, 'assistant')
  } catch (error: any) {
    console.log("error", error)
    let msg = ''

    if (error.code === "ERR_NETWORK") {
      msg = error.message;
    } else {
      msg = error.response.data.error.message
    }
    appendMessage({ role: 'system', content: msg, type: "error" }, 'error')
  }
  loading.value = false;
}

const onSelectedChange = (id: string) => {
  activeKey.value = id;
}

const onDeleteSession = (id: string) => {
  sessions.data = sessions.data.filter(item => item.id !== id);
  activeKey.value = sessions.data.length ? sessions.data[0].id : "";
  updateDB();
  message.success("Success")
}

const messageContent = ref(null) as any;
const scrollToBottom = () => {
  nextTick(() => {
    if (messageContent.value) {
      messageContent.value.scrollTop = messageContent.value.scrollHeight;
    }
  })
};

</script>

<template>
  <a-layout>
    <Header ref="headerRef" />
    <a-layout>
      <SiderMenu :active-key="activeKey" :newSession='newSession' :onSelectedChange='onSelectedChange'
        :onDeleteSession='onDeleteSession' :sessions="sessions" />
      <a-layout>
        <a-layout-content class="content-wrap">
          <div class="no-data" v-if="!sessions.data.length">
            Click on the button below to start your chat
            <a-button type="primary" @click="newSession">
              <template #icon>
                <PlusOutlined />
              </template>
              New session
            </a-button>
          </div>
          <template v-else>
            <div v-if="!messages.data.length" class="no-message">Send a message to start a conversation with chatgpt
            </div>
            <div class="message-content" ref="messageContent">
              <MessageItem v-for=" item  in  messages.data " :item="item" />
            </div>
            <div class="message-content-footer">
              <a-textarea v-model:value="searchVal" autofocus :auto-size="{ minRows: 3 }"
                placeholder="Send message. (Enter)" :maxlength="2000" @pressEnter="send" />
              <a-button type="primary" class="send" @click="send" :disabled="loading">
                <SendOutlined />
              </a-button>
            </div>
          </template>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="less">
.content-wrap {
  height: calc(100vh - 44px);
  display: flex;
  flex-direction: column;
}

.message-content {
  margin: 0 auto;
  position: relative;
  scroll-behavior: auto;
  overflow-y: auto;
  flex: 1 1 0%;
  width: 100%;
}

.message-content-footer {
  padding: 10px 30px;

  .send {
    position: absolute;
    bottom: 18px;
    right: 38px;
    z-index: 1;
  }

  textarea {
    padding-right: 80px;
    resize: none;
  }

  :deep(.ant-input-textarea-show-count::after) {
    position: absolute;
    left: 10px;
    bottom: 5px;
    z-index: 1;
  }
}

.no-message {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #999;
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  line-height: 40px;
}
</style>