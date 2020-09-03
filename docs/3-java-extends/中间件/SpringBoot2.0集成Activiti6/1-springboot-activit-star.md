# 1，开始配置

## 开始

- jdk1.8，idea，maven
- SptingBoot2
- activit6：https://www.activiti.org/get-started

## 依赖 pom.xml

```xml
<!-- 统一版本 -->
<properties>
    <activiti.version>6.0.0</activiti.version>
</properties>
    
<!-- activiti 涉及相关库 -->
<dependency>
    <groupId>org.activiti</groupId>
    <artifactId>activiti-spring-boot-starter-basic</artifactId>
    <version>${activiti.version}</version>
</dependency>
```

## 配置 Rescource

添加processes目录，该用以存放Activiti流程文件（bpmn文件）

```
src/main/rescource/processes
```

## 配置 application.yml

需要配置好数据源（spring.datasource）不然在初始化不了Acvitivi所使用到的28张表

配置Activiti，需要注意的是当前配置是在**Spring**节点下

```yaml
spring:

  activiti:
  
  	# 自动检查、部署流程定义文件
  	# true：启动时会效验process文件，如果文件不存在则会报错
  	# false：启动时不进行效验
    check-process-definitions: false 
    
    # 自动更新数据库结构，
    # 工作流由于版本的不同，设置成true的时候，生成表的数量也不同
    # true：不存在则进行创建，第一次启动时可以为true后面则定义为false
    # false：会删除重建
    database-schema-update: true 
    
    # 流程定义文件存放目录
    process-definition-location-prefix: classpath:/processes/ 
    
```

## 配置 SpringBootApplication

去除springboot默认的basic验证，否则访问项目需要提供用户名和密码

```java
org.activiti.spring.boot.SecurityAutoConfiguration.class
```

```java
@SpringBootApplication(exclude = {
        org.activiti.spring.boot.SecurityAutoConfiguration.class
})
public class ABLApplication {
	public static void main(String[] args) {
		SpringApplication.run(ABLApplication.class, args);
    }
}
```

## 初始化

通过IDEA进行启动，在配置的数据源库里面则会创建Activiti所使用到的28张表

1. ACT_EVT_LOG
1. ACT_GE_BYTEARRAY
1. ACT_GE_PROPERTY
1. ACT_HI_ACTINST
1. ACT_HI_ATTACHMENT
1. ACT_HI_COMMENT
1. ACT_HI_DETAIL
1. ACT_HI_IDENTITYLINK
1. ACT_HI_PROCINST
1. ACT_HI_TASKINST
1. ACT_HI_VARINST
1. ACT_ID_GROUP
1. ACT_ID_INFO
1. ACT_ID_MEMBERSHIP
1. ACT_ID_USER
1. ACT_PROCDEF_INFO
1. ACT_RE_DEPLOYMENT
1. ACT_RE_MODEL
1. ACT_RE_PROCDEF
1. ACT_RU_DEADLETTER_JOB
1. ACT_RU_EVENT_SUBSCR
1. ACT_RU_EXECUTION
1. ACT_RU_IDENTITYLINK
1. ACT_RU_JOB
1. ACT_RU_SUSPENDED_JOB
1. ACT_RU_TASK
1. ACT_RU_TIMER_JOB
1. ACT_RU_VARIABL