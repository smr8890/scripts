#!/bin/bash

# 检查是否已经联网，直到成功连接网络
until ping -c 1 -W 1 baidu.com > /dev/null 2>&1; do
    echo "等待网络连接..."
    sleep 5  # 每5秒检查一次
done

# 发送 Server 酱推送
curl -X POST https://sctapi.ftqq.com/<your_SCT_key>.send \
    -H "Content-Type: application/json" \
    -d '{"title": "服务器已重启", "desp": "服务器可能发生了断电重启，请注意检查！"}'