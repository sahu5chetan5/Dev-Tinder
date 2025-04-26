# DEVTinder API's

## authRouter
- POST /signUp
- POST /logIn
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter
- GET /user/connections
- GET /requests/received
- GET /feed - gets you the profiles of other users on platform


status : Ignore, Interested, accepted, rejected
