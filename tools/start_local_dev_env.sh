#!bin/bash

select opt in linux windows; do
    case $opt in
        linux)
            echo "Starting dev env for linux..."
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
            ;;
        windows)
            echo "Starting dev env for windows..."
            ./elasticsearch-7.16.2/bin/elasticsearch.bat
            ;;
        *)
            echo "Invalid option $REPLY"
            ;;
    esac
done