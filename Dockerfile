FROM node:24.13.0
# create app directory
WORKDIR /usr/src/app

# only copy package files first for caching
COPY package*.json ./

RUN npm install --production

# copy remaining sources
COPY . .

# build the project
RUN npm run build

EXPOSE 5050
CMD ["npm", "run", "start"]
