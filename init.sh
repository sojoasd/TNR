#!/bin/bash

while getopts ":e:l:" opt; do #-e -l 需要参数，-d 不一定需要參數
  case $opt in
    e)
      NAMESPACE=$OPTARG
      echo "$OPTARG"
      ;;
    l)
      LOCAL_TYPE=$OPTARG
      echo "$OPTARG"
      ;;
  esac
done

if [ -z "$LOCAL_TYPE" ]
then 
    echo "local type required" && exit
fi

if [ "$LOCAL_TYPE" == "local" ] || [ "$LOCAL_TYPE" == "cloud" ]
then
    echo "$LOCAL_TYPE match"
else
    echo "local type need match local / cloud" && exit
fi


BASEPATH=$(dirname $0)

if [ "$LOCAL_TYPE" == "local" ]
then 
    NEXOP_PATH="${BASEPATH}/.env"
elif [ "$LOCAL_TYPE" == "cloud" ]
then
    NEXOP_PATH="/opt/jenkins_home/workspace/nex-op/lambda/${NAMESPACE}/env/ccu_gps_lambda_env" # 目前 cloud 沒用到 
fi

echo ${NEXOP_PATH}

source ${NEXOP_PATH}

output=$(PORT=${PORT} PINO_CONFIG=${PINO_CONFIG} MONGO_CONFIG=${MONGO_CONFIG} TOKEN_SIGNATURE=${TOKEN_SIGNATURE} TOKEN_EXP=${TOKEN_EXP} HASH_SECRET=${HASH_SECRET} GOOGLE_API_CONFIG=${GOOGLE_API_CONFIG} GOOGLE_API_SCOPE=${GOOGLE_API_SCOPE} ts-node ./src/utility/envInit.ts);

echo ${output} > env.json

exit 0;