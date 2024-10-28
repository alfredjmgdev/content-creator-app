FROM node:18

WORKDIR /app

# Install required tools
RUN apt-get update && apt-get install -y netcat-traditional dos2unix

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Copy and prepare the wait-and-seed script
COPY wait-and-seed.sh .
RUN chmod +x wait-and-seed.sh
RUN dos2unix wait-and-seed.sh

# Verify the seed script exists and is executable
RUN ls -la wait-and-seed.sh

EXPOSE 3000

# Set Node options for increased memory
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Use shell to run the script with debugging
CMD ["/bin/sh", "-x", "./wait-and-seed.sh"]
