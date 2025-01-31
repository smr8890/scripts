#!/bin/bash

# 设定域名列表和证书名称
DOMAINS="example.com www.example.com"
CERTNAME="mycert"

# 提取主域名
main_domain=$(echo $DOMAINS | awk '{print $1}')

# 生成 subjectAltName 列表
altname=""
for domain in $DOMAINS; do
    altname="${altname}DNS:${domain}, DNS:*.${domain}, "
done
altname=$(echo "$altname" | sed 's/, $//')

# 生成私钥和 CSR 文件
openssl genrsa -out "${CERTNAME}.key" 2048
openssl req -new -sha256 -key "${CERTNAME}.key" -out "${CERTNAME}.csr" \
    -subj "/C=CN/L=Guangzhou/O=MyCert, Ltd/OU=IT Dept./CN=*.${main_domain}"

# 生成 extFile.txt
cat >extFile.txt <<EOF
basicConstraints=CA:FALSE
keyUsage=digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage=serverAuth
subjectAltName=${altname}
EOF

# 签发证书
openssl x509 -req -extfile "extFile.txt" -days 1825 -sha256 \
    -in "${CERTNAME}.csr" -CA "ca.crt" -CAkey "ca.key" \
    -CAcreateserial -out "${CERTNAME}.crt"

# 清理临时文件
rm extFile.txt
