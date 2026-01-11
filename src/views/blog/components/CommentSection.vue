<template>
  <div class="comment-section">
    <div class="comment-card">
      <h3 class="comment-title">💬 评论区</h3>

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
        <div v-else v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-avatar">
            <img :src="comment.avatar_url" alt="" />
          </div>
          <div class="comment-body">
            <div class="comment-header">
              <span class="comment-author">{{ comment.nickname }}</span>
              <span class="comment-time">{{ comment.time }}</span>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 评论接口
import commentApi from '@/api/comment'

interface Comment {
  id: number
  article_id: number
  parent_id?: number
  nickname: string
  email?: string
  avatar_url?: string
  content: string
  time: string
}

// 文章ID
const props = defineProps({
  articleId: {
    type: Number,
    required: true,
  },
})
// 新评论内容
const newComment = ref('')
// 评论列表
const comments = ref<Comment[]>([])
// 分页加载评论列表
const page = ref(1)
const pageSize = ref(10)
const fetchComments = () => {
  if (!props.articleId) return
  const params = {
    article_id: props.articleId,
    page: page.value,
    page_size: pageSize.value,
  }
  commentApi.getComments(params).then((res) => {
    comments.value = res as Comment[]
  })
}

onMounted(() => {
  fetchComments()
})

// 监听文章ID变化
import { watch } from 'vue'
watch(
  () => props.articleId,
  (newVal) => {
    if (newVal) {
      fetchComments()
    }
  },
)
// 从stores里获取userinfo
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
// 提交评论
const submitComment = () => {
  // console.log('123', userStore.userInfo)
  const data = {
    article_id: props.articleId,
    // parent_id: 0,
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
</script>

<style lang="scss" scoped>
$primary: #e8a0bf;
$primary-light: #f4c7d5;
$primary-dark: #d48aa7;
$text-primary: #4a4a4a;
$text-secondary: #8c8c8c;
$glass-bg: rgba(255, 255, 255, 0.6);
$border-color: rgba(255, 255, 255, 0.5);
$shadow-soft: 0 8px 32px 0 rgba(31, 38, 135, 0.05);

.comment-section {
  width: 100%;
  animation: fadeIn 0.5s ease-out;
}

.comment-card {
  background: $glass-bg;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid $border-color;
  border-radius: 24px;
  padding: 32px;
  box-shadow: $shadow-soft;
}

.comment-title {
  font-size: 18px;
  font-weight: 700;
  color: $text-primary;
  margin: 0 0 24px 0;
  padding-bottom: 16px;
  border-bottom: 1px dashed rgba($primary, 0.3);
}

.comment-input-wrapper {
  margin-bottom: 32px;
  background: rgba(255, 255, 255, 0.5);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba($primary, 0.1);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: $primary;
    box-shadow: 0 0 0 4px rgba($primary, 0.1);
    background: rgba(255, 255, 255, 0.8);
  }
}

.comment-input {
  width: 100%;
  padding: 12px;
  border: none;
  background: transparent;
  font-size: 14px;
  resize: none;
  outline: none;
  font-family: inherit;
  color: $text-primary;
  min-height: 80px;

  &::placeholder {
    color: $text-secondary;
  }
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba($primary, 0.1);
}

.comment-submit {
  padding: 8px 24px;
  background: $primary;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba($primary, 0.3);

  &:hover:not(:disabled) {
    background: $primary-dark;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba($primary, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.no-comments {
  text-align: center;
  color: $text-secondary;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  .empty-icon {
    font-size: 32px;
    opacity: 0.5;
  }

  p {
    font-size: 14px;
  }
}

.comment-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.7);
    transform: translateX(4px);
  }
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-light, $primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba($primary, 0.2);
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-author {
  font-size: 14px;
  font-weight: 700;
  color: $text-primary;
}

.comment-time {
  font-size: 12px;
  color: $text-secondary;
}

.comment-content {
  font-size: 14px;
  color: $text-primary;
  line-height: 1.6;
  margin: 0;
  word-break: break-word;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .comment-card {
    padding: 20px;
  }
}
</style>
