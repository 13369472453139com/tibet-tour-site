import dotenv from 'dotenv';
dotenv.config();
import { writeFileSync } from 'fs';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const topics = [
  '高原反应预防与应对', '西藏必吃美食推荐', '藏传佛教寺庙参观指南',
  '拉萨八廓街转经攻略', '西藏摄影最佳机位', '西藏自驾游注意事项'
];

// 辅助函数：从可能包含额外文字的响应中提取 JSON
function extractJSON(str) {
  const start = str.indexOf('{');
  const end = str.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found');
  const jsonStr = str.slice(start, end + 1);
  return JSON.parse(jsonStr);
}

// 根据主题关键词生成 Unsplash 图片 URL
function getUnsplashImage(title) {
  const keyword = title.replace(/[，,？?！!、；;：:]/g, '').split(/\s+/).slice(0, 2).join(' ');
  return `https://source.unsplash.com/featured/1200x800?${encodeURIComponent(keyword)}`;
}

// 生成英文 slug（只保留字母数字和连字符）
function generateSlug(title) {
  // 先移除中文和特殊字符，只保留字母、数字、空格
  const latin = title.replace(/[^\w\s]/g, '')
    .replace(/[一二三四五六七八九十百千万]/g, '')
    .replace(/[高原反应预防应对西藏旅行必备指南]/g, '');
  
  // 如果上述方法得不到英文，使用时间戳
  if (!latin.match(/[a-zA-Z]/)) {
    return 'blog-' + Date.now();
  }
  
  // 转换为小写，空格替换为连字符
  return latin.toLowerCase().replace(/\s+/g, '-').substring(0, 50);
}

async function generateBlog() {
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const prompt = `请写一篇西藏旅游博客，主题：${topic}。
要求：只返回一个 JSON 对象，不要有任何其他文字。格式如下：
{
  "title": "博客标题",
  "description": "一句话摘要（50字内）",
  "content": "完整的 Markdown 格式正文，至少500字，段落分明，可以包含小标题。"
}`;

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const raw = response.choices[0].message.content;
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    data = extractJSON(raw);
  }

  // 生成英文 slug（关键修复）
  const slug = generateSlug(data.title);
  const today = new Date().toISOString().slice(0, 10);
  const imageUrl = getUnsplashImage(data.title);

  const mdx = `---
title: "${data.title}"
description: "${data.description}"
date: ${today}
slug: "${slug}"
image: "${imageUrl}"
---

${data.content}`;

  const filePath = `src/content/blog/${slug}.mdx`;
  writeFileSync(filePath, mdx, 'utf8');
  console.log(`✅ 新博客已生成：${filePath}`);
  console.log(`🖼️  图片地址：${imageUrl}`);
  console.log(`🔖  slug: ${slug}`);
}

generateBlog().catch(console.error);
