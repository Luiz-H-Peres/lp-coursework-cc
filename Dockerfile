FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .
RUN npm rebuild bcrypt --build-from-source


# Expose the application port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
