# nap-genuine-docs

To use docker file run the following commands:
docker build -t nap-genuine-docs .
docker run -p 3030:3030 -v ~/napbiotec:/usr/napbiotec -it nap-genuine-docs