<script setup lang="ts">
import { PlusOutlined, DeleteOutlined, MessageOutlined } from '@ant-design/icons-vue';
defineProps<{ activeKey: string, newSession: Function, onSelectedChange: Function, onDeleteSession: Function, sessions: any, }>()
</script>

<template>
  <a-layout-sider width="200" style="background: #fff">
    <div class="sessions">
      <a-button type="dashed" block class="session-add" @click="newSession">
        <template #icon>
          <PlusOutlined />
        </template>
        New session
      </a-button>
      <div :class="{
          'session-item': true,
          'active': activeKey === item.id
        }" v-for="item in  sessions.data " :key="item.id" @click="onSelectedChange(item.id)">
        <MessageOutlined />{{ item.name }}
        <a-popconfirm title="Are you sure delete？" ok-text="Yes" cancel-text="No" @confirm="onDeleteSession(item.id)">
          <DeleteOutlined class="delete" @click="(e: any) => e.stopPropagation()" />
        </a-popconfirm>
      </div>
    </div>
  </a-layout-sider>
</template>

<style scoped lang="less">
.sessions {
  height: calc(100vh - 44px);
  background-color: #f1fafb;
  overflow-y: auto;
  padding: 15px 10px;
  border-right: 1px solid #eaeaea;

  .session-add {
    margin-bottom: 20px;
    border-color: #1890ff;
    color: #1890ff;
  }

  .session-item {
    border: 1px solid #e5e7eb;
    cursor: pointer;
    background: white;
    height: 36px;
    line-height: 34px;
    padding: 0 10px;
    border-radius: 3px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 50px;
    position: relative;
    margin-bottom: 10px;

    :deep(.anticon) {
      margin-right: 5px;
    }

    &:hover {
      color: #1890ff;

      .delete {
        display: block;
      }
    }

    &.active {
      color: #1890ff;
      border-color: #1890ff;
    }

    .delete {
      position: absolute;
      top: 10px;
      right: 5px;
      font-size: 14px;
      display: none
    }
  }
}
</style>
