# 2，RabbitMQ介绍

RabbitMQ采用Erlang语言开发。Erlang在电信领域使用广泛。OTP（Open Telecom Platform）作为Erlang语言的一部分，包含了很多基于Erlang开发的中间件／库／工具，如mnesia／SASL，极大方便了Erlang应用的开发。OTP就类似于Python语言中众多的module，用户借助这些module可以很方便的开发应用。

## AMQP高级消息队列协议

AMQP(Advanced Message Queuing Protocol) 高级消息队列协议。它是应用层协议的一个开放标准，为面向消息的中间件设计，基于此协议的客户端与消息中间件可传递消息，并不受产品、开发语言等条件的限制。

## RabbitMQ优势

- 可靠性(Reliablity): 使用了一些机制来保证可靠性，比如持久化、传输确认、发布确认。
- 灵活的路由(Flexible Routing): 在消息进入队列之前，通过Exchange来路由消息。对于典型的路由功能，Rabbit已经提供了一些内置的Exchange来实现。针对更复杂的路由功能，可以将多个Exchange绑定在一起，也通过插件机制实现自己的Exchange。
- 消息集群(Clustering): 多个RabbitMQ服务器可以组成一个集群，形成一个逻辑Broker。
- 高可用(Highly Avaliable Queues): 队列可以在集群中的机器上进行镜像，使得在部分节点出问题的情况下队列仍然可用。
- 多种协议(Multi-protocol): 支持多种消息队列协议，如STOMP、MQTT等。
- 多种语言客户端(Many Clients): 几乎支持所有常用语言，比如Java、.NET、Ruby等。
- 管理界面(Management UI): 提供了易用的用户界面，使得用户可以监控和管理消息Broker的许多方面。
- 跟踪机制(Tracing): 如果消息异常，RabbitMQ提供了消息的跟踪机制，使用者可以找出发生了什么。
- 插件机制(Plugin System): 提供了许多插件，来从多方面进行扩展，也可以编辑自己的插件。

## RabbitMQ组件

  ![5015984-367dd717d89ae5db.png](/img/5015984-367dd717d89ae5db.png)
  

- Broker：标识消息队列服务器实体.

- Virtual Host：虚拟主机。标识一批交换机、消息队列和相关对象。虚拟主机是共享相同的身份认证和加密环境的独立服务器域。每个vhost本质上就是一个mini版的RabbitMQ服务器，拥有自己的队列、交换器、绑定和权限机制。vhost是AMQP概念的基础，必须在链接时指定，RabbitMQ默认的vhost是 /。

- Exchange：交换器，用来接收生产者发送的消息并将这些消息路由给服务器中的队列。

- Queue：消息队列，用来保存消息直到发送给消费者。它是消息的容器，也是消息的终点。一个消息可投入一个或多个队列。消息一直在队列里面，等待消费者连接到这个队列将其取走。

- Banding：绑定，用于消息队列和交换机之间的关联。一个绑定就是基于路由键将交换机和消息队列连接起来的路由规则，所以可以将交换器理解成一个由绑定构成的路由表。

- Channel：信道，多路复用连接中的一条独立的双向数据流通道。信道是建立在真实的TCP连接内地虚拟链接，AMQP命令都是通过信道发出去的，不管是发布消息、订阅队列还是接收消息，这些动作都是通过信道完成。因为对于操作系统来说，建立和销毁TCP都是非常昂贵的开销，所以引入了信道的概念，以复用一条TCP连接。

- Connection：网络连接，比如一个TCP连接。

- Publisher：消息的生产者，也是一个向交换器发布消息的客户端应用程序。

- Consumer：消息的消费者，表示一个从一个消息队列中取得消息的客户端应用程序。

- Message：消息，消息是不具名的，它是由消息头和消息体组成。消息体是不透明的，而消息头则是由一系列的可选属性组成，这些属性包括routing-key(路由键)、priority(优先级)、delivery-mode(消息可能需要持久性存储[消息的路由模式])等。 

### Exchange交换器的多种类型

- direct : 消息中的路由键(**RoutingKey**)如果和**Binding**中绑定的**binding key**一致，交换器将会将数据发送到路由键与队列名完全匹配的队列中

  ![image-20200803163947614](/img/image-20200803163947614.png)

- fanout : 消息会分发到所有绑定的队列上，fanout是转发消息最快的，类似子网广播的模式

  ![image-20200803164636519](/img/image-20200803164636519.png)

- topic : 路由键属性的匹配模式，它将路由键(routing-key)和绑定键(bingding-key)的字符串切分成单词，这些单词之间用点隔开。

  ![image-20200803165117056](/img/image-20200803165117056.png)