FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http=require('http');const url='http://localhost:5000/api/health';const req=http.get(url,(res)=>{const ok=res.statusCode===200;res.resume();res.on('end',()=>process.exit(ok?0:1));});req.setTimeout(2000,()=>{req.destroy();process.exit(1);});req.on('error',()=>process.exit(1));"

# Run development server
CMD ["npm", "run", "dev"]
