/**
 * @swagger
 *  components:
 *      schemas:
 *          Register:
 *              type: object
 *              required:
 *                  -   username
 *                  -   password
 *                  -   confirm_password
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
 *          RefreshToken:
 *              type: object
 *              required:
 *                  -   refreshToken
 *              properties:
 *                  refreshToken:
 *                      type: string
 *          ResetPassword:
 *              type: object
 *              required:
 *                  -   email
 *              properties:
 *                  email:
 *                      type: string
 *                      description: Add your email to reset password
 */

/**
 * @swagger
 * tags:
 *  name: UserAuth
 *  description: User Authentication Section
 */

/**
 * @swagger
 *  /auth/register:
 *      post:
 *          tags: [UserAuth]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/Register'
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Register'
 *          responses:
 *              200:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 */

/**
 * @swagger
 *  /auth/login:
 *      post:
 *          tags: [UserAuth]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/Login'
 *          responses:
 *              200:
 *                  description: Success
 *              400:
 *                  description: Bad Request
*/

/**
 * @swagger
 *  /auth/refresh-token:
 *      post:
 *          tags: [UserAuth]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/RefreshToken'
 *          responses:
 *              200:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 */
/**
 * @swagger
 *  /auth/reset-password:
 *      post:
 *          tags: [UserAuth]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/ResetPassword'
 *          responses:
 *              200:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 */