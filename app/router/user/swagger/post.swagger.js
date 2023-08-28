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
 *          LeaveComments:
 *              type: object
 *              required:
 *                  -   text
 *              properties:
 *                  text:
 *                      type: string
 *                      description: Write a comment...
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
 *          summary: Getting all of the user's posts.
 *          responses:
 *              200:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 */
/**
 * @swagger
 *  /user/posts/{id}:
 *      get:
 *          tags: [User(PostSection)] 
 *          summary: Getting a post by its ID.
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

/**
 * @swagger
 *  /user/posts/new:
 *      post:
 *          tags: [User(PostSection)]
 *          summary: Creating a new post.
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
 *          summary: Edit/update a post by its ID.
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
 *          summary: Delete a post by its ID.
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
/**
 * @swagger
 *  /user/posts/{id}/like:
 *      patch:
 *          tags: [User(PostSection)]
 *          parameters:
 *              -   in: path
 *                  type: string
 *                  name: id
 *                  required: true
 *          responses:
 *              200:
 *                  description: Success
 *              500:
 *                  description: Server Error
 */
/**
 * @swagger
 *  /user/posts/{id}/leave-comments:
 *      patch:
 *          tags: [User(PostSection)]
 *          summary: Leave comments on posts by postID.
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
 *                          $ref: '#/components/schemas/LeaveComments'
 *          responses:
 *              200:
 *                  description: Success
 *              500:
 *                  description: Server Error
 */
/**
 * @swagger
 *  /user/posts/{id}/{commentID}:
 *      patch:
 *          tags: [User(PostSection)]
 *          summary: Delete a comment by postID and commentID
 *          parameters:
 *              -   in: path
 *                  type: string
 *                  name: id
 *                  required: true
 *              -   in: path
 *                  type: string
 *                  name: commentID
 *                  required: true
 *          responses:
 *              200:
 *                  description: Success
 *              500:
 *                  description: Server Error
 */
