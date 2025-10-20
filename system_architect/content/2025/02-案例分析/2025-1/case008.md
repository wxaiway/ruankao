---
id: 'case008'
title: 'Redis主从复制与数据持久化'
difficulty: 'medium'
chapter: '2025-1'
estimatedTime: 40
points: 25
year: '2025-1'
source: '2025年05月系统架构设计师真题'
tags:
  keywords: ["Redis","主从复制","数据持久化","RDB","AOF"]
  domains: ["数据库系统","分布式系统"]
  difficulty: 'medium'
---

## 试题三：Redis

**问题1：**在 redis 主从复制，读写分离的架构中，主从库第一次同步的架构图如下，请填写图中空缺处。（10分）

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/yBRq1ZPjkr7PKOdv/img/798b85f4-85a9-41f3-9711-68ddec677f58.png)

**问题2**：主从库第一次同步完成之后，后面如果有数据更新是如何同步的，请填写图中空缺处。（6分）

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/yBRq1ZPjkr7PKOdv/img/d4564066-9c6d-47c1-955d-ca36b8d41a99.png)

**问题3**：数据持久化在系统非常重要，系统发生故障的时候需要进行数据恢复，请列举出 redis 中数据持久化的两种方式，并论述其优缺点。（9分）

###
<!-- ANSWER_START -->
## 参考答案

**问题1**：

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/yBRq1ZPjkr7PKOdv/img/6e0050a0-3bd1-4358-876b-cbccada5fbaf.png)

（1）请求数据同步 

（2）生成RDB

（3）记录RDB期间的所有命令到repl\_baklog

（4）发送RDB文件

（5）发送repl\_baklog中的命令

**问题2**: 

![image.png](https://alidocs.oss-cn-zhangjiakou.aliyuncs.com/res/yBRq1ZPjkr7PKOdv/img/565022bc-f724-4efc-869e-ac892a058078.png)

（1）去repl\_baklog（**复制积压缓冲区**）中获取offset后的数据

（2）发送offset后的命令

（3）执行命令

**问题3**：Redis 提供 RDB 和 AOF 两种持久化机制，其核心区别与对比如下：

*   **RDB (Redis Database) 原理**：定时生成内存数据的二进制快照，保存为 dump.rdb 文件。
    

**优点**

高性能： 二进制压缩存储，恢复速度极快 （适合大数据量场景）

低磁盘占用： RDB 文件紧凑（比 AOF 小 50%~70%）

容灾友好 ：单文件备份，便于传输到异地（如SCP 到远程服务器）

最小化阻塞： BGSAVE 仅 fork 瞬间阻塞（通常毫秒级）

**缺点**

数据丢失风险：两次备份间的数据可能丢失（如5分钟备份周期宕机，丢5分钟数据）

Fork 内存开销 ：fork 子进程时内存翻倍（10GB数据一临时占用 20GB）

实时性差：不支持秒级持久化（最低配置 save 60 10000 = 60 秒内 1万次改动才触发）

*   **AOF (Append Only File）原理**：记录所有写操作命令（文本格式），通过重放命令恢复数据。
    

**优点**

数据零丢失： 配置 appendfsync always 每次写命令刷盘（最高可靠性）

可读性强：文本格式记录操作历史（可用于审计或手动修复）

故障恢复灵活： 支持 redis-check-aof 工具修复损坏的 AOF 文件 

自动重与压缩： BGREWRITEAOF 重写冗余命令（如100次 INCR -> 1次 SET)

**缺点**

文件体积大：相同数据集 AOF 文件通常远大于 RDB（需定期重写压缩）

恢复速度慢 ：重放命令比加载 RDB 慢数倍（10GB数据可能需要分钟级恢复）

写入性能开销：always 模式每次写命令刷盘，性能下降 50%+

潜在 Bug 风险： 重放 AOF 时若命令存在逻辑错误（如依赖中问状态），可能导致数据不一致

**解析**：

| 持久化机制 | 说明 | 优点 | 缺点 | 适用场景 |
| --- | --- | --- | --- | --- |
| RDB（Redis Database） | 在指**定的时间间隔内，将内存中的数据集快照写入磁盘**，恢复时将快照文件直接读到内存。 | 1. 适合大规模数据恢复<br>2. **对性能影响小**，fork子进程进行持久化，主进程继续处理请求<br>3. **文件紧凑**，适合备份和灾难恢复 | 1. **可能会丢失最后一次快照后的数据**<br>2. fork子进程时，内存不足可能影响性能<br>3. 保存RDB文件时，**如果数据集大，时间会较长** | 1. **可以容忍一定数据丢失**<br>2. **大规模数据恢复场景**<br>3. 对数据恢复速度要求较高 |
| AOF（Append Only File） | **以日志形式记录每个写操作，追加到AOF文件**，重启时重新执行这些命令恢复数据。 | 1. **数据安全性高**，可配置不同同步策略，最多丢失1秒数据<br>2. AOF文件是**有序的写操作日志**，易读，可修改修复 | 1. **AOF文件通常比RDB文件大**<br>2. **性能比RDB稍差**，因为要不断记录写操作<br>3. 恢复速度比RDB慢 | 1. **对数据安全性要求高**，不能容忍数据丢失<br>2. **对恢复速度要求不苛刻** |
| RDB + AOF（版本4.0新增的机制） | **同时使用RDB和AOF持久化。** | 兼具RDB和AOF的优点，既有RDB的快速恢复能力，又有AOF的数据安全性。 | 1. 占用更多磁盘空间<br>2. 配置和管理相对复杂 | **对数据安全性和恢复速度都有较高要求的场景** |

## 关键要点

- 理解题目中的核心技术概念
- 掌握相关架构设计原理
- 能够分析实际应用场景

## 评分标准

- 技术理解准确性（40%）
- 分析逻辑清晰性（30%）
- 实践应用合理性（30%）

<!-- ANSWER_END -->
