#use Node.js base image
FROM node:20


WORKDIR /app


COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
