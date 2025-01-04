# devTinder APIs

## authApi

- POST /signup
- POST /login
- POST /logout

## profileApi

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## conenctionRequestApi

- POST /request/send/ignored/:userId
- POST /request/send/interested/:userId
- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId

## user

- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you the profile of other users
