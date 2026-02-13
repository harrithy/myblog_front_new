export const HORSE_YEAR_RECOMMEND_PAGE_SIZE = 5

export interface HorseYearRecommendMessage {
  text: string
  typeLabel: string // 四字类型标签
  stars: 3 | 4 | 5
}

export const HORSE_YEAR_RECOMMEND_MESSAGES: HorseYearRecommendMessage[] = [
  { text: '马蹄声声辞旧岁，喜气洋洋迎新春。祝您马年行大运，前程似锦步步高！', typeLabel: '前程似锦', stars: 5 },
  { text: '龙马精神启新篇，春风得意万事兴。愿你马年一路高歌，心想事成。', typeLabel: '事业腾飞', stars: 5 },
  { text: '马到成功好运来，阖家安康福满门。新岁新程，步步皆坦途。', typeLabel: '阖家幸福', stars: 5 },
  { text: '策马扬鞭奔锦程，鸿运当头喜相逢。祝你马年事业腾飞，生活灿烂。', typeLabel: '事业腾飞', stars: 4 },
  { text: '马年春来百业旺，家和人顺笑声长。愿你岁岁平安，日日欢喜。', typeLabel: '平安喜乐', stars: 4 },
  { text: '金马踏春添瑞气，万象更新福满堂。愿你新年有光有梦，所愿皆成。', typeLabel: '梦想成真', stars: 5 },
  { text: '马年喜乐随风至，福禄寿禧入户来。愿你身康心暖，诸事顺遂。', typeLabel: '健康长寿', stars: 4 },
  { text: '春鼓催征马蹄急，奋斗路上尽朝晖。祝你马年勇往直前，大展宏图。', typeLabel: '事业腾飞', stars: 5 },
  { text: '万里征程马作伴，千般美好共新春。愿你所行皆坦荡，所见皆风景。', typeLabel: '前程似锦', stars: 4 },
  { text: '马年到，福气到，财气到。愿你好运连连，幸福年年。', typeLabel: '财运亨通', stars: 5 },
  { text: '马跃新程开胜景，花开富贵报平安。祝你马年阖家美满，喜事成双。', typeLabel: '阖家幸福', stars: 5 },
  { text: '骏马迎春歌盛世，吉星高照照前程。愿你新岁无忧，万事皆宜。', typeLabel: '万事顺意', stars: 4 },
  { text: '新春马踏祥云来，喜乐安宁满人间。愿你事业有成，生活有甜。', typeLabel: '平安喜乐', stars: 4 },
  { text: '马年如意春常在，福满乾坤喜满怀。愿你每一步都走向好运。', typeLabel: '好运连连', stars: 4 },
  { text: '龙马精神日日新，扬鞭奋进步步稳。祝你马年收获满满，笑口常开。', typeLabel: '事业腾飞', stars: 5 },
  { text: '马鸣盛世迎新岁，灯火万家共团圆。愿你家人常伴，温暖常在。', typeLabel: '阖家幸福', stars: 5 },
  { text: '春风送暖马蹄疾，鸿图大展正当时。祝你马年敢想敢拼，所向披靡。', typeLabel: '事业腾飞', stars: 5 },
  { text: '骏马奔腾迎旭日，前路光明万事兴。愿你新年好运不打烊。', typeLabel: '好运连连', stars: 4 },
  { text: '马年顺遂财源广，福运绵长喜气扬。愿你生活明朗，未来可期。', typeLabel: '财运亨通', stars: 5 },
  { text: '马到功成传捷报，春回大地万象新。祝你新岁一帆风顺，步步高升。', typeLabel: '前程似锦', stars: 5 },
  { text: '马踏飞燕开鸿运，花开并蒂报安康。愿你马年收获幸福与从容。', typeLabel: '平安喜乐', stars: 4 },
  { text: '瑞气盈门迎马岁，平安喜乐伴朝夕。祝你新年心宽体健，事事称心。', typeLabel: '平安喜乐', stars: 4 },
  { text: '马年春色映华章，家业兴隆福绵长。愿你每一天都顺心如意。', typeLabel: '阖家幸福', stars: 4 },
  { text: '扬鞭启程追梦想，骏马奋蹄向远方。祝你马年突破自我，惊艳时光。', typeLabel: '梦想成真', stars: 5 },
  { text: '马跃山河添锦绣，春临四海报吉祥。愿你新年好运加倍，福气翻番。', typeLabel: '好运连连', stars: 4 },
  { text: '马年好运常相伴，吉祥如意满心田。愿你前路坦荡，万事可成。', typeLabel: '万事顺意', stars: 4 },
  { text: '春回大地花千树，马跃新程福万家。祝你新岁有爱有盼，心愿成真。', typeLabel: '梦想成真', stars: 5 },
  { text: '马到门前百福来，岁月安然喜自开。愿你新年平安顺遂，得偿所愿。', typeLabel: '平安喜乐', stars: 4 },
  { text: '金鞍玉勒迎新岁，富贵荣华步步来。祝你马年财运亨通，事业常红。', typeLabel: '财运亨通', stars: 5 },
  { text: '马蹄踏响幸福路，春光照亮奋斗心。愿你马年既有收获，也有欢喜。', typeLabel: '事业腾飞', stars: 4 },
  { text: '马年吉庆满乾坤，欢声笑语庆团圆。愿你与家人共度每一段好时光。', typeLabel: '阖家幸福', stars: 5 },
  { text: '一马当先开新局，万马奔腾创未来。祝你马年拼劲十足，成绩亮眼。', typeLabel: '学业有成', stars: 5 },
  { text: '马鸣春晓报佳音，福到人间喜盈门。愿你新年诸事皆顺，日日都有好消息。', typeLabel: '万事顺意', stars: 4 },
  { text: '春风拂面马蹄轻，万事从容皆可期。祝你马年心境明媚，步履坚定。', typeLabel: '前程似锦', stars: 4 },
  { text: '马年新岁福临门，平安健康值千金。愿你身体康健，万事无忧。', typeLabel: '健康长寿', stars: 5 },
  { text: '马踏青云追日月，志乘长风越山海。祝你新年勇敢逐梦，不负热爱。', typeLabel: '梦想成真', stars: 5 },
  { text: '马到成功好兆头，财喜双收乐无忧。愿你马年喜气洋洋，笑意常在。', typeLabel: '财运亨通', stars: 5 },
  { text: '春到人间花似锦，马腾盛世福如潮。祝你新岁幸福常伴，烦恼远离。', typeLabel: '平安喜乐', stars: 4 },
  { text: '马年奋进正当时，志在四方气如虹。愿你一路生花，所向皆胜。', typeLabel: '事业腾飞', stars: 5 },
  { text: '骏马驰骋天地阔，人生得意正青春。祝你马年朝气蓬勃，前程灿烂。', typeLabel: '前程似锦', stars: 4 },
  { text: '马蹄踏雪迎春归，灯火可亲照团圆。愿你岁岁有家可归，年年有爱相随。', typeLabel: '阖家幸福', stars: 5 },
  { text: '马年福星高高照，喜乐安宁岁岁好。祝你平安健康，顺遂无忧。', typeLabel: '健康长寿', stars: 5 },
  { text: '马上有福马上到，马上有喜马上来。愿你马年好运连环，惊喜不断。', typeLabel: '好运连连', stars: 5 },
  { text: '马跃新春添锦绣，心怀热望向朝阳。祝你在新的一年里，敢闯敢赢。', typeLabel: '事业腾飞', stars: 5 },
  { text: '吉马迎春报平安，万家灯火映笑颜。愿你家庭和睦，幸福绵延。', typeLabel: '阖家幸福', stars: 4 },
  { text: '马年春暖百花开，前程似锦好运来。祝你事业进阶，生活升级。', typeLabel: '前程似锦', stars: 4 },
  { text: '扬帆起航趁东风，策马奔腾向新峰。愿你马年昂首向前，收获丰盛。', typeLabel: '事业腾飞', stars: 5 },
  { text: '马踏金阶迎富贵，春临福地纳祥和。祝你新岁吉祥，诸愿皆圆。', typeLabel: '财运亨通', stars: 5 },
  { text: '马年晨曦照前路，脚下生风志更坚。愿你一步一成长，一年一蜕变。', typeLabel: '学业有成', stars: 4 },
  { text: '龙马精神添虎劲，马到成功报捷音。祝你新春大吉，万事皆胜。', typeLabel: '万事顺意', stars: 4 },
]

export default HORSE_YEAR_RECOMMEND_MESSAGES
