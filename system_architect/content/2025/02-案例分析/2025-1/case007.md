---
id: 'case007'
title: '医药知识图谱智能问答系统'
difficulty: 'hard'
chapter: '2025-1'
estimatedTime: 45
points: 25
year: '2025-1'
source: '2025年05月系统架构设计师真题'
tags:
  keywords: ["知识图谱","智能问答","scrapy","异步IO"]
  domains: ["知识图谱","人工智能"]
  difficulty: 'hard'
---

## 试题二：医院知识图谱

某公司拟开发一个医药领域的智能问答系统，以帮助用户快速准确的获取疾病病因、治疗方式、治疗周期、常用药物、症状表现和药物企业等医药领域信息。

基于项目需求，公司召开了项目讨论会。会上，张工指出基于关键词的中心化检索技术已无法满足用户获取医药领域信息的需求，应从各种医药信息网站网页数据中爬取数据构建医药领域知识图谱，并基于知识图谱实现信息的查询和智能问答。

**问题1**：医药知识图谱智能问答系统架构图（图为回忆版）填空，从以下选项中选择合适的选项填入图中空（1）—（9）

可选项：（9分）

（1）网络层（2）数据层（3）业务层（4）知识层

（5)  关系获取（6）实体获取（7）网页采集（8）知识管理

（9）知识清洗（10）数据清洗 （11）结构化数据（12）数据收集

（13）语句解析（14）意图识别（15）知识检索（16）知识抽取

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/yBRq1ZPjkr7PKOdv/img/a980ba33-c307-45d5-82ee-b7235fc4d141.png)

**问题2：**该知识图谱的实现使用了爬虫框架 scrapy，该框架图如下所示，请填写图中空（1）-（3)（3分）并解释异步IO的特点和优势（7分）。

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/yBRq1ZPjkr7PKOdv/img/ea516ee8-5286-460e-a2f7-8cb1d08cce8b.png)

**问题3**：请说一下知识图谱的构建和智能问答如何存储实现。（6分）

###
<!-- ANSWER_START -->
## 参考答案

**问题1：**（1）结构化数据 （2）数据收集（3）数据清洗

（4）知识管理 （5）知识层（6）知识检索

（7） 意图识别 （8）语句解析（9）知识抽取 （10）业务层

**问题2：**(1) scheduler   (2) scrapy engine (3) ltem Pipeline

异步 I/O 的核心特点是**非阻塞**和**事件驱动**。其核心优势在于：

1.  **高并发**：单线程即可处理海量连接。
    
2.  **高性能与高吞吐量**：极大减少了线程阻塞和上下文切换的开销，资源利用率极高。
    
3.  **低资源开销**：避免了创建大量线程所需的内存和CPU成本。
    

**问题3：**

*   **存储模型**：最常用的是**图数据库**，因为它能最直观地表示“实体-关系-实体”的三元组结构。
    
*   **常用数据库**：**Neo4j**（最流行）、**Nebula Graph**（国产开源）、**JanusGraph**、**TigerGraph**等。有时也会使用**RDF三元组库**（如Jena）或甚至适配后的关系数据库。
    
*   简单来说，**构建知识图谱是“写”入知识，而智能问答是“读”出知识**。两者通过**图数据库**这一核心存储与查询引擎紧密相连。
    
*   备选：问答（RAG）使用向量数据库？
    

**解析：**

类似的原文：图3-2

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/yBRq1ZPjkr7PKOdv/img/b962dd30-be99-44b4-aa87-574cee6e360e.png)

[请至钉钉文档查看附件《基于医药知识图谱的智能问答系统的设计与实现.pdf》](https://alidocs.dingtalk.com/i/nodes/93NwLYZXWyxXroNzCYQddaB78kyEqBQm?iframeQuery=anchorId%3DX02mf8i0ugupa9gjf7jy89)

## 详细解析

**

类似的原文：图3-2

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/yBRq1ZPjkr7PKOdv/img/b962dd30-be99-44b4-aa87-574cee6e360e.png)

[请至钉钉文档查看附件《基于医药知识图谱的智能问答系统的设计与实现.pdf》](https://alidocs.dingtalk.com/i/nodes/93NwLYZXWyxXroNzCYQddaB78kyEqBQm?iframeQuery=anchorId%3DX02mf8i0ugupa9gjf7jy89)

## 关键要点

- 理解题目中的核心技术概念
- 掌握相关架构设计原理
- 能够分析实际应用场景

## 评分标准

- 技术理解准确性（40%）
- 分析逻辑清晰性（30%）
- 实践应用合理性（30%）

<!-- ANSWER_END -->
