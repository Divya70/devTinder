#DevTinder Apis

POST /signup
POST /login
POST /logout
GET /Profile/view
PATCH /profile/edit
PATCH /profile/password
POST /request/send/interested/:userID
POST /request/send/ignored/:userId

POST /request/review/:status/:requestId

<!-- POST /request/review/rejected/:requestId -->

GET /connections
GET /requests/recieved

Status: ingnore , interested , accepted , rejected
