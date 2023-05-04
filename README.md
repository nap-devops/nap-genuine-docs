# nap-genuine-docs

To use docker file run the following commands: <br>

1. docker build -t nap-genuine-docs . <br>
2. docker run -p 3030:3030 -v ~/napbiotec:/usr/napbiotec -it nap-genuine-docs

To change language<br>
Add lang=en or lang=th as url parameters ex https://docs.genuine-dev.napbiotec.io/?lang=th <br>

To change theme<br>
Add theme=aldamex or theme=napbiotec as url parameters ex https://docs.genuine-dev.napbiotec.io/?theme=aldamex

To directly download PDF file, using the following link format<br>
https://domain/napbiotec/product/lot-number Ex https://docs.genuine-dev.napbiotec.io/napbiotec/Ginger/A2212002
