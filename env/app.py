openapi: "3.0.2"
info:
  title: "Sportlink API"
  version: "1.0"

paths:
  /update_games:
    post:
      operationId: app.gamesUpdate
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                skill:
                  type: integer
                maxPlayers:
                  type: integer
                sport:
                  type: string
                gameID:
                  type: integer
                location:
                  type: string


      responses:
        '200':
          description: "Success!"
  # account creation endpoints
  /create_account:
    post:
      operationId: app.create_account
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                password:
                  type: string
                friends:
                  type: array
                  default: []
                  items:
                    type: string
      responses:
        "201":
          description: User created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  username:
                    type: string
        "401":
          description: Email already has an account!

  /google_signin:
    post:
      operationId: app.google_signin
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                googleId:
                  type: string
                firstName:
                  type: string
                lastName:
                  type: string
      responses:
        "201":
          description: Google User Account Created
          content:
            application/json:
              schema:
                type: object
                properties:
                  username:
                    type: string
        "200":
          description: Google User Login
          content:
            application/json:
              schema:
                type: object
                properties:
                  username:
                    type: string
                  city:
                    type: string
                  phoneNumber:
                    type: string
                  age:
                    type: integer
                  state:
                    type: string
                  gender:
                    type: string
                  country:
                    type: string
                  address:
                    type: string
                  zipCode:
                    type: string
                  birthday:
                    type: string
                  displayAge:
                    type: boolean
                    description: "Toggle age visibility"
                  displayLocation:
                    type: boolean
                    description: "Toggle location visibility"
                  accountPrivacy:
                    type: boolean
                    description: "Toggle account privacy"
                  displayPhoneNumber:
                    type: string
                    description: "Toggle phone number visibility"
                  friends:
                    type: array
                    default: []
                    items:
                      type: string
                required:
                  - username
        "401":
          description: Incorrect email or password!
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string

  #login endpoint
  /login:
    post:
      operationId: app.login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                password:
                  type: string
      responses:
        "200":
          description: User logged in
          content:
            application/json:
              schema:
                type: object
                properties:
                  email:
                    type: string
                  username:
                    type: string
                  firstName:
                    type: string
                  lastName:
                    type: string
                  phoneNumber:
                    type: string
                  age:
                    type: integer
                  city:
                    type: string
                  state:
                    type: string
                  country:
                    type: string
                  address:
                    type: string
                  gender:
                    type: string
                  zipCode: 
                    type: string
                  birthday:
                    type: string
                  friends:
                    type: array
                    items:
                      type: string
                  displayAge:
                    type: boolean
                    description: "Toggle age visibility"
                  displayLocation:
                    type: boolean
                    description: "Toggle location visibility"
                  accountPrivacy:
                    type: boolean
                    description: "Toggle account privacy"
                  displayPhoneNumber:
                    type: string
                    description: "Toggle phone number visibility"
                required:
                  - email
                  - username
        "401":
          description: Incorrect email or password!
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string

  /get_token:
    post:
      operationId: app.get_token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
      responses:
        "200":
          description: Password Reset email sent!
        "401":
          description: Email does not exist!
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string

  /input_reset_token:
    post:
      operationId: app.input_reset_token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                reqToken:
                  type: string
      responses:
        "200":
          description: Password Token Verified!
        "401":
          description: Incorrect token!
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string

  /change_user_password:
    post:
      operationId: app.change_password
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                password:
                  type: string
      responses:
        "200":
          description: Password Changed!
        "401":
          description: Error!
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string

  /update_profile:
    post:
      operationId: app.update_user_profile
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                firstName:
                  type: string
                lastName:
                  type: string
                username:
                  type: string
                phoneNumber:
                  type: string
                address:
                  type: string
                state:
                  type: string
                country:
                  type: string
                zipCode:
                  type: string
                city:
                  type: string
                age:
                  type: string
                gender:
                  type: string
                birthday:
                  type: string
      responses:
        "200":
          description: Profile updated successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
  /privacy:
    post:
      summary: "Update privacy settings"
      operationId: app.update_user_privacy
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                displayAge:
                  type: boolean
                  description: "Toggle age visibility"
                displayLocation:
                  type: boolean
                  description: "Toggle location visibility"
                accountPrivacy:
                  type: boolean
                  description: "Toggle account privacy"
                displayPhoneNumber:
                  type: string
                  description: "Toggle phone number visibility"
      responses:
        "200":
          description: "Profile updated successfully"
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string

  #   /update_games:
  #     post:
  #       operationId: app.gamesUpdate
  #       requestBody:
  #         required: true
  #         content:
  #           application/json:
  #             schema:
  #               type: object
  #               properties:
  #                 skill:
  #                   type: int
  #                 maxPlayers:
  #                   type: int
  #                 sport:
  #                   type: string
  #                 location:
  #                   type: string
  #                 which:
  #                   type: int
  #       responses:
  #         '201':
  #           description: User created successfully
  #         '401':
  #           description: Email already has an account!
  # # friends endpoint
  #   /retrieve_friends:
  #     get:
  #       summary: Retrieve Friends
  #       description: Retrieve a list of friends for a specific user.
  #       operationId: app.retrieve_friends
  #       parameters:
  #         - name: user_id
  #           in: query
  #           description: The user id for which to retrieve friends.
  #           required: true
  #           schema:
  #             type: string
  #       responses:
  #         '200':
  #           description: Successful response
  #           content:
  #             application/json:
  #               schema:
  #                 type: object
  #                 properties:
  #                   friends:
  #                     type: array
  #                     items:
  #                       type: string
  #         '400':
  #           description: Bad Request
  #         '500':
  #           description: Internal Server Error

