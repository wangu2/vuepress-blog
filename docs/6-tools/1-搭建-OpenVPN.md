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
- **安装目录**：```/root/tools``` <br/>
- **证书生成目录**：```/root/tools/openvpn-2.2.2/easy-rsa/2.0/keys``` <br/>

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

进入cd easy-rsa/2.0/目录，修改 vars 证书环境文件
```shell
# 进入目录
cd easy-rsa/2.0/
# 备份原文件
cp vars vars_$(date +%F)
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

### 生成 Server 证书
其中 aliyun 是自定义的名字，连续回车确认，最后会有两次交互，输入y确认。
```shell
./build-key-server aliyun
 
Sign the certificate? [y/n]:y
1 out of 1 certificate requests certified, commit? [y]
```
完成后，keys 目录下会生成 **```aliyun.key、aliyun.csr、aliyun.crt```** 三个文件

### 生成客户端所需的秘钥、证书
执行以下命令创建秘钥与证书，其中 client 是用户名，连续回车确认，最后会有两次交互，输入y确认。 <br>
完成后，keys 目录下会生成 1024 位 RSA 服务器密钥 **```client.key、client.crt、client.csr```** 三个文件

```shell
./build-key client
```

执行以下命令，生成用于客户端验证的 Diffie Hellman参数，完成后，keys 目录下会生成 dh 参数文件 **```dh1024.pem```**

```shell
./build-dh
```

### 复制证书、密钥和参数文件

```shell
mkdir /etc/openvpn
cp -a /root/tools/openvpn-2.2.2/easy-rsa/2.0/keys/  /etc/openvpn/
cd /root/tools/openvpn-2.2.2/sample-config-files/
cp server.conf client.conf /etc/openvpn/
cd /etc/openvpn
```

## 配置 OpenVPN - Server.conf

```shell
cp server.conf server.conf_$(date +%F)
[root@zabbix openvpn]# vim server.conf
local 0.0.0.0
port 1194
proto udp
dev tun
ca /etc/openvpn/keys/ca.crt
cert /etc/openvpn/keys/aliyun.crt
key /etc/openvpn/keys/aliyun.key
dh /etc/openvpn/keys/dh1024.pem
server 10.8.0.0 255.255.255.0
ifconfig-pool-persist ipp.txt
keepalive 10 120
comp-lzo
persist-key
persist-tun
status openvpn-status.log
verb 3
push "route 172.16.0.0 255.255.0.0"
push "dhcp-option DNS 192.168.0.220"
push "dhcp-option DNS 192.168.0.222"
client-to-client
log /var/log/openvpn.log
```

## 配置 iptables
### 配置 iptables前，请确保 iptables 已经开启

```shell
yum install iptables-services

systemctl status iptables
systemctl list-unit-files|grep iptables
```

### 添加iptables 规则
```shell
[root@zabbix openvpn]# vim /etc/firewall.sh
#!/bin/bash
#this is a firewall scripts
#Clear all the rules
iptables -F
iptables -X
iptables -Z
iptables -t nat -F
iptables -t nat -X
iptables -t nat -Z
iptables -t mangle -F
iptables -t mangle -X
iptables -t mangle -Z
 
#The definition of default rules
#iptables -P INPUT DROP
iptables -P INPUT ACCEPT
iptables -P OUTPUT ACCEPT
iptables -P FORWARD ACCEPT
 
#openvpn
iptables -t nat -I POSTROUTING -s 10.8.0.0/24 -o eth0 -j SNAT --to-source 172.16.189.224
chmod +x /etc/firewall.sh
sh /etc/firewall.sh
iptables -L -n -t nat
```

### 开启内部 IPv4 路由转发
```shell
vi /etc/sysctl.conf
net.ipv4.ip_forward = 1
sysctl -p
```

## 启动 OpenVPN Server
```shell
/usr/local/sbin/openvpn --config /etc/openvpn/server.conf &
ps -ef|grep openvpn
```

### 添加开机自启动
```shell
[root@zabbix openvpn]# vim /etc/rc.local 
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