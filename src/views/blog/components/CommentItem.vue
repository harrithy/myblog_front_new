<template>
  <div class="comment-item">
    <div class="comment-main">
      <div class="comment-avatar">
        <img :src="comment.avatar_url || defaultAvatar" alt="" />
      </div>
      <div class="comment-body">
        <div class="comment-header">
          <div class="user-info">
            <span class="comment-author">{{ comment.nickname }}</span>
            <span v-if="comment.parent_id" class="reply-tag">回复</span>
          </div>
          <span class="comment-time">{{ formatDate(comment.created_at) }}</span>
        </div>
        <p class="comment-content">{{ comment.content }}</p>

        <div class="comment-actions">
          <button class="action-btn reply-btn" @click="toggleReply">回复</button>
        </div>

        <!-- Reply Input -->
        <div v-if="isReplying" class="reply-input-wrapper">
          <textarea
            v-model="replyContent"
            class="reply-textarea"
            :placeholder="`回复 @${comment.nickname}...`"
            rows="2"
            ref="replyInputRef"
          ></textarea>
          <div class="reply-actions">
            <button class="cancel-btn" @click="cancelReply">取消</button>
            <button class="submit-btn" @click="submitReply" :disabled="!replyContent.trim()">
              发送
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recursive Children -->
    <div v-if="comment.children && comment.children.length" class="comment-children">
      <CommentItem
        v-for="child in comment.children"
        :key="child.id"
        :comment="child"
        @reply-success="$emit('reply-success')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import CommentItem from './CommentItem.vue'

// Define the Comment interface locally or import it if shared
interface Comment {
  id: number
  article_id: number
  parent_id?: number
  nickname: string
  email?: string
  avatar_url?: string
  content: string
  created_at: string
  children?: Comment[]
}

const props = defineProps<{
  comment: Comment
}>()

const emit = defineEmits(['reply-success'])

// Helper for default avatar
const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'

// State
const isReplying = ref(false)
const replyContent = ref('')
const replyInputRef = ref<HTMLTextAreaElement | null>(null)

// Format date helper
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Actions
const toggleReply = () => {
  isReplying.value = !isReplying.value
  if (isReplying.value) {
    nextTick(() => {
      replyInputRef.value?.focus()
    })
  }
}

const cancelReply = () => {
  isReplying.value = false
  replyContent.value = ''
}

import commentApi from '@/api/comment'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const submitReply = async () => {
  if (!replyContent.value.trim()) return

  const data = {
    article_id: props.comment.article_id,
    parent_id: props.comment.id,
    nickname: userStore.userInfo?.nickname || '匿名用户',
    email: userStore.userInfo?.email || '',
    avatar_url: userStore.userInfo?.avatar_url || '',
    content: replyContent.value,
  }

  try {
    await commentApi.addComment(data)
    replyContent.value = ''
    isReplying.value = false
    emit('reply-success')
  } catch (error) {
    console.error('Failed to submit reply:', error)
  }
}
</script>

<style lang="scss" scoped>
$primary: #e8a0bf;
$text-primary: #2c3e50;
$text-secondary: #95a5a6;
$bg-hover: #f8f9fa;

.comment-item {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: fadeIn 0.4s ease-out;
}

.comment-main {
  display: flex;
  gap: 20px;
  padding: 8px 0;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    .reply-btn {
      opacity: 1;
    }
  }
}

.comment-avatar {
  flex-shrink: 0;
  width: 48px;
  height: 48px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

.comment-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.comment-author {
  font-weight: 700;
  color: $text-primary;
  font-size: 15px;
}

.reply-tag {
  font-size: 12px;
  color: $primary;
  background: rgba($primary, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.comment-time {
  font-size: 12px;
  color: $text-secondary;
}

.comment-content {
  font-size: 15px;
  color: $text-primary;
  line-height: 1.7;
  margin: 0 0 8px 0;
  word-break: break-word;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  color: $text-secondary;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.6;

  &:hover {
    color: $primary;
    opacity: 1;
  }

  .icon {
    font-size: 14px;
  }
}

.reply-input-wrapper {
  margin-top: 16px;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  animation: slideDown 0.2s ease-out;
}

.reply-textarea {
  width: 100%;
  padding: 8px 0;
  border: none;
  background: transparent;
  resize: none;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;

  &:focus {
    border-bottom-color: $primary;
  }
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.cancel-btn,
.submit-btn {
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  font-weight: 500;
}

.cancel-btn {
  background: transparent;
  color: $text-secondary;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
    color: $text-primary;
  }
}

.submit-btn {
  background: $primary;
  color: white;

  &:hover:not(:disabled) {
    filter: brightness(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.comment-children {
  margin-left: 24px;
  padding-left: 24px;
  border-left: 2px solid #f0f2f5;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
