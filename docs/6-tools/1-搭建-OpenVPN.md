# Aliyun CenterOS 搭建 OpenVPN

::: tip 主要目的
多台阿里云的 ECS 服务器，当前系统被攻击的频次较多，且还会出现数据库密码被修改的情况。 <br>
使用 OpenVPN 想要避免此类问题的出现，更重要也是为了后期服务器分类。
:::

## OpenVPN - SSL协议
VPN 直译就是虚拟专用通道，是提供给企业之间或者个人与公司之间安全数据传输的隧道 <br>
[OpenVPN](https://github.com/OpenVPN/easy-rsa) 是一个基于 OpenSSL 库的应用层 VPN 实现。


## 开始安装
**所涉及的文件、目录等信息**
- **安装目录**：```/root/tools```
- **配置目录**：```/root/tools/openvpn-server```
- **证书生成目录**：```/root/tools/openvpn-2.2.2/easy-rsa/2.0/keys```
- **Server 所需文件**：```aliyun.key、aliyun.csr、aliyun.crt、dh1024.pem、ca.crt```
- **Client 所需文件**：```client.key、client.csr、client.crt、dh1024.pem```

### 下载
```shell
cd /root/tools
wget http://oss.aliyuncs.com/aliyunecs/openvpn-2.2.2.tar.gz
tar -zxvf openvpn-2.2.2.tar.gz
```

### 编译、安装`
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

### 安装依赖
```shell
yum install -y lzo lzo-devel openssl openssl-devel pam pam-devel
yum install -y pkcs11-helper pkcs11-helper-devel
rpm -qa lzolzo-devel openssl openssl-devel pam pam-devel pkcs11-helper pkcs11-helper-devel
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
```shell
# 备份原文件
cp server.conf server.conf_$(date +%F)
# 开始编辑
vim server.conf

local 0.0.0.0
port 1194                                           # 端口
proto udp                                           # 协议
dev tun                                             # 采用路由隧道模式tun
ca /root/tools/openvpn-server/keys/ca.crt           # ca证书文件位置
cert /root/tools/openvpn-serverkeys/aliyun.crt      # 服务端公钥名称
key /root/tools/openvpn-serverkeys/aliyun.key       # 服务端私钥名称
dh /root/tools/openvpn-serverkeys/dh1024.pem        # 交换证书
server 10.8.0.0 255.255.255.0                       # 给客户端分配地址池，注意：不能和VPN服务器内网网段有相同
push "route 172.19.0.0 255.255.255.0"               # 允许客户端访问内网172.19.0.0网段
ifconfig-pool-persist ipp.txt                       # 地址池记录文件位置
keepalive 10 120                                    # 存活时间，10秒ping一次,120 如未收到响应则视为断线
max-clients 100                                     # 最多允许100个客户端连接
status openvpn-status.log                           # 日志记录位置
verb 3                                              # openvpn版本
client-to-client                                    # 客户端与客户端之间支持通信
log /var/log/openvpn.log                            # openvpn日志记录位置
persist-key                                         # 通过keepalive检测超时后，重新启动VPN，不重新读取keys，保留第一次使用的keys。
persist-tun                                         # 检测超时后，重新启动VPN，一直保持tun是linkup的。否则网络会先linkdown然后再linkup
duplicate-cn
```

## 配置 iptables
### 配置 iptables 前，请确保 iptables 已经开启

```shell
yum install iptables-services

systemctl status iptables
systemctl list-unit-files | grep iptables
```

### 清除 iptables 规则
```shell
iptables -F
iptables -X
iptables -Z

iptables -t nat -F
iptables -t nat -X
iptables -t nat -Z

iptables -t mangle -F
iptables -t mangle -X
iptables -t mangle -Z

iptables -P INPUT ACCEPT
iptables -P OUTPUT ACCEPT
iptables -P FORWARD ACCEPT
```

### 添加 iptables 规则 
```shell
# openvpn
iptables -t nat -I POSTROUTING -s 10.8.0.0/24 -o eth0 -j SNAT --to-source 172.19.89.134

# 重启
iptables -L -n -t nat
```
::: warning 重要
**10.8.0.0/24 为VPN分配的网段** <br/>
**172.16.189.224 为当前 OpenVPN Server 安装的服务器地址**
:::


### 开启内部 IPv4 路由转发
作为路由或者VPN服务就必须要开启IP转发功能

```shell
vim /etc/sysctl.conf

net.ipv4.ip_forward = 1     # 1开启，0不开
sysctl -p                   # 使配置立即生效
```

## 启动 OpenVPN Server
```shell
# 选择配置文件并以后台方式运行
/usr/local/sbin/openvpn --config /root/tools/openvpn-server server.conf &

# 查看状态
ps -ef | grep openvpn
```

### 添加开机自启动
```shell
vim /etc/rc.local 
#openvpn iptables
/etc/firewall.sh
```

## 启动 OpenVPN Client
服务器/etc/openvpn/目录下的ca.crt、mike.key、mike.crt、mike.csr下载到D:\Program Files (x86)\OpenVPN\config
D:\Program Files (x86)\OpenVPN\config目录下，创建mike.ovpn文件，配置如下（修改IP&cert&key名称）

```shell
client
dev tun
proto udp
remote 11.11.11.11 1194
resolv-retry infinite
nobind
persist-key
persist-tun
ca ca.crt
cert mike.crt
key mike.key
comp-lzo
verb 3
```