# 3，简单的开始

## BPMN目录

```
src/main/rescource/processes
```

## 安装插件

以IDEA来绘制流程文件前需要安装**actiBPM**插件，按照步骤

1. 访问 https://plugins.jetbrains.com/，搜索并下载 **actiBPM.jar**
2. 打开IDEA，File -> Settings -> plugins (或ctrl+alt+s)
3. 选择Install Plugin from disk ，选择文件从硬盘方式安装
4. 重启IDEA生效

## 绘制流程

在BPMN目录下右击新建文件 new -> BPMN文件，**文件名 n1.bpmn** （文件名后面会使用）

### 开始绘制简单流程

<img src="/img/image-20200703192806418.png" alt="image-20200703192806418" style="zoom:200%;" />

### 流程模块属性

<img src="/img/image-20200703192659001.png" alt="image-20200703192659001" style="zoom: 200%;" />

## 乱码问题

idea安装目录下找到文件打开，在后面追加 encoding 重启以解决

```
#文件
idea.exe.vmoptions
idea64.exe.vmoptions

#打开后追加一下代码
-Dfile.encoding=UTF-8
```

需要注意的是若是以上述情况还解决不了乱码的话，尝试查找C盘用户目录下关于idea64.exe.vmoptions文件按照上述情况进行处理（下列为我本地所在的目录）

```
C:\Users\abl\AppData\Roaming\JetBrains\IntelliJIdea2020.1\idea64.exe.vmoptions
```

## 流程开始

### 创建Conrotller

因Activiti核心服务接口依赖SpringBoot才可以启动，所以创建一个Contorller来进行Debug调试

声明要使用到的Activiti核心服务

```java
@Controller
@RequestMapping("/activiti")
public class TestActivitiController {

    @Autowired
    private RepositoryService repositoryService;

    @Autowired
    private RuntimeService runtimeService;

    @Autowired
    private TaskService taskService;
    
}
```

### 发布流程

```java
@RequestMapping("/fb")
public void FB(){

    Deployment deploy = repositoryService.createDeployment()
        .name("简单流程") // 流程名称
        .addClasspathResource("processes/n1.bpmn") // 流程文件
        .deploy(); // 部署

    System.out.println("部署Id:" + deploy.getId());
    System.out.println("部署名称:" + deploy.getName());

} 
```

```
部署Id:1
部署名称:简单流程
```

### 启动流程

```java
@RequestMapping("/qd")
public void QD(){

    // 根据key进行流程的启动
    ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("myProcess_1");

    System.out.println(processInstance.getProcessDefinitionId());
    System.out.println(processInstance.getId());

}
```

```
myProcess_1:2:5004
7501
```

### 获取任务

```java
@RequestMapping("/rw")
public void RW(){

    // 查询manager代理人的任务列表
    String assignee = "group";

    // 任务列表
    List<Task> taskList = taskService.createTaskQuery().taskCandidateOrAssigned(assignee).list();

    for (Task task : taskList) {
        System.out.println("taskId:" + task.getId() +
        ",taskName:" + task.getName() +
        ",assignee:" + task.getAssignee() +
        ",createTime:" + task.getCreateTime());
    }

}
```

```
taskId:2505,taskName:项目组长,assignee:group,createTime:Fri Jul 03 18:57:59 CST 2020
```

### 任务办理

通过任务Id来进行任务的办理完成 2505 为当前 group 任务办理，办理成功后会进入下一个阶段 manager

```java
@RequestMapping("/bl")
public void BL(){
	taskService.complete("2505");
}
```
