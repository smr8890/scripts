# 一些脚本。



### 断电重启通知

1.**编写脚本**： 

创建一个脚本 `reboot_notice.sh`，并将其保存到 `/usr/local/bin/` 目录下：

2.**设置脚本自启动**：创建一个 `systemd` 服务文件：

```bash
sudo nano /etc/systemd/system/reboot_notify.service
```

内容如下：

```ini
[Unit]
Description=Reboot Notification Service
After=network.target

[Service]
ExecStart=/usr/local/bin/reboot_notice.sh
Restart=no

[Install]
WantedBy=multi-user.target
```

3.**启用并启动服务**： 执行以下命令来启用服务并让它在重启后运行：

```bash
sudo systemctl daemon-reload
sudo systemctl enable reboot_notify.service
sudo systemctl start reboot_notify.service
```



### 自签证书

**1.生成 CA 证书**

```bash
openssl genrsa -out ca.key 2048 
openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 -out ca.crt -subj "/C=CN/CN=My Root CA/O=MyRootCA" 
```

**2.自签泛域名证书**

将gen.sh放在ca证书相同目录下，并将开头的 DOMAINS 变量修改为你的域名，运行