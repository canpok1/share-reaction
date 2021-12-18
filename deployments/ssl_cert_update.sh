#!/bin/bash
cd $(dirname $0)

domain="remote-audience.ktnet.info"

certbot_cmd=certonly
domain_arg="-d ${domain}"
if [ -e ./letsencrypt/live/${domain}/cert.pem ]; then
  certbot_cmd=renew
  domain_arg=
fi

bef=$(sudo ls -l ./letsencrypt/live/${domain}/)

docker ps

docker run --rm \
    -v $(pwd)/letsencrypt:/etc/letsencrypt \
    -v $(pwd)/letsencrypt/logs:/var/log/letsencrypt \
    -v $(pwd)/www:/var/www \
    certbot/certbot ${certbot_cmd} \
    --webroot \
    -w /var/www \
    --register-unsafely-without-email \
    --non-interactive --agree-tos \
    --force-renewal \
    --renew-by-default \
    ${domain_arg}

aft=`sudo ls -l ./letsencrypt/live/${domain}/`

echo "## before ##"
echo "$bef"
echo "## after ##"
echo "$aft"

docker-compose restart nginx
docker ps
