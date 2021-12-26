#!bin/bash

select opt in linux windows; do
    case $opt in
        linux)
            echo "Starting dev env for linux..."
            cd $(dirname $0)
            set -e

            cd ../
            sudo systemctl start mongodb
            npx nx serve webapp & npx nx serve api  & ./elasticsearch-7.16.1/bin/elasticsearch

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