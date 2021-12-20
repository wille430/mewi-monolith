#!bin/bash
cd $(dirname $0)
set -e
cleanup() {
    echo "Stopping mongodb..."
    sudo systemctl stop mongodb
}

echo Starting mongodb service...
sudo systemctl start mongodb
echo starting elasticsearch...
./elasticsearch-7.16.1/bin/elasticsearch

trap cleanup EXIT