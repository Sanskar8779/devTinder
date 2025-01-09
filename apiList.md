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

- POST /request/send/:status/:userId
- status = ["interested", "ignored"]

- POST /request/review/:status/:requestId
- status = ["accepted", "rejected"]

## user

- GET /user/requests/received
- GET /user/connections
- GET /feed - Gets you the profile of other users
