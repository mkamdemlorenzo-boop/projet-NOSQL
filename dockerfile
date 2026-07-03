FROM node:26-slim

RUN adduser Game
USER Game

WORKDIR /app

COPY --chown=Game:Game ./app .
ENV PORT=8080
CMD ["node", "node.js"]