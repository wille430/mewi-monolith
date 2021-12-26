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

            cd ../
            sudo systemctl start mongodb
            (trap 'kill 0' SIGINT; npx nx serve webapp & npx nx serve api  & ./elasticsearch-7.16.1/bin/elasticsearch )

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