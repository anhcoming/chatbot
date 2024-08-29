FROM node:18.16.0 as builder

##COPY . .
##RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
#RUN npm i -f && 

##RUN cp -R ./node_modules

WORKDIR /ng-app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
##RUN npm run build


### STAGE 2: Setup ###

FROM nginx:alpine

## Copy our default nginx config
COPY nginx.conf /etc/nginx/nginx.conf

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist /usr/share/nginx/html
COPY --from=builder /ng-app/dist/digipro-web-cms /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80
