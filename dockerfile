# Use a minimal Node.js image
FROM node:20-alpine

# Enable Yarn v4
RUN corepack enable && corepack prepare yarn@4.2.2 --activate

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and yarn.lock first (optimizes build caching)
COPY package.json yarn.lock /app/
RUN yarn

# Install dependencies in production mode
COPY . /app/
RUN yarn && yarn build
 
# Expose necessary ports
EXPOSE 3000 4001

# Start both Next.js and the Socket.io server
CMD ["yarn", "concurrently", "yarn start", "node server.js"]
