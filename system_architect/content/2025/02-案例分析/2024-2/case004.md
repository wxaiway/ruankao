---
id: 'case004'
title: 'Elasticsearch分词系统设计'
difficulty: 'medium'
chapter: '2024-2'
estimatedTime: 40
points: 25
year: '2024-2'
source: '2024年11月系统架构设计师真题'
tags:
  keywords: ["Elasticsearch","分词","搜索引擎"]
  domains: ["搜索技术","Web应用"]
  difficulty: 'medium'
---

## 试题四：Web应用

Web Elasticsearch分词的商品推荐系统（微信小程序接入）

【问题1】Standard, Simple, Whitespace, Keyword分词引擎的特点差异（几种分词器怎么分词）（6分）

【问题2】系统架构图填空，从给出的选项中选出对应的选项填入对的位置。（12分） 分层：接入层、显示层、网络层、应用层、业务逻辑层、控制层、数据层。 技术：Mybatis、 Nginx、 Flink、 Javascript、 Node js、 RESTful、 Elasticsearch、Kafka

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/8oLl952owjMJ4lap/img/52c2178b-b78b-4062-af29-97e2a39435e5.png)

【问题3】RESTful 架构有什么特点，是如何实现前后端分离的。（7分）

###
<!-- ANSWER_START -->
## 参考答案

【问题1】

1.Standard分词器：特点：是默认的分词器，对于英文，它按照单词进行切分，并将大写字母转换为小写；对于中文，则简单地将中文文本拆分为单个汉字。

2.Simple分词器：特点：按照非字母字符（如标点符号、数字、特殊字符等）进行切分，同时会将大写字母转换为小写，并过滤掉这些非字母字符。

3.Whitespace分词器：特点：仅仅按照空白字符（如空格、制表符等）进行切分，不会进行小写转换，也不会过滤掉任何字符（包括标点符号和数字）。

4.Keyword分词器：特点：不进行任何切分，将输入的整个字符串作为一个单独的词（或称为“关键词”）来处理。

【问题2】题目出自ProcessOn的模版，不是很严谨。

（1）显示层 （2）控制层 （3）Javascript （4）Restful （5）业务逻辑层

（6）数据层 （7）MyBatis （8）Nginx

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/8oLl952owjMJ4lap/img/2ee6c1c2-2401-4c0c-bb9a-6a9668f3ae36.png)

【问题3】

RESTful架构通过定义一套规范来实现前后端分离。以下是实现前后端分离的关键点：

（1）资源定义与URL规范：在RESTful架构中，每种URL代表一种资源。通过不同的HTTP请求方法（如GET、POST、PUT、DELETE）对同一URL进行操作，可以实现对该资源的不同功能，如获取、添加、修改和删除。

（2）请求方式与响应格式：客户端使用标准的HTTP方法（GET、POST、PUT、DELETE）对服务器上的资源进行操作。服务器响应通常以JSON格式返回数据，这样前端可以轻松地解析和处理这些数据。

（3）前后端职责分离：前端主要负责用户界面与用户体验，包括页面展示、渲染速率和效果。前端通过发送Ajax请求与后端进行交互，并接收JSON格式的数据进行展示。后端专注于业务逻辑处理与数据存储。后端接收前端的请求，处理业务逻辑，然后返回相应的数据给前端。

（4）前后端交互规范：前后端通过RESTful规范进行数据交互。这意味着双方需要遵循相同的接口定义、请求方法和响应格式。这种规范使得前后端可以独立开发和维护，提高了团队的协作效率和系统的可扩展性。

## 关键要点

- 理解题目中的核心技术概念
- 掌握相关架构设计原理
- 能够分析实际应用场景

## 评分标准

- 技术理解准确性（40%）
- 分析逻辑清晰性（30%）
- 实践应用合理性（30%）

<!-- ANSWER_END -->
