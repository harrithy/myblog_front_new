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
        <!-- 评论分隔装饰线 -->
        <div class="comment-divider">
          <span class="divider-line"></span>
          <span class="divider-icon">✨</span>
          <span class="divider-line"></span>
        </div>

        <div v-if="comments.length === 0" class="no-comments">
          <div class="empty-illustration">
            <div class="floating-elements">
              <span class="float-item">💭</span>
              <span class="float-item delay-1">🌸</span>
              <span class="float-item delay-2">✨</span>
            </div>
            <span class="empty-icon">🍃</span>
          </div>
          <p class="empty-title">这里还没有评论</p>
          <p class="empty-subtitle">来做第一个发言的人吧~</p>
        </div>

        <div v-else class="comments-container">
          <TransitionGroup name="comment-list" tag="div" class="comment-transition-wrapper">
            <div
              v-for="(comment, index) in comments"
              :key="comment.id"
              class="comment-item-wrapper"
              :style="{ '--delay': index * 0.08 + 's' }"
            >
              <CommentItem :comment="comment" @reply-success="fetchComments" />
            </div>
          </TransitionGroup>
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

// 评论分隔装饰线
.comment-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;

  .divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba($primary, 0.3), transparent);
    max-width: 120px;
  }

  .divider-icon {
    font-size: 16px;
    opacity: 0.6;
    animation: sparkle 2s ease-in-out infinite;
  }
}

@keyframes sparkle {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2) rotate(15deg);
    opacity: 1;
  }
}

.comments-container {
  display: flex;
  flex-direction: column;
}

.comment-transition-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comment-item-wrapper {
  animation: slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: var(--delay);
  opacity: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba($primary, 0.1);
    border-color: rgba($primary, 0.2);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 评论列表过渡动画
.comment-list-enter-active {
  animation: slideInUp 0.4s ease-out;
}

.comment-list-leave-active {
  animation: slideInUp 0.3s ease-in reverse;
}

.comment-list-move {
  transition: transform 0.3s ease;
}

.no-comments {
  text-align: center;
  color: $text-secondary;
  padding: 60px 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(248, 249, 250, 0.5));
  border-radius: 20px;
  border: 1px dashed rgba($primary, 0.2);
  position: relative;
  overflow: hidden;

  .empty-illustration {
    position: relative;
    margin-bottom: 20px;
  }

  .floating-elements {
    position: absolute;
    width: 100%;
    height: 100%;
    top: -20px;
    left: 0;
    pointer-events: none;
  }

  .float-item {
    position: absolute;
    font-size: 20px;
    animation: floatAround 4s ease-in-out infinite;
    opacity: 0.6;

    &:nth-child(1) {
      left: 30%;
      animation-delay: 0s;
    }
    &:nth-child(2) {
      left: 50%;
      animation-delay: 1.3s;
    }
    &:nth-child(3) {
      left: 70%;
      animation-delay: 2.6s;
    }
  }

  .empty-icon {
    font-size: 56px;
    display: block;
    animation: gentleFloat 3s ease-in-out infinite;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  }

  .empty-title {
    font-size: 17px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 8px;
  }

  .empty-subtitle {
    font-size: 14px;
    color: $text-secondary;
    opacity: 0.8;
  }
}

@keyframes floatAround {
  0%,
  100% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0.4;
  }
  25% {
    transform: translateY(-15px) translateX(5px) rotate(5deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-25px) translateX(-5px) rotate(-5deg);
    opacity: 0.5;
  }
  75% {
    transform: translateY(-10px) translateX(10px) rotate(3deg);
    opacity: 0.8;
  }
}

@keyframes gentleFloat {
  0%,
  100% {
    transform: translateY(0) rotate(-3deg);
  }
  50% {
    transform: translateY(-8px) rotate(3deg);
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
