# 3，SpringBoot整合MQ

在pom文件引入，spring-boot-starter-amqp

```xml
<!-- amqp -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

在application.yml配置RabbitMQ信息

```yml
# rabbitmq, 配置信息
spring:
  rabbitmq:
    # rabbitmq 地址,端口,用户信息
    host: 192.168.1.85
    port: 5672
    username: admin
    password: admin
```

## 以Bean方式注入

创建一个用以配置RabbitMQ Class

```java
@Configuration
public class RabbitmqConfig {

    private static final String ROUTINGKEY = "TESTROUTING";

    /**
     * rabbitmq : queue消息队列生成
     * @return
     */
    @Bean
    public Queue TestQueue(){

        // name: 队列名称
        // durable: 是否持久化默认false,会被存储在磁盘上，当消息代理重启时仍然存在，暂存队列：当前连接有效
        // exclusive: 默认是false，只能被当前创建的连接使用，而且当连接关闭后队列即被删除。此参考优先级高于durable
        // autoDelete: 是否自动删除，当没有生产者或者消费者使用此队列，该队列会自动删除

        return new Queue("TestQueue", true);

    }

    /**
     * rabbitmq : direct交换机
     * @return
     */
    @Bean
    public DirectExchange TestDirectExchange(){

        // name: 交换机名称
        // durable: 是否持久化,默认是true
        // autoDelete: 是否自动删除

        return new DirectExchange("TestDirectExchange", true, false);

    }

    /**
     * rabbitmq : 将队列与交换机进行绑定操作
     * @return
     */
    @Bean
    public Binding bindingDirect(){

        // 1, 绑定队列
        // 2, 绑定交换机
        // 3, 绑定匹配的KEY

        return BindingBuilder.bind(TestQueue())
                .to(TestDirectExchange()).
                        with(ROUTINGKEY);

    }

}
```