# friends endpoint
  /send_friend_request:
    post:
      operationId: app.send_friend_request
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                friend_email:
                  type: string
      responses:
        "200":
          description: Friend request sent successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
        "204":
          description: There is already a request pending between you and this user!
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
  /accept_friend_request:
    post:
      operationId: app.accept_friend_request
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                friend_email:
                  type: string
      responses:
        "200":
          description: Friend request accepted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
        "401":
          description: Friend request already accepted!
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
  /deny_friend_request:
    post:
      operationId: app.deny_friend_request
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                friend_email:
                  type: string
      responses:
        "200":
          description: Friend request denied successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
        "401":
          description: Friend request already denied!
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
  /get_friend_requests:
    get:
      operationId: app.get_friend_requests
      parameters:
        - name: email
          in: query
          description: The email of the user to retrieve friend requests.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Friend requests retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    user:
                      type: string
                    friend:
                      type: string
                    status:
                      type: string
        '404':
          description: No friend requests found!
  /get_friends:
    get:
      operationId: app.get_friends
      parameters:
        - name: email
          in: query
          description: The email of the user to retrieve friends.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Friends retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    user:
                      type: string
                    friend:
                      type: string
                    status:
                      type: string
        '404':
          description: No friends found!
  /remove_friend:
    post:
      operationId: app.remove_friend
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                friend_email:
                  type: string
      responses:
        "200":
          description: Friend removed successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
        "401":
          description: Friend not found!
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
  /user_lookup:
    get:
      operationId: app.user_lookup
      parameters:
        - name: searchTerm
          in: query
          description: The search term (username, email, or phone number) to look up.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Users found
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: string
                    name:
                      type: string
                    username:
                      type: string
                    email:
                      type: string
                    phoneNumber:
                      type: string
                    firstName:
                      type: string
                    lastName:
                      type: string
        '404':
          description: No results found!

  /get_user_info:
    get:
      summary: Get User Information
      description: Retrieve user information from the database.
      operationId: app.get_user_info
      parameters:
        - name: email
          in: query
          description: The email of the user to retrieve information.
          required: true
          schema:
            type: string
      responses:
        '200':
          description: User information retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  firstName:
                    type: string
                  lastName:
                    type: string
                  username:
                    type: string
                  email:
                    type: string
                  phoneNumber:
                    type: string
                  address:
                    type: string
                  state:
                    type: string
                  country:
                    type: string
                  zipCode:
                    type: string
                  city:
                    type: string
                  age:
                    type: string
                  birthday:
                    type: string
                  gender:
                    type: string
        '404':
          description: User not found

  /submit_report:
    post:
      operationId: app.submit_report
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                reportReason:
                  type: string
                reportedUserEmail:
                  type: string
      responses:
        "200":
          description: Reported Successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
        "401":
          description: Not reported
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string

  /delete_account:
    post:
      operationId: app.delete_account
      requestBody:
        required: true
        content:
          text/plain:
            schema:
              type: string
      responses:
        "200":
          description: Account deleted
        "401":
          description: Error deleting account

  /get_events:
    get:
      summary: Get Event Information
      description: Retrieve event information from the database.
      operationId: app.get_events
      responses:
        "200":
          description: Event information retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    title:
                      type: string
                    desc:
                      type: string
        "404":
          description: Event not found
        
