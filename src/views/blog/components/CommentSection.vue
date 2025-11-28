<template>
  <div class="comment-section">
    <div class="comment-card">
      <h3 class="comment-title">💬 评论</h3>

      <!-- 评论输入框 -->
      <div class="comment-input-wrapper">
        <textarea
          v-model="newComment"
          class="comment-input"
          placeholder="写下你的评论..."
          rows="3"
        ></textarea>
        <button class="comment-submit" @click="submitComment" :disabled="!newComment.trim()">
          发表评论
        </button>
      </div>

      <!-- 评论列表 -->
      <div class="comment-list">
        <div v-if="comments.length === 0" class="no-comments">暂无评论，快来抢沙发吧~</div>
        <div v-else v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <span class="comment-author">{{ comment.author }}</span>
            <span class="comment-time">{{ comment.time }}</span>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Comment {
  id: number
  author: string
  content: string
  time: string
}

const newComment = ref('')
const comments = ref<Comment[]>([])

// 格式化时间
const formatTime = (): string => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

// 提交评论
const submitComment = () => {
  if (!newComment.value.trim()) return

  const comment: Comment = {
    id: Date.now(),
    author: '访客',
    content: newComment.value.trim(),
    time: formatTime(),
  }

  comments.value.unshift(comment)
  newComment.value = ''
}
</script>

<style lang="scss" scoped>
$primary: #e8a0bf;
$primary-light: #f4c7d5;
$text-primary: #5d4e60;
$text-secondary: #9b8a9e;
$border-color: rgba(232, 160, 191, 0.2);
$shadow-soft: rgba(232, 160, 191, 0.15);

.comment-section {
  // width: 280px;
  flex: 1;
  flex-shrink: 0;
  padding: 20px 20px 20px 10px;
  position: sticky;
  top: 0px;
  height: fit-content;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.comment-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid $border-color;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px $shadow-soft;
}

.comment-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px dashed $border-color;
}

.comment-input-wrapper {
  margin-bottom: 20px;
}

.comment-input {
  width: 100%;
  padding: 12px;
  border: 1px solid $border-color;
  border-radius: 8px;
  font-size: 13px;
  resize: none;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    border-color: $primary;
  }

  &::placeholder {
    color: $text-secondary;
  }
}

.comment-submit {
  margin-top: 10px;
  width: 100%;
  padding: 10px 16px;
  background: $primary;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: darken($primary, 10%);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.comment-list {
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: $primary-light;
    border-radius: 2px;
  }
}

.no-comments {
  text-align: center;
  color: $text-secondary;
  font-size: 13px;
  padding: 20px 0;
}

.comment-item {
  padding: 12px 0;
  border-bottom: 1px dashed $border-color;

  &:last-child {
    border-bottom: none;
  }
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-author {
  font-size: 13px;
  font-weight: 600;
  color: $text-primary;
}

.comment-time {
  font-size: 11px;
  color: $text-secondary;
}

.comment-content {
  font-size: 13px;
  color: $text-primary;
  line-height: 1.5;
  margin: 0;
  word-break: break-word;
}

@media (max-width: 1400px) {
  .comment-section {
    display: none;
  }
}
</style>
