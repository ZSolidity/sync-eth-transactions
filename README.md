# sync-eth-transactions
sync-transactions for Ethereum block

- Create mongodb user
db.createUser({user:"koube_test",pwd:"koube_test",roles:[{role:'readWrite',db:'koube-nft'}]})

- Remote access
mongo 127.0.0.1:27017/koube-nft -u koube_test -p koube_test

- mongod.conf 
/etc/mongod.conf (ubuntu)
/opt/homebrew/etc/mongod.conf (mac m1)

net:
  port: 27017
  bindIp: 0.0.0.0
security:
  authorization: 'enabled'
  
- check 27017 port
netstat -an | grep 27017

- service start
brew services start mongodb-community