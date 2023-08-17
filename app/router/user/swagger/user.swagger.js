/**
 * @swagger
 *  components:
 *      schemas:
 *          Register:
 *              type: object
 *              required:
 *                  -   username
 *                  -   password
 *              properties:
 *                  username:
 *                      type: string
 *                      description: Enter a username
 *                  password:
 *                      type: string
 *                      description: Enter atleast 6 character for password
 *                  confirm_password:
 *                      type: string
 *                      description: Repeat the your password
 *                  email:
 *                      type: string
 *                      description: Email address
 *                  mobile:
 *                      type: string
 *                      description: Phone number
 *                  first_name:
 *                      type: string
 *                  last_name:
 *                      type: string
 *                  birthday:
 *                      type: date
 *                      description: Enter a date like 1990-21-03
 *          Login:
 *              type: object
 *              required:
 *                  -   username
 *                  -   password
 *              properties:
 *                  username:
 *                      type: string
 *                  password:
 *                      type: string
 *          UpdateUserInfo:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                      description: Enter a username
 *                  profile_image:
 *                      type: string
 *                      format: binary
 *                  email:
 *                      type: string
 *                      description: Email address
 *                  mobile:
 *                      type: string
 *                      description: Phone number
 *                  first_name:
 *                      type: string
 *                  last_name:
 *                      type: string
 *                  birthday:
 *                      type: date
 *                      description: Enter a date like 1990-21-03
 *          DeleteAccount:
 *              type: object
 *              required:
 *                  -   username
 *                  -   password
 *              properties:
 *                  username:
 *                      type: string
 *                      description: Enter your username
 *                  password:
 *                      type: string
 */

/**
 * @swagger
 * tags:
 *  name: UserSection
 *  description: User Section
 */

/**
 * @swagger
 *  /user/profile:
 *      get:
 *          tags: [UserSection]
 *          summary: User Profile
 *          responses:
 *              200:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 */

/**
 * @swagger
 *  /user/update:
 *      patch:
 *          tags: [UserSection]
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/UpdateUserInfo'
 *          responses:
 *              200:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 */

/**
 * @swagger
 *  /user/delete-account:
 *      delete:
 *          tags: [UserSection]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/DeleteAccount'
 *          responses:
 *              200:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 */