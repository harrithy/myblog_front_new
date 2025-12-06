<template>
  <Transition name="fade">
    <div v-if="results.length > 0" class="search-results">
      <div class="results-header">
        <span>找到 {{ results.length }} 个结果</span>
      </div>
      <div class="results-list">
        <div
          v-for="item in results"
          :key="item.id"
          class="result-item"
          @click="$emit('item-click', item)"
        >
          <!-- 左侧封面图 -->
          <div class="item-cover">
            <img v-if="item.img_url" :src="item.img_url" :alt="item.name" />
            <div v-else class="placeholder-icon">
              <svg-icon :name="item.type === 'folder' ? 'folder' : 'article'" />
            </div>
          </div>

          <!-- 右侧内容区 -->
          <div class="item-content">
            <!-- 分类标签 -->
            <div class="item-tag" :class="item.type">
              {{ item.type === 'folder' ? 'FOLDER' : 'ARTICLE' }}
            </div>

            <!-- 标题 -->
            <h3 class="item-title">{{ item.name }}</h3>

            <!-- 底部信息 -->
            <div class="item-meta">
              <div class="meta-left">
                <span class="author">By Harrio</span>
                <span class="date">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {{ item.created_at?.split(' ')[0] || 'Just now' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
export interface SearchResult {
  id: number
  name: string
  type: 'folder' | 'article'
  img_url?: string
  url?: string
  parent_id?: number
  sort_order: number
  created_at: string
  updated_at: string
}

defineProps<{
  results: SearchResult[]
}>()

defineEmits<{
  (e: 'item-click', item: SearchResult): void
}>()
</script>

<style scoped lang="scss">
// 搜索结果列表
.search-results {
  width: 100%;
  max-width: 800px;
  margin-top: 30px;
  background: transparent;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);
  overflow: hidden;

  .results-header {
    padding: 0 0 16px 4px;
    flex-shrink: 0;
    display: flex;

    span {
      font-size: 14px;
      color: #666;
      font-weight: 600;
      letter-spacing: 0.5px;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(4px);
      padding: 6px 16px;
      border-radius: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
  }

  .results-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
    padding: 4px;
    padding-bottom: 20px;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
  }

  .result-item {
    display: flex;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 16px;
    padding: 16px; // 稍微减小内边距，更紧凑
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow:
      0 10px 30px -10px rgba(0, 0, 0, 0.05),
      0 0 0 1px rgba(255, 255, 255, 0.6) inset;
    border: 1px solid rgba(255, 255, 255, 0.5);
    gap: 20px;
    height: 200px;

    &:hover {
      transform: translateY(-5px) scale(1.01);
      background: rgba(255, 255, 255, 0.95);
      // 粉紫色光晕
      box-shadow:
        0 20px 40px -10px rgba(255, 182, 193, 0.3),
        0 0 0 1px rgba(255, 255, 255, 1) inset,
        0 0 0 4px rgba(255, 182, 193, 0.1); // 外圈光环
      border-color: rgba(255, 182, 193, 0.3);

      .item-cover img {
        transform: scale(1.08);
      }

      .item-title {
        color: #ff9a9e; // 标题变色
      }
    }

    // 左侧封面图
    .item-cover {
      width: 240px;
      height: 100%;
      border-radius: 16px;
      overflow: hidden;
      flex-shrink: 0;
      background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); // 默认背景
      position: relative;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      .placeholder-icon {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        // 渐变背景占位
        background: linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%);
        color: white;

        svg {
          width: 50px;
          height: 50px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          opacity: 0.9;
        }
      }
    }

    // 右侧内容
    .item-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 4px 0;
      min-width: 0;

      .item-tag {
        align-self: flex-start;
        font-size: 10px;
        font-weight: 800;
        padding: 5px 12px;
        border-radius: 12px;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-bottom: 10px;
        backdrop-filter: blur(4px);

        &.folder {
          background: linear-gradient(135deg, rgba(255, 176, 79, 0.15), rgba(255, 176, 79, 0.05));
          color: #ffb04f;
          border: 1px solid rgba(255, 176, 79, 0.2);
        }

        &.article {
          background: linear-gradient(135deg, rgba(161, 140, 209, 0.15), rgba(251, 194, 235, 0.05));
          color: #a18cd1;
          border: 1px solid rgba(161, 140, 209, 0.2);
        }
      }

      .item-title {
        font-size: 20px;
        font-weight: 700;
        color: #4a4a4a;
        line-height: 1.5;
        margin: 0 0 auto 0;
        display: -webkit-box;
        -webkit-line-clamp: 2; // 改为2行，更清爽
        -webkit-box-orient: vertical;
        overflow: hidden;
        transition: color 0.3s ease;
      }

      .item-meta {
        display: flex;
        align-items: center;
        padding-top: 16px;
        border-top: 1px dashed rgba(0, 0, 0, 0.06); // 虚线分割

        .meta-left {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 12px;
          color: #999;
          font-weight: 500;

          .author {
            color: #666;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;

            &::before {
              content: '';
              display: block;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);
            }
          }

          .date {
            display: flex;
            align-items: center;
            gap: 6px;

            svg {
              width: 14px;
              height: 14px;
              opacity: 0.7;
            }
          }
        }
      }
    }
  }
}

// 淡入淡出动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
