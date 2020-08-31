# 2，Activiti介绍

## Activiti核心服务接口

通过提供的服务接口对流程进行控制、操作28张表

| Service           | 说明                                                         |
| ----------------- | ------------------------------------------------------------ |
| repositoryService | 流程仓库service，用于管理流程仓库，增删改查流程资源          |
| runtimeService    | 运行时service，处理正在运行状态的流程实例，任务等            |
| taskService       | 任务service，管理,查询任务，例如签收，办理,指派任务          |
| historyService    | 历史service，可以查询所有历史数据，例如，流程实例，任务，活动，变量，附件等 |
| managementService | 引擎管理service，和具体业务无关,主要是查询引擎配置，数据库，作业等 |
| identityService   | 身份service，可以管理和查询用户，组之间的关系                |
| formService       | 表单service，处理正在运行状态的流程实例,任务等               |

## Activiti表

ACT_GE 通用类、ACT_HI 历史记录类、ACT_ID 用户信息类、ACT_RE 流程实例类、ACT_RU 运行时类

| 表名                  | 说明                         |
| :-------------------- | :--------------------------- |
| ACT_EVT_LOG           | 事件日志表(实验性质)         |
| ACT_GE_BYTEARRAY      | 通用的流程定义和流程资源     |
| ACT_GE_PROPERTY       | 系统相关属性                 |
| ACT_HI_ACTINST        | 历史的流程实例               |
| ACT_HI_ATTACHMENT     | 历史的流程附件               |
| ACT_HI_COMMENT        | 历史的批注信息               |
| ACT_HI_DETAIL         | 历史的流程运行中的细节信息   |
| ACT_HI_IDENTITYLINK   | 历史的流程运行过程中用户关系 |
| ACT_HI_PROCINST       | 历史的流程实例               |
| ACT_HI_TASKINST       | 历史的任务实例               |
| ACT_HI_VARINST        | 历史的流程运行中的变量信息   |
| ACT_ID_GROUP          | 组                           |
| ACT_ID_INFO           | 用户详细信息                 |
| ACT_ID_MEMBERSHIP     | 用户和组关系的中间表         |
| ACT_ID_USER           | 用户表                       |
| ACT_RE_DEPLOYMENT     | 部署的流程信息               |
| ACT_RE_MODEL          | 流程模型信息                 |
| ACT_RE_PROCDEF        | 流程定义信息                 |
| ACT_RU_DEADLETTER_JOB | 存储执行失败的任务表(异步)   |
| ACT_RU_EVENT_SUBSCR   | 运行时事件                   |
| ACT_RU_EXECUTION      | 运行时流程执行实例           |
| ACT_RU_IDENTITYLINK   | 运行时用户关系信息           |
| ACT_RU_JOB            | 运行时作业(异步)             |
| ACT_RU_SUSPENDED_JOB  | 暂停运行的任务(异步)         |
| ACT_RU_TASK           | 运行时任务                   |
| ACT_RU_TIMER_JOB      | 任务定时器表(异步)           |
| ACT_RU_VARIABLE       | 运行时变量表                 |
| ACT_PROCDEF_INFO      | 流程定义信息表               |