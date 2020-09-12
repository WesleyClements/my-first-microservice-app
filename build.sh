docker build -t wesleyclements/comments ./comments/
docker build -t wesleyclements/event-bus ./event-bus/
docker build -t wesleyclements/moderation ./moderation/
docker build -t wesleyclements/posts ./posts/
docker build -t wesleyclements/query ./query/

docker push wesleyclements/comments
docker push wesleyclements/event-bus
docker push wesleyclements/moderation
docker push wesleyclements/posts
docker push wesleyclements/query

kubectl rollout restart deployments