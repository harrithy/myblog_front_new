<template>
  <div class="comment-section">
    <div class="comment-card">
      <h3 class="comment-title">💬 评论区 ({{ comments.length }})</h3>

      <!-- 评论输入框 -->
      <div class="comment-input-wrapper">
        <textarea
          v-model="newComment"
          class="comment-input"
          placeholder="写下你的想法..."
          rows="3"
        ></textarea>
        <div class="input-actions">
          <button class="comment-submit" @click="submitComment" :disabled="!newComment.trim()">
            发表评论
          </button>
        </div>
      </div>

      <!-- 评论列表 -->
      <div class="comment-list">
        <div v-if="comments.length === 0" class="no-comments">
          <span class="empty-icon">🍃</span>
          <p>暂无评论，来做第一个发言的人吧~</p>
        </div>

        <div v-else class="comments-container">
          <CommentItem
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            @reply-success="fetchComments"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import commentApi from '@/api/comment'
import { useUserStore } from '@/stores/user'
import CommentItem from './CommentItem.vue'

// Define the interface to match CommentItem's expectation
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

const props = defineProps({
  articleId: {
    type: Number,
    required: true,
  },
})

const newComment = ref('')
const comments = ref<Comment[]>([])
const page = ref(1)
const pageSize = ref(100)

const fetchComments = () => {
  if (!props.articleId) return
  const params = {
    article_id: props.articleId,
    page: page.value,
    page_size: pageSize.value,
  }
  commentApi.getComments(params).then((res) => {
    comments.value = res as unknown as Comment[]
  })
}

const userStore = useUserStore()

const submitComment = () => {
  const data = {
    article_id: props.articleId,
    // No parent_id for root comments
    nickname: userStore.userInfo?.nickname || '匿名用户',
    email: userStore.userInfo?.email || '',
    avatar_url: userStore.userInfo?.avatar_url || '',
    content: newComment.value,
  }
  commentApi.addComment(data).then(() => {
    newComment.value = ''
    fetchComments()
  })
}

onMounted(() => {
  fetchComments()
})

watch(
  () => props.articleId,
  (newVal) => {
    if (newVal) {
      fetchComments()
    }
  },
)
</script>

<style lang="scss" scoped>
$primary: #e8a0bf;
$primary-light: #f4c7d5;
$primary-dark: #d48aa7;
$text-primary: #2c3e50;
$text-secondary: #95a5a6;
$bg-color: #ffffff;
$border-color: #f0f2f5;
$shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.05);

.comment-section {
  width: 100%;
  animation: fadeIn 0.6s ease-out;
  margin-top: 40px;
}

.comment-card {
  background: $bg-color;
  border-radius: 16px;
  padding: 40px;
  box-shadow: $shadow-soft;
}

.comment-title {
  font-size: 20px;
  font-weight: 700;
  color: $text-primary;
  margin: 0 0 30px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 24px;
    background: $primary;
    border-radius: 2px;
  }
}

.comment-input-wrapper {
  margin-bottom: 40px;
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:focus-within {
    background: #fff;
    border-color: rgba($primary, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  }
}

.comment-input {
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 15px;
  resize: none;
  outline: none;
  font-family: inherit;
  color: $text-primary;
  min-height: 80px;
  line-height: 1.6;

  &::placeholder {
    color: $text-secondary;
  }
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.03);
}

.comment-submit {
  padding: 10px 28px;
  background: $primary;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: $primary-dark;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba($primary, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #ccc;
  }
}

.comment-list {
  display: flex;
  flex-direction: column;
}

.comments-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.no-comments {
  text-align: center;
  color: $text-secondary;
  padding: 60px 0;

  .empty-icon {
    font-size: 48px;
    opacity: 0.5;
    margin-bottom: 16px;
    display: block;
  }

  p {
    font-size: 15px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .comment-card {
    padding: 24px;
  }

  .comment-input-wrapper {
    padding: 16px;
  }
}
</style>
