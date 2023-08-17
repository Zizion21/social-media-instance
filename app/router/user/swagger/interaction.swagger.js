
/**
 * @swagger
 * tags:
 *  name: User(InteractionsSection)
 *  description: User's Post realated section
 */

/**
 * @swagger
 *  /user/{targetUserID}/follow:
 *      patch:
 *          tags: [User(InteractionsSection)]
 *          parameters:
 *              -   in: path
 *                  name: targetUserID
 *                  required: true
 *                  type: string
 *          responses:
 *              200:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 */
/**
 * @swagger
 *  /user/{targetUserID}/unfollow:
 *      patch:
 *          tags: [User(InteractionsSection)]
 *          parameters:
 *              -   in: path
 *                  name: userID
 *                  required: true
 *                  type: string
 *          responses:
 *              200:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 */
