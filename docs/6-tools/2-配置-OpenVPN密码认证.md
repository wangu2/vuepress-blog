# 配置 OpenVPN 密码认证

## 开始安装
**所涉及的文件、目录等信息**
- **安装目录**：```/root/tools```
- **配置目录**：```/root/tools/openvpn-server```
- **证书生成目录**：```/root/tools/openvpn-2.2.2/easy-rsa/2.0/keys```
- **OpenVPN Server IP**：```47.100.XXX.XXX```
- **Server 所需文件**：```aliyun.key、aliyun.csr、aliyun.crt、dh1024.pem、ca.crt```
- **Client 所需文件**：```client.key、client.csr、client.crt、ca.crt```
- **下载地址**：[OpenVPN Server](http://oss.aliyuncs.com/aliyunecs/openvpn-2.2.2.tar.gz)、[OpenVPN Client](https://www.techspot.com/downloads/5182-openvpn.html)、[密码认证脚本](https://dl.t2.re/Others/OpenVPN/checkpsw.sh)
- **用户验证文件**：```psw-file```

## 下载密码认证脚本
进入目录 ```/root/tools/openvpn-server```

``` shell
# 下载认脚本
wget https://dl.t2.re/Others/OpenVPN/checkpsw.sh
```

### 修改脚本配置
```vim /root/tools/openvpn-server/checkpsw.sh```
``` shell
# 用户、密码存放位置
PASSFILE="/root/tools/openvpn-server/psw-file"

# 增加执行权限
chmod +x /root/tools/openvpn-server/checkpsw.sh
```

### 创建密码文件
```vim /root/tools/openvpn-server/psw-file```。用户密码格式为：```username password```，一行一位。
``` shell
# li 为 username, 4040 为 password
li 4040
```
``` shell
# 修改权限
chmod 777 /root/tools/openvpn-server/psw-file
```

::: warning 对于文件的权限赋予很重要
checkpsw.sh、psw-file
:::

## 配置 OpenVPN Server
在 Server.conf 尾部追加代码段，```vim /root/tools/openvpn-server/server.conf```

``` shell
...

# OpenVPN 账号密码认证脚本
auth-user-pass-verify /root/tools/openvpn-server/checkpsw.sh via-env
# 使用客户端提供的用户名作为common name
username-as-common-name
# 脚本运行级别为3，否则无法认证用户名密码
script-security 3
```

## 配置 OpenVPN Client
在客户端 ```.ovpn``` 配置文件中追加
``` shell
...

# 用户认证
auth-user-pass
```

## 进行认证测试
启动 Server: ```/usr/local/sbin/openvpn --config /root/tools/openvpn-server server.conf &```

![img](/img/image-20201023172806.png)

启动 Client 右击连接时，会弹出密码认证的窗口。填写正确的密码即可登录

![img](/img/image-20201023173212.png)
