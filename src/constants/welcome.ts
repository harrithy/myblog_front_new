// 定义接口
interface WelcomeObj {
  welcomeText: string
  visitTextMap: { [key: number]: string }
}

// 欢迎语
const welcomeObj: WelcomeObj = {
  welcomeText: 'Hello, welcome to my blog!',
  visitTextMap: {
    1: '悄悄地进入了你的博客',
    2: '漫不经心地浏览了你的博客',
    3: '在互联网的海洋中邂逅了你的博客',
    4: '被一篇有趣的文章吸引而来',
    5: '从搜索引擎的结果中找到了这里',
    6: '通过一个友好的链接访问了你的博客',
    7: '对你的技术分享充满了好奇',
    8: '被你独特的见解所折服',
    9: '在这里寻找灵感与启发',
    10: '希望在你的博客里发现宝藏',
  },
}

export default welcomeObj
