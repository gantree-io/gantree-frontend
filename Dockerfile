
FROM ubuntu:18.04

# Add docker-compose-wait tool
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

# Get packages
RUN apt-get update
RUN apt-get install -y apt-utils curl
RUN apt-get upgrade -y
# setup node source
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
# more packages
RUN apt-get update
RUN apt-get install -y nodejs
# yarn
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn

COPY . /frontend
RUN rm -f /frontend/.env

# These need to be in file because yarn bakes them in
RUN touch /frontend/.env
RUN echo "GRAPHQL_URL=$GRAPHQL_URL" >> /frontend.env
RUN echo "SOCKETIO_URL=$SOCKETIO_URL" >> /frontend.env
RUN echo "MODE=$MODE" >> /frontend.env
RUN echo "FIREBASE_APIKEY=$FIREBASE_APIKEY" >> /frontend.env
RUN echo "FIREBASE_AUTHDOMAIN=$FIREBASE_AUTHDOMAIN" >> /frontend.env
RUN echo "FIREBASE_DATABASEURL=$FIREBASE_DATABASEURL" >> /frontend.env
RUN echo "FIREBASE_PROJECTID=$FIREBASE_PROJECTID" >> /frontend.env
RUN echo "FIREBASE_STORAGEBUCKET=$FIREBASE_STORAGEBUCKET" >> /frontend.env
RUN echo "FIREBASE_MESSAGINGSENDERID=$FIREBASE_MESSAGINGSENDERID" >> /frontend.env
RUN echo "FIREBASE_APPID=$FIREBASE_APPID" >> /frontend.env

# Run
CMD ["yarn", "--cwd", "/frontend", "dev"]
