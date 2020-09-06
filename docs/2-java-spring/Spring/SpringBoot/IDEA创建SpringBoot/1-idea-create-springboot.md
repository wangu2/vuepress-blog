# Spring Boot - 多模块项目创建

> 使用 IDEA 2020.1 进行 Spring Boot 的开发，对功能模板内容进行拆分处理。
> 提供给其他模块调用、或者项目可以进行单独的引用
>
> IDEA 2020.1、Maven构建

## 初始化项目

::: tip  选择

方式1: 在 IDEA 启动页选择 **Create New Project**

方式2: 打开 IDEA 工具栏 **File -> New -> Project**
:::

![image-20200903202324285](/img/image-20200903202324285.png)

选择使用官网的配置进行初始化项目，当然你也可以直接从 Http://start.spring.io 上填写完基本信息后直接下载基础包。

## 基本信息填写

填写项目基本信息与项目版本的选择，多模块应用 **Group** 信息一致便于管理

![image-20200904103913260](/img/image-20200904103913260.png)

在这边如果使用默认版本则直接点击 **Next** 按钮，或选择其他 Spring Boot 版本后 **Next** （这里演示使用的是默认版本）

![image-20200904104601699](/img/image-20200904104601699.png)

::: tip 提示
在 Project Sdk 选择时如果协同开发其他人选择低于当前选择的版本，则会出现附加不了情况。
::: 

## 存储位置选择

接上一步完成后，这里可以选择当前项目的存储位置

![image-20200904104951300](/img/image-20200904104951300.png)

删除不需用的文件及文件夹（不使用 **GIT**** ，也可以删除 .gitignore :rofl:）

![image-20200904110847246](/img/image-20200904110847246.png)

![image-20200904111305436](/img/image-20200904111305436.png)

## 添加子模块


```
File -> New -> Module
选择使用 Maven，来进行 Module 的创建，继承父类模块信息 DEMO
```

![image-20200904112211402](/img/image-20200904112211402.png)

![image-20200904112544753](/img/image-20200904112544753.png)

按照上述操作后在根目录 **POM.XML** 内会追加当前子模块的信息

![image-20200904112834199](/img/image-20200904112834199.png)

多模块项目创建完成，模块之间的依赖在对应模块内添加即可

```xml
<!-- DEMO1 pom.xml -->
<!-- DEMO1 依赖 DEMO2  --> -->
<dependencies>
    <dependency>
        <groupId>com.example</groupId>
        <artifactId>demo2</artifactId>
        <version>${demo.version}</version>
    </dependency>
</dependencies>
```

::: tip 提示
建议在父模块 POM 中 添加 Properties 配置统一的版本号信息，供其他子模块使用
:::

```XML
<!-- Parent pom.xml -->
<properties>
	<java.version>1.8</java.version>
	<demo.version>0.0.1-SNAPSHOT</demo.version>
</properties>
```

