import dotenv from 'dotenv';
dotenv.config();
import { writeFileSync } from 'fs';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const topics = [
  '拉萨深度文化游', '纳木错圣湖摄影之旅', '珠峰东坡徒步',
  '林芝桃花节专线', '阿里大环线探险', '山南藏文化溯源'
];

function extractJSON(str) {
  const start = str.indexOf('{');
  const end = str.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found');
  return JSON.parse(str.slice(start, end + 1));
}

async function generateTour() {
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const prompt = `你是一位西藏旅游专家。请生成一条完整的旅游线路，主题：${topic}。
返回 JSON 格式，不要有其他文字。JSON 结构如下：
{
  "title": "线路标题",
  "description": "一句话简介（30字内）",
  "duration": "X天X晚",
  "price": 数字（1000-5000）,
  "image": "/img/default.jpg",
  "slug": "英文短标识",
  "content": "详细Markdown内容"
}`;
  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });
  let data;
  try {
    data = JSON.parse(response.choices[0].message.content);
  } catch (e) {
    data = extractJSON(response.choices[0].message.content);
  }
  const md = `---
title: "${data.title}"
description: "${data.description}"
duration: "${data.duration}"
price: ${data.price}
image: "${data.image}"
---
${data.content}`;
  const filePath = `src/content/tours/${data.slug}.mdx`;
  writeFileSync(filePath, md, 'utf8');
  console.log(`✅ 新线路已生成：${filePath}`);
}
generateTour().catch(console.error);
