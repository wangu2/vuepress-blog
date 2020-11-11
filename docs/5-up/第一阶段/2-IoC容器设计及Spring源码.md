# IoC容器设计及Spring源码

[[toc]]

## Spring 基础概述
Spring 开源分层，轻量级开源框架，以 IoC、AOP 为内核。提供了展现层 SpringMVC 和业务层事务管理等总舵的企业级应用技术。

## Spring 优势
1. 方便解耦，简化开发
2. AOP编程支持
3. 声明式事务
4. 方便程序测试
5. 集成其他框架
6. 降低 JavaEE API 使用难度
7. 源码设计巧妙、结构清晰

## Spring 核心思想
### IoC：Inversion of Control  控制反转
IoC 控制反转，技术思想 Spring 对 Ioc 非常好的实现。控制是指对象的创建以及管理、反转是指将控制器交由 IoC。在 Spring IoC容器中不用自己去管理对象，在使用的时候IoC会帮我们去实例化它并且管理，不用考虑对象的创建和管理。

举例 ClassA 依赖 ClassB，在非 IoC 容器情况下 ClassA 依赖 ClassB，实例化 ClassA 的同时也会在 ClassA 内部创建 ClassB。
IoC 容器可以看做是一个Map集合，在初始化时会实例化 ClassA，ClassB 并且存储起来。因为 ClassA 依赖 ClassB，也会將 ClassB 注入至 ClassA 当中。使用到的对象都会从 IoC 容器中获取，解决了Class 之间耦合的关系。

### IoC 解决的问题
Ioc 解决对象之间的耦合问题，配合面向接口开发增强项目的可扩展性（那是真的香

### IoC（控制反转）和DI（依赖注入）的区别
DI：Dependancy Injection 依赖注入，IoC 和 DI 做的其实是同一件事情（对象实例化、依赖关系维护）只是角度不同。IoC 是站在对象角度，对象实例化和管理的权利交给了容器，由容器来进行依赖关系的管理。DI是站在容器的角度，在实例化对象的时候容器会把对象所要依赖的其他对象注入到当前对象内。

### AOP：Aspect oriented Programming 面向切面编程
AOP 是 OOP 的延续，OOP 三大特征：封装、继承、多态。OOP 思想是一种垂直继承体系，可以解决多数代码重复的问题。但是有一些情况是处理不了的。

在多个方法的相同位置出现了重复的代码被称为横切逻辑代码，常见的体现是在事务的控制、权限效验、日志打印。横切代码重复且与业务逻辑代码耦合在一起，不便于维护。AOP在不改变原有业务逻辑的情况下，把横切逻辑代码应用到业务逻辑中的。

### AOP 解决的问题
不改变业务逻辑的情况下，增强横切逻辑代码。根本上是解耦合避免横切逻辑代码的重复。

## IoC 高级应用
BeanFactory(IoC容器) 通过反射技术加载beans.xml配置文件，而 beans.xml 中描述了要实例化对象并维护对象之间的依赖关系。IoC 所需 beans 配置文件定义方式如下：

1. XML方式（bean信息定义全部配置在beans.xml中）
2. 注解方式（@bean，所有的bean都用注解来定义）
3. XML+注解方式（部分bean定义在XML，部分bean使用注解定义）

### XML方式，XML+注解方式根据项目情况使用以下容器启动方式：
- JavaSE应用：IoC容器通过ApplicationContext接口启动（加载beans.xml）
  ```java
  ApplicationContext applicationContext = new ClassPathXmlApplicationContext("beans.xml")
  ApplicationContext applicationContext = new FileSystemXmlApplicationContext("C:\\beans.xml")
  ```
- JavaWeb应用：IoC 容器通过ContextLoaderListener（监听器加载xml）

### 纯注解模式
- JavaSE应用：IoC 容器通过 ApplicationContext 接口启动（加载注解配置Class）
  ```java
  ApplicationContext applicationContext = new AnnotationConfigApplicationContext(XX.Class)
  ```
- JavaWeb应用：ContextLoaderListener（监听器加载注解配置类）

### BeanFactory与ApplicationContext区别
- Beanfactory 为 SpreingIoC 的基础容器，ApplicationContext 是容器的高级接口。
- BeanFactory 是 Spring 框架中 IoC 容器的顶级接口，用以定义基础功能、规范。
- ApplicationContext 是 BeanFactory 的其中的一个子接口，所以拥有BeanFactory全部功能。
- BeanFactory 是 Spring 的基础设施，面向Spring框架本身；ApplicationContext 面向 Spring 框架开发者，几乎所有的应用场合都可以直接使用 ApplicationContext 。

![](https://pic1.zhimg.com/v2-1006341abadfd3466b5b4587f349ab27_r.jpg?source=1940ef5c)

### IoC启动方式
#### Java环境启动IoC容器
- ClassPathXmlApplicationContext：从类的根路基下加载配置文件
- FileSystemXmlApplicationContext：磁盘绝对路径加载配置文件
- AnnotationConfigApplicationContext：纯注解模式下启动Spring容器

#### Web环境下启动IoC容器
- 首先要引入Spring的web功能
  ```xml
  <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-web</artifactId>
      <version>5.1.12.RELEASE</version>
  </dependency>
  ```

- XML方式启动
  ```xml
  <!DOCTYPE web-app PUBLIC
  	"-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
  	"http://java.sun.com/dtd/web-app_2_3.dtd" >
  <web-app>
      <display-name>Archetype Created Web Application</display-name>
      <!--配置Spring ioc容器的配置⽂件-->
      <context-param>
          <param-name>contextConfigLocation</param-name>
          <param-value>classpath:applicationContext.xml</param-value>
      </context-param>
      <!--使⽤监听器启动Spring的IOC容器-->
      <listener>
      	<listenerclass>org.springframework.web.context.ContextLoaderListener</listenerclass>
      </listener>
  </web-app> 
  ```

- 配置类启动
  ```xml
  <!DOCTYPE web-app PUBLIC
  "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
  "http://java.sun.com/dtd/web-app_2_3.dtd" >
  <web-app>
      <display-name>Archetype Created Web Application</display-name>
      <!--告诉ContextloaderListener知道我们使⽤注解的⽅式启动ioc容器-->
      <context-param>
          <param-name>contextClass</param-name>
          <param-value>org.springframework.web.context.support.AnnotationConfigWebApplicationContext</param-value>
      </context-param>
      <!--配置启动类的全限定类名-->
      <context-param>
          <param-name>contextConfigLocation</param-name>
          <param-value>com.lagou.edu.SpringConfig</param-value>
      </context-param>
      <!--使⽤监听器启动Spring的IOC容器-->
      <listener>
     		<listenerclass>org.springframework.web.context.ContextLoaderListener</listenerclass>
      </listener>
  </web-app>
  ```

#### XML模式
