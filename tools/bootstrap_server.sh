# INSTALL MONGODB
sudo apt-get install gnupg
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org=5.0.6 mongodb-org-database=5.0.6 mongodb-org-server=5.0.6 mongodb-org-shell=5.0.6 mongodb-org-mongos=5.0.6 mongodb-org-tools=5.0.6

# INSTALL ELASTICSEARCH
curl -fsSL https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list
sudo apt update
sudo apt install elasticsearch

# CONFIGURE
echo "network.host: localhost" >> /etc/elasticsearch/elasticsearch.yml

# INSTALL NODE
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt update
sudo apt install -y nodejs
sudo apt install -y npm
npm i -g pm2

# INSTALL DEPENDENCIES FOR PUPPETEER
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libgbm-dev

# START SERVICES
sudo systemctl start mongod
sudo systemctl enable mongod

sudo systemctl start elasticsearch
sudo systemctl enable elasticsearch

sudo systemctl enable pm2
sudo systemctl start pm2

# CONFIGS
curl -XPUT localhost:9200/items