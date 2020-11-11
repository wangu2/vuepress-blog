# 持久层框架实现及MyBatis源码分析

[[toc]]

## JDBC使用时的思考
   - 配置信息存在硬编码的问题
   - 处理 SQL 语句时，SQL 语句传参存在硬编码
   - 三段式握手频繁创建和释放
   - 手动封装结果较为频繁

### 结论和解决

硬编码问题，数据库操作繁琐，且如果要修改则需要停止重新启动。不利于维护，数据的操作不不持久化。<br>
针对以上的问题可以通过配置文件，数据连接池，反射和内省的方式解决。

> 反射：反射是在运行状态把 JAVA 类的各种成分映射成相对应的类并且可以动态调用强调的是运行状态
>
> 内省：是针对Bean类属性、时间的缺省处理方法(MyBaits中的Vo使用的为内省)


## 自定义持久性框架设计
**准备**：数据库配置信息(JDBC配置) _**SQLMapConfig.xml**_ ，SQL配置信息(Sql语句、参数返回值) _**Mapper.xml**_ ，一个实体对于一个Mapper。<br>
针对以上信息创建 _**Configuration核心配置类**_ ，_**MapperStatement映射配置类**_<br>

**读取**：读取解析 _**SQLMapConfig.xml**_ ，_**Mapper.xml**_ ，加载至对应容器类<br>

**设计**：_**build**_ 类生产容器类用于返回一个 _**SqlSession**_ 会话用以数据库操作，_**SqlSession**_ 类提供CURD基本数据操作函数<br>

**实现**：_**SqlSession**_ 的接口、实现，_**Excute**_ 的接口、实现<br>

## 自定义持久框架核心(使用代理模式动态获取类执行DAO)
   - 创建类 IDAO
   - ISqlSession 添加 getMapper 函数， `<T> getMapper(Class<?> mapperClass)`
   - DefaultSqlSession 中对 getMapper 函数的实现，使用JDK动态代理类 Proxy.newProxyuInstance，代理对象调用接口中的方法都会调用 invoke 方法
   - invoke 三个参数：Proxy - 代理对象应用，method - 调用的方法，args - 调用的参数
   - 重写invoke

## MyBaits的介绍和使用

### 介绍
   - ORM对象关系数据库映射
   - 轻量级框架(可控SQL)
   - 半自动框架
  
### MyBatis的使用
   - MyBaits 在 Maven项目中的引入
   - 创建实体数据表，对应创建实体类
   - 编写实体类 Mapper.xml文件
   - 编写核心文件 SqlMapConfig.xml (Mapper.xml文件在这里引入)



