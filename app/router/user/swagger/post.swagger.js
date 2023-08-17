/**
 * @swagger
 *  components:
 *      schemas:
 *          NewPost:
 *              type: object
 *              required:
 *                  -   caption
 *                  -   picture
 *              properties:
 *                  caption:
 *                      type: string
 *                      description: Enter a caption for your post
 *                  picture:
 *                      type: string
 *                      format: binary
 *                  tags:
 *                      type: string
 *                      description: No spaces between tags
 *          EditPost:
 *              type: object
 *              properties:
 *                  caption:
 *                      type: string
 *                      description: Enter a caption for your post
 *                  tags:
 *                      type: string
 *                      description: No spaces between tags
 *                  isShown:
 *                      type: boolean
 */

/**
 * @swagger
 * tags:
 *  name: User(PostSection)
 *  description: User's Post realated section
 */

/**
 * @swagger
 *  /user/posts:
 *      get:
 *          tags: [User(PostSection)]
 *          responses:
 *              200:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 */

/**
 * @swagger
 *  /user/posts/new:
 *      post:
 *          tags: [User(PostSection)]
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/NewPost'
 *          responses:
 *              200:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 */

/**
 * @swagger
 *  /user/posts/edit/{id}:
 *      patch:
 *          tags: [User(PostSection)]
 *          parameters:
 *              -   in: path
 *                  type: string
 *                  name: id
 *                  required: true
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/EditPost'
 *          responses:
 *              200:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 */

/**
 * @swagger
 *  /user/posts/delete/{id}:
 *      delete:
 *          tags: [User(PostSection)]
 *          parameters:
 *              -   in: path
 *                  type: string
 *                  name: id
 *                  required: true
 *          responses:
 *              200:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 */
