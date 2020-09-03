# 1，Windows 上 RabbitMQ安装

RabbitMQ基于AMQP协议，遵循Mozilla Public License开源协议。
采用 Erlang 实现的工业级的消息队列(MQ)服务器，Rabbit MQ 是建立在Erlang OTP平台上。
所以装RabbitMQ服务器必须首先安装 Erlang 运行环境。

**安装Erlang需要先确认当前RabbitMQ所依赖的Erlang版本号**

下载地址

- Erlang：https://www.erlang.org/downloads
- RabbitMQ：https://www.rabbitmq.com/download.html

## 安装Erlang

当前需要安装的RabbitMQ 3.8.5 ，Erlang兼容版本21.3~23.X
下载安装包后配置一下Erlang环境变量即可

![image-20200729110435006](/img/image-20200729110435006.png)

## 安装RabbitMQ

RabbitMQ安装后是作为Windows Service服务在后台运行，安装完毕后查看对应服务列表

![image-20200729110817584](/img/image-20200729110817584.png)

配置环境变量，追加至Path变量内

<img src="/img/image-20200729111106920.png" alt="image-20200729111106920"  />

<img src="/img/image-20200729111336153.png" alt="image-20200729111336153"  />

## 配置RabbitMQ

配置好环境变量后查看MQ插件列表然后进行启用操作

```powershell
C:\Users\Administrator>rabbitmq-plugins list
```

启用 rabbitmq_management 插件(在线管理UI)

```powershell
C:\Users\Administrator>rabbitmq-plugins enable rabbitmq_management

Enabling plugins on node rabbit@WIN-R8A10FS93QJ:
rabbitmq_management
The following plugins have been configured:
  rabbitmq_management
  rabbitmq_management_agent
  rabbitmq_web_dispatch
Applying plugin configuration to rabbit@WIN-R8A10FS93QJ...
The following plugins have been enabled:
  rabbitmq_management
  rabbitmq_management_agent
  rabbitmq_web_dispatch

set 3 plugins.
Offline change; changes will take effect at broker restart.
```

根据提示重启一下RabbitMQ服务，打开浏览器 http://localhost:15672/ ，使用 guest/guest 默认账户进行登录

### RabbitMQ端口配置

在服务器上需要关闭防火墙或配置端口入站规则

4369, 5672, 5671, 25672, 35672-35682, 15672, 61613, 61614, 1883, 8883, 15674, 15675

端口描述查看官网地址进了解: https://www.rabbitmq.com/install-windows.html

![image-20200730111923111](/img/image-20200730111923111.png)

### RabbitMQ数据存储目录

在环境变量中已经配置了RabbitMQ批处理脚本，这边可以直接执行

```shell
// 1, 移除当前服务
rabbitmq-service remove

// 2, 设置数据目录
set RABBITMQ_BASE=D:\RABBITMQ_SERVER\DATA

// 3, 重新服务安装
rabbitmq-service install

// 4, 启动服务
rabbitmq-service start

// 5, 关闭RABBIT节点并重置
rabbitmqctl stop_app
rabbitmqctl reset

// 6, 安装在线管理插件
rabbitmq-plugins enable rabbitmq_management

// 7, 启动节点
rabbitmqctl start_app

// 8, 重启服务
rabbitmq-service stop
rabbitmq-service start

```

### RabbitMQ-Management添加用户

登录控制台地址 http://localhost:15672/ ，选择admin模块

![image-20200730114755059](/img/image-20200730114755059.png)

在 [ Add a user ] 选项卡中填写用户基本信息，填写完毕后在列表中点击刚才添加的用户 test

<img src="/img/image-20200730114918260.png" alt="image-20200730114918260" style="zoom:150%;" />

赋予 test 相关的权限内容

<img src="/img/image-20200730115013417.png" alt="image-20200730115013417" style="zoom:150%;" />

然后重新使用 test 即可进行重新登录

## 过程中遇到的问题

在使用 rabbitmqctl 命令时可能会出现 erlang.cookie 的问题，根据官网中的提示因为账户不一致的情况出现的这个问题。尝试使用一下解决方法，然后重新执行命令

```shell
// 拷贝文件
C:\Windows\system32\config\systemprofile\erlang.cookie

// 移动文件 , administrator为当前系统登录
C:\Users\administrator
```











