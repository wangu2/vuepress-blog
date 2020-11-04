# 搭建 OpenVPN

> 目前环境为多台阿里云的 ECS 服务器，系统为 CentOS

## OpenVPN - SSL协议
VPN 直译就是虚拟专用通道，是提供给企业之间或者个人与公司之间安全数据传输的隧道 <br>
[OpenVPN](https://github.com/OpenVPN/easy-rsa) 是一个基于 OpenSSL 库的应用层 VPN 实现。


## 开始安装
**所涉及的文件、目录等信息**
- **安装目录**：```/root/tools```
- **配置目录**：```/root/tools/openvpn-server```
- **证书生成目录**：```/root/tools/openvpn-2.2.2/easy-rsa/2.0/keys```
- **OpenVPN Server IP**：```47.100.XXX.XXX```
- **Server 所需文件**：```aliyun.key、aliyun.csr、aliyun.crt、dh1024.pem、ca.crt```
- **Client 所需文件**：```client.key、client.csr、client.crt、ca.crt```
- **下载地址**：[OpenVPN Server](http://oss.aliyuncs.com/aliyunecs/openvpn-2.2.2.tar.gz)、[OpenVPN Client](https://www.techspot.com/downloads/5182-openvpn.html)、[密码认证脚本](https://dl.t2.re/Others/OpenVPN/checkpsw.sh)

### 安装依赖
```shell
yum install -y lzo lzo-devel openssl openssl-devel pam pam-devel
yum install -y pkcs11-helper pkcs11-helper-devel
rpm -qa lzolzo-devel openssl openssl-devel pam pam-devel pkcs11-helper pkcs11-helper-devel
```

### 下载
```shell
cd /root/tools
wget http://oss.aliyuncs.com/aliyunecs/openvpn-2.2.2.tar.gz
tar -zxvf openvpn-2.2.2.tar.gz
```

### 编译、安装
```shell
cd openvpn-2.2.2
./configure                     # 配置
make && make install            # 编译、安装
echo $?                         # 0表示没有错误
```

### 配置 [PKI](https://baike.baidu.com/item/%E5%85%AC%E9%92%A5%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD/10881894?fromtitle=PKI&fromid=212376&fr=aladdin) 信息
```shell
# 进入目录
cd easy-rsa/2.0/
# 备份原文件
cp vars vars_$(date +%F)~
# 编辑下列字段
vim vars

export KEY_COUNTRY="CN"                 # 所在的国家
export KEY_PROVINCE="JIANGSU"           # 所在的省份      
export KEY_CITY="NANJING"               # 所在的城市
export KEY_ORG="EVNBASE"                # 所在的组织
export KEY_EMAIL="ENVBASE@126.com"      # 邮箱的地址
```

## 生成与配置证书
### 重载&清除所有证书
```shell
source ./vars
./clean-all
```

### 生成证书 CA 证书
```shell    
./build-ca
```
完成后，keys 目录下会生成 ```ca.crt``` 文件

### 生成 Server 所需的秘钥、证书
其中 aliyun 是自定义的名字，连续回车确认，最后会有两次交互，输入y确认。
```shell
./build-key-server aliyun
```
完成后，keys 目录下会生成 **```aliyun.key、aliyun.csr、aliyun.crt```** 文件

### 生成 Client 所需的秘钥、证书
执行以下命令创建秘钥与证书，其中 client 是用户名，连续回车确认，最后会有两次交互，输入y确认。 <br>
完成后，keys 目录下会生成 1024 位 RSA 服务器密钥 **```client.key、client.csr、client.crt```** 文件

```shell
./build-key client
```

执行以下命令，生成用于客户端验证的 Diffie Hellman参数，完成后，keys 目录下会生成 dh 参数文件 **```dh1024.pem```**

```shell
./build-dh
```

### 复制证书、密钥和参数文件
创建配置目录 ```mkdir /root/tools/openvpn-server```

```shell
# 复制证书至配置目录
cp -a /root/tools/openvpn-2.2.2/easy-rsa/2.0/keys/  /root/tools/openvpn-server/

# 进入 openvpn 示例代码目录
cd /root/tools/openvpn-2.2.2/sample-config-files/
# 复制 server.conf、client.conf 至配置目录
cp server.conf client.conf /root/tools/openvpn-server/
```

## 配置 OpenVPN - Server.conf
切换目录至 ```/root/tools/openvpn-server/```
```shell
# 备份原文件
cp server.conf server.conf_$(date +%F)
# 开始编辑
vim server.conf

local 0.0.0.0
port 1194                                           # 端口
proto udp                                           # 协议
dev tun                                             # 采用路由隧道模式 tun
ca /root/tools/openvpn-server/keys/ca.crt           # ca 证书文件位置
cert /root/tools/openvpn-serverkeys/aliyun.crt      # 服务端公钥名称
key /root/tools/openvpn-serverkeys/aliyun.key       # 服务端私钥名称
dh /root/tools/openvpn-serverkeys/dh1024.pem        # 交换证书
server 10.8.0.0 255.255.255.0                       # 给客户端分配地址池，注意：不能和VPN服务器内网网段有相同
push "route 172.19.0.0 255.255.255.0"               # 允许客户端访问内网 172.19.0.0 网段
ifconfig-pool-persist ipp.txt                       # 地址池记录文件位置
keepalive 10 120                                    # 存活时间，10秒ping一次,120 如未收到响应则视为断线
max-clients 100                                     # 最多允许100个客户端连接
status openvpn-status.log                           # 日志记录位置
verb 3                                              # OpenVPN 版本
client-to-client                                    # 客户端与客户端之间支持通信
log /var/log/openvpn.log                            # OpenVPN 日志记录位置
persist-key                                         # 通过 keepalive 检测超时后，重新启动 VPN，不重新读取 keys，保留第一次使用的 keys。
persist-tun                                         # 检测超时后，重新启动VPN，一直保持 tun 是 linkup 的。否则网络会先 linkdown 然后再linkup
duplicate-cn
```

## 配置 iptables
### 配置 iptables 前，确保 iptables 已经开启否则无效
```shell
yum install -y iptables-services        # 安装 iptables-service

systemctl enable iptables               # iptables 启用
iptables -F                             # iptables 清除规则 
service iptables save                   # iptables 保存
service iptables restart                # iptables 重启

systemctl list-unit-files | grep iptables
```

### 清除 iptables 规则
```shell
iptables -F                     # 清除规则链中已有的条目
iptables -X                     # 清除预设表filter中使用者自定链中的规则
iptables -Z                     # 清空规则链中的数据包计算器和字节计数器

iptables -t nat -F              # 清除 nat 
iptables -t nat -X
iptables -t nat -Z

iptables -t mangle -F           # 清除 mangle
iptables -t mangle -X
iptables -t mangle -Z

iptables -P INPUT ACCEPT        # 接收处理数据数据包
iptables -P OUTPUT ACCEPT       # 接收处理输出数据包
iptables -P FORWARD ACCEPT      # 接收处理转发数据包
```

### 添加 iptables 规则 
#### 熟悉 iptables
iptables 命令输入顺序
> iptables -t 表名 <-A/I/D/R> 规则链名 [规则号] <-i/o 网卡名> -p 协议名 <-s 源IP/源子网> --sport 源端口 <-d 目标IP/目标子网> --dport 目标端口 -j 动作

::: tip 表名包括：
- raw：高级功能，如：网址过滤。
- mangle：数据包修改（QOS），用于实现服务质量。
- net：地址转换，用于网关路由器。
- filter：包过滤，用于防火墙规则。
:::

::: tip 规则链名包括：
  - INPUT链：处理输入数据包。
  - OUTPUT链：处理输出数据包。
  - PORWARD链：处理转发数据包。
  - PREROUTING链：用于目标地址转换（DNAT）。
  - POSTOUTING链：用于源地址转换（SNAT）。
:::

::: tip 动作包括：
  - accept：接收数据包。
  - DROP：丢弃数据包。
  - REDIRECT：重定向、映射、透明代理。
  - SNAT：源地址转换。
  - DNAT：目标地址转换。
  - MASQUERADE：IP伪装（NAT），用于ADSL。
  - LOG：日志记录。
:::

#### OpenVPN 使用
这里我们使用到的命令如下

```shell
# 配置nat表将vpn网段IP转发到server内网，这很重要
iptables -t nat -I POSTROUTING -s 10.8.0.0/24 -o eth0 -j SNAT --to-source 172.19.89.134

# 查看列表
iptables -L -n -t nat

# 服务器重启以应用
service iptables restart
```
::: warning 重要: 防火墙一定要开启后再进行上述配置操作
**10.8.0.0/24 为VPN分配的网段** <br/>
**172.19.89.134 为当前 OpenVPN Server 安装的服务器 172.19 地址地址私有 ip**
:::

### 开启内部 IPv4 路由转发
作为路由或者 VPN 服务就必须要开启IP转发功能

```shell
vim /etc/sysctl.conf

net.ipv4.ip_forward = 1     # 1开启，0不开
sysctl -p                   # 使配置立即生效
```

## 启动 OpenVPN Server
```shell
# 选择配置文件并以后台方式运行
/usr/local/sbin/openvpn --config /root/tools/openvpn-server/server.conf &

# 查看状态
ps -ef | grep openvpn
```

## 启动 OpenVPN Client

Windows 环境，首先下载客户端 [OpenVPN Client](https://www.techspot.com/downloads/5182-openvpn.html)。<br/>

1. 将服务器 ```/root/tools/openvpn-server``` 目录下的 ```client.key、client.csr、client.crt、ca.crt``` <br/>
2. 下载(FTP)到 ```F:\Tools\OpenVPN``` (我本地安装目录) <br/>
3. 创建 ```client.ovpn``` 文件，配置如下（修改 IP & cert & key 名称）


```shell
client                              # 声明当前VPN是客户端
dev tun                             # 使用tun隧道传输协议
proto udp                           # 使用udp协议传输数据
remote 47.100.XXX.XXX 1194          # -- OpenVPN Server 所安装服务器 IP 地址与端口 (47.100.XXX.XXX)
resolv-retry infinite               # 断线自动重新连接，在网络不稳定的情况下非常有用
nobind                              # 不绑定本地特定的端口号
persist-key                         # 通过 keepalive 检测超时后，重新启动 VPN，不重新读取 keys，保留第一次使用的 keys。
persist-tun                         # 检测超时后，重新启动VPN，一直保持 tun 是 linkup 的。否则网络会先 linkdown 然后再linkup
ca ca.crt                           # -- OpenVPN Server 服务器上拷贝下 ca.crt 文件
cert mike.crt                       # -- OpenVPN Server 服务器上拷贝下 client.crt 文件
key mike.key                        # -- OpenVPN Server 服务器上拷贝下 client.key 文件
comp-lzo                            # 使用LZO压缩
verb 2                              # OpenVPN 版本
```

4. 右击 Client 小锁菜单选择导入配置文件，选择上面创建的 ```client.ovpn```
5. 右击选择连接，此时 OpenVPN 会分配一个 ```10.8.0.0``` 网段的 IP 地址给本机。使用 ```ipconfig``` 进行查看

> 小图标绿了，就代表他已经连接至 OpenVPN Server ( :alien: : 怎么就绿了 )

``` SHELL
未知适配器 本地连接:

   连接特定的 DNS 后缀 . . . . . . . :
   本地链接 IPv6 地址. . . . . . . . : fe80::4d4d:2ef7:3199:a610%26
   IPv4 地址 . . . . . . . . . . . . : 10.8.0.6
   子网掩码  . . . . . . . . . . . . : 255.255.255.252
   默认网关. . . . . . . . . . . . . :
```
6. 使用命令 ```route print``` 查看路由列表
``` shell
===========================================================================
接口列表
 26...00 ff 79 47 e2 e8 ......TAP-Windows Adapter V9
 12...6c 4b 90 54 ca 19 ......Realtek PCIe GBE Family Controller
  8...00 1a 7d da 71 11 ......Bluetooth Device (Personal Area Network) #2
  1...........................Software Loopback Interface 1
===========================================================================

IPv4 路由表
===========================================================================
活动路由:
网络目标        网络掩码          网关       接口   跃点数
          0.0.0.0          0.0.0.0      192.168.1.1    192.168.1.152     35
          0.0.0.0        128.0.0.0         10.8.0.5         10.8.0.6    281
         10.8.0.0    255.255.255.0         10.8.0.5         10.8.0.6    281
         10.8.0.4  255.255.255.252            在链路上          10.8.0.6    281
         10.8.0.6  255.255.255.255            在链路上          10.8.0.6    281
         10.8.0.7  255.255.255.255            在链路上          10.8.0.6    281
   47.100.160.158  255.255.255.255      192.168.1.1    192.168.1.152    291
        127.0.0.0        255.0.0.0            在链路上         127.0.0.1    331
        127.0.0.1  255.255.255.255            在链路上         127.0.0.1    331
  127.255.255.255  255.255.255.255            在链路上         127.0.0.1    331
        128.0.0.0        128.0.0.0         10.8.0.5         10.8.0.6    281
       172.19.0.0    255.255.255.0         10.8.0.5         10.8.0.6    281
      192.168.1.0    255.255.255.0            在链路上     192.168.1.152    291
    192.168.1.152  255.255.255.255            在链路上     192.168.1.152    291
    192.168.1.255  255.255.255.255            在链路上     192.168.1.152    291
        224.0.0.0        240.0.0.0            在链路上         127.0.0.1    331
        224.0.0.0        240.0.0.0            在链路上     192.168.1.152    291
        224.0.0.0        240.0.0.0            在链路上          10.8.0.6    281
  255.255.255.255  255.255.255.255            在链路上         127.0.0.1    331
  255.255.255.255  255.255.255.255            在链路上     192.168.1.152    291
  255.255.255.255  255.255.255.255            在链路上          10.8.0.6    281
===========================================================================
```
列表中 ```172.19.0.0    255.255.255.0         10.8.0.5         10.8.0.6    281```，已加入 OpenVPN Server 配置的网段内。

### 查看网络状态
**使用网络追踪命令 tracert，查看网络状态**

在 OpenVPN 连接状态下，追踪一下 ```172.19.89.132``` ( 此 IP 为 OpenVPN Server 所在子网里另外一台机器 )

```shell
> tracert -d 172.19.89.132

通过最多 30 个跃点跟踪到 172.19.89.132 的路由

  1    13 ms    12 ms    12 ms  172.19.89.132

跟踪完成。
```
以上状态为正常状态，也可以使用另外 ```ping``` 的指令来进行查看网络状态

也可以简单粗暴直接访问 [ip.cn](https://ip.cn/) ，地区显示为阿里云，ip 为 OpenVPN Server 所在服务器 ip

> tracert 或 ping 一直超时则代表有问题 :thinking:
> 
> 我在安装时遇到这个问题，是因为防火墙未开启内部路由无法转发造成的。( 如何开启参考上述章节即可 )
